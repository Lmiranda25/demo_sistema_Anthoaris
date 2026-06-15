import { db } from "@/data/database";
import type {
  AppointmentRepository,
  ClinicalProgressRepository,
  GuardianRepository,
  PackageRepository,
  PatientRepository,
  PaymentRepository,
  ReferenceRepository,
  SpecialistRepository,
} from "@/data/repositories/interfaces";

/**
 * Implementaciones de repositorio sobre Dexie/IndexedDB (SSD 6.2).
 * Cada una es la traducción directa de su interfaz a la base local.
 */

export const dexiePatientRepository: PatientRepository = {
  list: () => db.patients.toArray(),
  getById: (id) => db.patients.get(id),
  create: async (patient) => {
    await db.patients.add(patient);
  },
  update: async (id, changes) => {
    await db.patients.update(id, changes);
  },
};

export const dexieGuardianRepository: GuardianRepository = {
  list: () => db.guardians.toArray(),
  getById: (id) => db.guardians.get(id),
  create: async (guardian) => {
    await db.guardians.add(guardian);
  },
  update: async (id, changes) => {
    await db.guardians.update(id, changes);
  },
};

export const dexieSpecialistRepository: SpecialistRepository = {
  list: () => db.specialists.toArray(),
  getById: (id) => db.specialists.get(id),
  create: async (specialist) => {
    await db.specialists.add(specialist);
  },
  update: async (id, changes) => {
    await db.specialists.update(id, changes);
  },
};

export const dexieAppointmentRepository: AppointmentRepository = {
  list: () => db.appointments.toArray(),
  getById: (id) => db.appointments.get(id),
  create: async (appointment) => {
    await db.appointments.add(appointment);
  },
  update: async (id, changes) => {
    await db.appointments.update(id, changes);
  },
};

export const dexieClinicalProgressRepository: ClinicalProgressRepository = {
  list: () => db.clinicalProgress.toArray(),
  getByAppointment: (appointmentId) =>
    db.clinicalProgress.where("appointmentId").equals(appointmentId).first(),
  create: async (progress) => {
    await db.clinicalProgress.add(progress);
  },
};

export const dexiePackageRepository: PackageRepository = {
  list: () => db.packages.toArray(),
  getById: (id) => db.packages.get(id),
  create: async (pkg) => {
    await db.packages.add(pkg);
  },
  update: async (id, changes) => {
    await db.packages.update(id, changes);
  },
};

export const dexiePaymentRepository: PaymentRepository = {
  list: () => db.payments.toArray(),
  create: async (payment) => {
    await db.payments.add(payment);
  },
};

export const dexieReferenceRepository: ReferenceRepository = {
  branches: () => db.branches.toArray(),
  specialties: () => db.specialties.toArray(),
  services: () => db.services.toArray(),
  users: () => db.users.toArray(),
};
