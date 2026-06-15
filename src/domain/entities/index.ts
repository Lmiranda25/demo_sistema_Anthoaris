import type {
  ActiveStatus,
  AppointmentStatus,
  PackageStatus,
  ProgressLevel,
  UserRole,
} from "@/domain/enums";

/** Sede física del centro (SSD 9.1). */
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  color: string; // color identificador para gráficos/badges
}

/** Usuario simulado para el login (SSD 4.1). No tiene contraseña real. */
export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  /** Sede asignada. El dueño no tiene una única sede (acceso a todas). */
  branchId?: string;
  /** Si el usuario es especialista, su ficha de especialista vinculada. */
  specialistId?: string;
  email: string;
}

/** Apoderado responsable de uno o más pacientes (SSD 4.3). */
export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string; // parentesco
  phone: string;
  email: string;
  createdAt: string;
}

/** Paciente atendido en el centro (SSD 9.3). */
export interface Patient {
  id: string;
  branchId: string;
  guardianId: string;
  assignedSpecialistId?: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date
  initialReason: string; // motivo de consulta o diagnóstico inicial
  status: ActiveStatus;
  createdAt: string;
}

/** Especialidad terapéutica (SSD 9.1). */
export interface Specialty {
  id: string;
  name: string;
}

/** Especialista que atiende pacientes (SSD 4.4). */
export interface Specialist {
  id: string;
  firstName: string;
  lastName: string;
  specialtyId: string;
  /** Un especialista puede atender en una o varias sedes. */
  branchIds: string[];
  schedule: string; // horario en texto libre para la demo
  status: ActiveStatus;
  email: string;
}

/** Servicio ofrecido (asociado a paquetes de sesiones) (SSD 9.1). */
export interface Service {
  id: string;
  name: string;
  defaultSessionPrice: number;
}

/** Cita en la agenda (SSD 9.3). */
export interface Appointment {
  id: string;
  branchId: string;
  patientId: string;
  specialistId: string;
  packageId?: string;
  startsAt: string; // ISO datetime
  endsAt: string; // ISO datetime
  status: AppointmentStatus;
  /** Marca que esta cita ya descontó una sesión (evita doble descuento, SSD 10). */
  sessionConsumed: boolean;
  notes?: string;
}

/** Evolución clínica vinculada a una cita atendida (SSD 4.6). */
export interface ClinicalProgress {
  id: string;
  appointmentId: string;
  patientId: string;
  specialistId: string;
  date: string; // ISO datetime
  objective: string; // objetivo trabajado
  observations: string;
  level: ProgressLevel;
  createdAt: string;
}

/** Paquete de sesiones comprado por un paciente (SSD 9.3). */
export interface SessionPackage {
  id: string;
  patientId: string;
  serviceId: string;
  branchId: string;
  totalSessions: number;
  usedSessions: number;
  price: number;
  purchasedAt: string; // ISO datetime
  status: PackageStatus;
}

/** Pago/venta ficticia asociada a un paquete (SSD 9.1). */
export interface Payment {
  id: string;
  packageId: string;
  patientId: string;
  branchId: string;
  amount: number;
  paidAt: string; // ISO datetime
  concept: string;
}

/** Configuración interna de la demo (SSD 9.1, 12). */
export interface DemoSettings {
  id: string; // siempre "singleton"
  seededAt: string;
  schemaVersion: number;
}
