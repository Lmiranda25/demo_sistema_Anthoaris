import { repositories } from "@/data/repositories";
import type { Appointment } from "@/domain/entities";
import type { AppointmentStatus } from "@/domain/enums";
import {
  hasScheduleConflict,
  shouldConsumeSession,
} from "@/domain/policies/appointments";
import { derivePackageStatus } from "@/domain/policies/packages";
import { ScheduleConflictError, NotFoundError } from "@/domain/errors";
import { newId } from "@/lib/identifiers";

export interface CreateAppointmentInput {
  branchId: string;
  patientId: string;
  specialistId: string;
  packageId?: string;
  startsAt: string;
  endsAt: string;
}

/**
 * Crea una cita validando que el especialista no tenga otra superpuesta
 * (SSD 10 - Citas). La validación se hace en el servicio además de en la UI.
 */
export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<Appointment> {
  const existing = await repositories.appointments.list();
  if (
    hasScheduleConflict(
      {
        specialistId: input.specialistId,
        startsAt: input.startsAt,
        endsAt: input.endsAt,
      },
      existing,
    )
  ) {
    throw new ScheduleConflictError();
  }

  const appointment: Appointment = {
    id: newId("ap"),
    branchId: input.branchId,
    patientId: input.patientId,
    specialistId: input.specialistId,
    packageId: input.packageId || undefined,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    status: "scheduled",
    sessionConsumed: false,
  };
  await repositories.appointments.create(appointment);
  return appointment;
}

/** Reprograma una cita validando conflictos (ignorando la propia). */
export async function rescheduleAppointment(
  id: string,
  startsAt: string,
  endsAt: string,
): Promise<void> {
  const appt = await repositories.appointments.getById(id);
  if (!appt) throw new NotFoundError("La cita no existe.");

  const existing = await repositories.appointments.list();
  if (
    hasScheduleConflict(
      { specialistId: appt.specialistId, startsAt, endsAt },
      existing,
      id,
    )
  ) {
    throw new ScheduleConflictError();
  }
  await repositories.appointments.update(id, { startsAt, endsAt });
}

/**
 * Cambia el estado de una cita. Si pasa a "atendida" y corresponde, descuenta
 * UNA sesión del paquete, una sola vez (SSD 10 - Citas, Paquetes).
 *
 * Toda la operación es coherente: marcamos `sessionConsumed` al mismo tiempo
 * que incrementamos `usedSessions`, evitando el doble descuento.
 */
export async function changeAppointmentStatus(
  id: string,
  nextStatus: AppointmentStatus,
): Promise<void> {
  const appt = await repositories.appointments.getById(id);
  if (!appt) throw new NotFoundError("La cita no existe.");

  const consume = shouldConsumeSession(appt, nextStatus);

  if (consume && appt.packageId) {
    const pkg = await repositories.packages.getById(appt.packageId);
    if (pkg) {
      const usedSessions = Math.min(pkg.usedSessions + 1, pkg.totalSessions);
      const nextPkg = { ...pkg, usedSessions };
      await repositories.packages.update(pkg.id, {
        usedSessions,
        status: derivePackageStatus(nextPkg),
      });
    }
  }

  await repositories.appointments.update(id, {
    status: nextStatus,
    // Solo marcamos consumo cuando efectivamente descontamos.
    sessionConsumed: consume ? true : appt.sessionConsumed,
  });
}
