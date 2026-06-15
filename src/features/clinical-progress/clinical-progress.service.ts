import { repositories } from "@/data/repositories";
import type { ClinicalProgress } from "@/domain/entities";
import type { ProgressLevel } from "@/domain/enums";
import { canHaveClinicalProgress } from "@/domain/policies/appointments";
import { BusinessRuleError, NotFoundError } from "@/domain/errors";
import { newId } from "@/lib/identifiers";

export interface CreateClinicalProgressInput {
  appointmentId: string;
  objective: string;
  observations: string;
  level: ProgressLevel;
}

/**
 * Registra una evolución clínica vinculada a una cita ATENDIDA (SSD 4.6).
 * La cita aporta paciente y especialista, garantizando la vinculación correcta.
 */
export async function createClinicalProgress(
  input: CreateClinicalProgressInput,
): Promise<ClinicalProgress> {
  const appt = await repositories.appointments.getById(input.appointmentId);
  if (!appt) throw new NotFoundError("La cita no existe.");
  if (!canHaveClinicalProgress(appt)) {
    throw new BusinessRuleError("Solo una cita atendida puede tener evolución clínica.");
  }

  const existing = await repositories.clinicalProgress.getByAppointment(input.appointmentId);
  if (existing) {
    throw new BusinessRuleError("Esta cita ya tiene una evolución registrada.");
  }

  const progress: ClinicalProgress = {
    id: newId("cp"),
    appointmentId: appt.id,
    patientId: appt.patientId,
    specialistId: appt.specialistId,
    date: appt.startsAt,
    objective: input.objective.trim(),
    observations: input.observations.trim(),
    level: input.level,
    createdAt: new Date().toISOString(),
  };
  await repositories.clinicalProgress.create(progress);
  return progress;
}
