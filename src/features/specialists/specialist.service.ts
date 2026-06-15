import { repositories } from "@/data/repositories";
import type { Specialist } from "@/domain/entities";
import { newId } from "@/lib/identifiers";

export interface SpecialistFormInput {
  firstName: string;
  lastName: string;
  specialtyId: string;
  branchIds: string[];
  schedule: string;
  email: string;
}

export async function createSpecialist(input: SpecialistFormInput): Promise<Specialist> {
  const specialist: Specialist = {
    id: newId("sp"),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    specialtyId: input.specialtyId,
    branchIds: input.branchIds,
    schedule: input.schedule.trim(),
    status: "active",
    email: input.email.trim(),
  };
  await repositories.specialists.create(specialist);
  return specialist;
}

export async function updateSpecialist(
  id: string,
  input: SpecialistFormInput,
): Promise<void> {
  await repositories.specialists.update(id, {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    specialtyId: input.specialtyId,
    branchIds: input.branchIds,
    schedule: input.schedule.trim(),
    email: input.email.trim(),
  });
}

export async function setSpecialistStatus(
  id: string,
  status: Specialist["status"],
): Promise<void> {
  await repositories.specialists.update(id, { status });
}
