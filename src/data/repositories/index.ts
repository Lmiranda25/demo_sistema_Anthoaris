/**
 * Punto único de acceso a los repositorios. Los servicios importan desde aquí.
 * Para cambiar a una API real en el futuro, basta con sustituir estas
 * asignaciones por implementaciones `Api*Repository` (SSD 6.2, 20).
 */
import {
  dexieAppointmentRepository,
  dexieClinicalProgressRepository,
  dexieGuardianRepository,
  dexiePackageRepository,
  dexiePatientRepository,
  dexiePaymentRepository,
  dexieReferenceRepository,
  dexieSpecialistRepository,
} from "@/data/repositories/dexie";

export const repositories = {
  patients: dexiePatientRepository,
  guardians: dexieGuardianRepository,
  specialists: dexieSpecialistRepository,
  appointments: dexieAppointmentRepository,
  clinicalProgress: dexieClinicalProgressRepository,
  packages: dexiePackageRepository,
  payments: dexiePaymentRepository,
  reference: dexieReferenceRepository,
} as const;
