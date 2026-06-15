import { repositories } from "@/data/repositories";
import type { Guardian, Patient } from "@/domain/entities";
import { newId } from "@/lib/identifiers";

export interface CreatePatientInput {
  // Paciente
  firstName: string;
  lastName: string;
  birthDate: string;
  branchId: string;
  initialReason: string;
  assignedSpecialistId?: string;
  // Apoderado (todo paciente debe tener uno, SSD 10)
  guardianFirstName: string;
  guardianLastName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
}

/**
 * Crea un paciente junto a su apoderado. Regla de negocio (SSD 10):
 * "Todo paciente debe tener un apoderado" — por eso ambos se crean juntos.
 */
export async function createPatient(input: CreatePatientInput): Promise<Patient> {
  const now = new Date().toISOString();

  const guardian: Guardian = {
    id: newId("gd"),
    firstName: input.guardianFirstName.trim(),
    lastName: input.guardianLastName.trim(),
    relationship: input.guardianRelationship.trim(),
    phone: input.guardianPhone.trim(),
    email: input.guardianEmail.trim(),
    createdAt: now,
  };
  await repositories.guardians.create(guardian);

  const patient: Patient = {
    id: newId("pt"),
    branchId: input.branchId,
    guardianId: guardian.id,
    assignedSpecialistId: input.assignedSpecialistId || undefined,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    birthDate: input.birthDate,
    initialReason: input.initialReason.trim(),
    status: "active",
    createdAt: now,
  };
  await repositories.patients.create(patient);
  return patient;
}

export interface UpdatePatientInput {
  firstName: string;
  lastName: string;
  birthDate: string;
  branchId: string;
  initialReason: string;
  assignedSpecialistId?: string;
}

export async function updatePatient(id: string, input: UpdatePatientInput): Promise<void> {
  await repositories.patients.update(id, {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    birthDate: input.birthDate,
    branchId: input.branchId,
    initialReason: input.initialReason.trim(),
    assignedSpecialistId: input.assignedSpecialistId || undefined,
  });
}

export async function updateGuardian(
  id: string,
  changes: Partial<Omit<Guardian, "id" | "createdAt">>,
): Promise<void> {
  await repositories.guardians.update(id, changes);
}

/**
 * Archiva un paciente (SSD 10: "No se elimina físicamente un paciente; se
 * cambia su estado"). Se alterna entre activo e inactivo.
 */
export async function setPatientStatus(
  id: string,
  status: Patient["status"],
): Promise<void> {
  await repositories.patients.update(id, { status });
}
