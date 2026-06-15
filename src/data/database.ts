import Dexie, { type Table } from "dexie";
import type {
  Appointment,
  Branch,
  ClinicalProgress,
  DemoSettings,
  Guardian,
  Patient,
  Payment,
  Service,
  SessionPackage,
  Specialist,
  Specialty,
  User,
} from "@/domain/entities";

/**
 * Base de datos local de la demo (IndexedDB vía Dexie).
 *
 * IMPORTANTE (SSD 6.2): los componentes NO deben tocar esta base directamente.
 * Deben pasar siempre por los repositorios para que la fuente de datos pueda
 * sustituirse por una API real en el futuro.
 */
export class AnthoarisDemoDB extends Dexie {
  branches!: Table<Branch, string>;
  users!: Table<User, string>;
  guardians!: Table<Guardian, string>;
  patients!: Table<Patient, string>;
  specialties!: Table<Specialty, string>;
  specialists!: Table<Specialist, string>;
  services!: Table<Service, string>;
  appointments!: Table<Appointment, string>;
  clinicalProgress!: Table<ClinicalProgress, string>;
  packages!: Table<SessionPackage, string>;
  payments!: Table<Payment, string>;
  settings!: Table<DemoSettings, string>;

  constructor() {
    super("anthoaris-demo");
    this.version(1).stores({
      // Solo se indexan los campos que se consultan/filtran.
      branches: "id",
      users: "id, role, branchId",
      guardians: "id",
      patients: "id, branchId, guardianId, assignedSpecialistId, status",
      specialties: "id",
      specialists: "id, specialtyId, status",
      services: "id",
      appointments: "id, branchId, patientId, specialistId, packageId, status, startsAt",
      clinicalProgress: "id, appointmentId, patientId, specialistId",
      packages: "id, patientId, serviceId, branchId, status",
      payments: "id, packageId, patientId, branchId, paidAt",
      settings: "id",
    });
  }
}

export const db = new AnthoarisDemoDB();

/** Versión del esquema de datos semilla. Subir si cambia la forma del seed. */
export const SCHEMA_VERSION = 1;
