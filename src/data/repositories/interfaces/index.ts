import type {
  Appointment,
  Branch,
  ClinicalProgress,
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
 * Contratos de repositorio (SSD 6.2). Los servicios dependen de estas
 * interfaces, no de Dexie. Así, una `ApiPatientRepository` podría sustituir a
 * `DexiePatientRepository` sin tocar la capa de presentación.
 */

export interface PatientRepository {
  list(): Promise<Patient[]>;
  getById(id: string): Promise<Patient | undefined>;
  create(patient: Patient): Promise<void>;
  update(id: string, changes: Partial<Patient>): Promise<void>;
}

export interface GuardianRepository {
  list(): Promise<Guardian[]>;
  getById(id: string): Promise<Guardian | undefined>;
  create(guardian: Guardian): Promise<void>;
  update(id: string, changes: Partial<Guardian>): Promise<void>;
}

export interface SpecialistRepository {
  list(): Promise<Specialist[]>;
  getById(id: string): Promise<Specialist | undefined>;
  create(specialist: Specialist): Promise<void>;
  update(id: string, changes: Partial<Specialist>): Promise<void>;
}

export interface AppointmentRepository {
  list(): Promise<Appointment[]>;
  getById(id: string): Promise<Appointment | undefined>;
  create(appointment: Appointment): Promise<void>;
  update(id: string, changes: Partial<Appointment>): Promise<void>;
}

export interface ClinicalProgressRepository {
  list(): Promise<ClinicalProgress[]>;
  getByAppointment(appointmentId: string): Promise<ClinicalProgress | undefined>;
  create(progress: ClinicalProgress): Promise<void>;
}

export interface PackageRepository {
  list(): Promise<SessionPackage[]>;
  getById(id: string): Promise<SessionPackage | undefined>;
  create(pkg: SessionPackage): Promise<void>;
  update(id: string, changes: Partial<SessionPackage>): Promise<void>;
}

export interface PaymentRepository {
  list(): Promise<Payment[]>;
  create(payment: Payment): Promise<void>;
}

export interface ReferenceRepository {
  branches(): Promise<Branch[]>;
  specialties(): Promise<Specialty[]>;
  services(): Promise<Service[]>;
  users(): Promise<User[]>;
}
