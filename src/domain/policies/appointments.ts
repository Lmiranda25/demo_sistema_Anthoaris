import type { Appointment } from "@/domain/entities";

/**
 * Determina si dos rangos de tiempo se solapan.
 * Se considera solapamiento estricto: dos citas que solo se tocan en el límite
 * (una termina justo cuando empieza la otra) NO se consideran en conflicto.
 */
export function rangesOverlap(
  aStart: string | number | Date,
  aEnd: string | number | Date,
  bStart: string | number | Date,
  bEnd: string | number | Date,
): boolean {
  const as = new Date(aStart).getTime();
  const ae = new Date(aEnd).getTime();
  const bs = new Date(bStart).getTime();
  const be = new Date(bEnd).getTime();
  return as < be && bs < ae;
}

/**
 * Detecta si una cita propuesta entra en conflicto de horario con las citas
 * existentes del mismo especialista (SSD 10 - "No se debe permitir que un
 * especialista tenga dos citas superpuestas").
 *
 * - Ignora la propia cita (al reprogramar) mediante `ignoreAppointmentId`.
 * - Ignora citas canceladas o con inasistencia (ya no ocupan el horario).
 */
export function hasScheduleConflict(
  candidate: Pick<Appointment, "specialistId" | "startsAt" | "endsAt">,
  existing: Appointment[],
  ignoreAppointmentId?: string,
): boolean {
  return existing.some((appt) => {
    if (appt.id === ignoreAppointmentId) return false;
    if (appt.specialistId !== candidate.specialistId) return false;
    if (appt.status === "cancelled" || appt.status === "no_show") return false;
    return rangesOverlap(candidate.startsAt, candidate.endsAt, appt.startsAt, appt.endsAt);
  });
}

/**
 * Indica si, al marcar una cita como "atendida", se debe descontar una sesión.
 * Solo se descuenta si la cita tiene paquete y aún no consumió sesión
 * (evita doble descuento, SSD 10 - "descuenta una sesión una sola vez").
 */
export function shouldConsumeSession(
  appt: Pick<Appointment, "status" | "packageId" | "sessionConsumed">,
  nextStatus: Appointment["status"],
): boolean {
  return (
    nextStatus === "attended" &&
    !!appt.packageId &&
    !appt.sessionConsumed
  );
}

/**
 * Indica si una cita atendida puede generar evolución clínica (SSD 4.6).
 */
export function canHaveClinicalProgress(
  appt: Pick<Appointment, "status">,
): boolean {
  return appt.status === "attended";
}
