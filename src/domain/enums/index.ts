/** Roles de usuario del sistema (SSD 3.1). */
export type UserRole = "owner" | "receptionist" | "specialist";

/** Estados del ciclo de vida de una cita (SSD 4.5). */
export type AppointmentStatus =
  | "scheduled"
  | "confirmed"
  | "attended"
  | "cancelled"
  | "no_show";

/** Nivel de progreso registrado en una evolución clínica (SSD 4.6). */
export type ProgressLevel = "achieved" | "in_progress" | "needs_reinforcement";

/** Estado general de entidades archivables (paciente, especialista). */
export type ActiveStatus = "active" | "inactive";

/** Estado de un paquete de sesiones (SSD 9.3). */
export type PackageStatus = "active" | "completed" | "cancelled";

/** Etiquetas legibles en español para cada enum. */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  owner: "Súper Administrador",
  receptionist: "Recepcionista",
  specialist: "Especialista",
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  attended: "Atendida",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

export const PROGRESS_LEVEL_LABELS: Record<ProgressLevel, string> = {
  achieved: "Logrado",
  in_progress: "En proceso",
  needs_reinforcement: "Requiere refuerzo",
};

export const PACKAGE_STATUS_LABELS: Record<PackageStatus, string> = {
  active: "Activo",
  completed: "Completado",
  cancelled: "Cancelado",
};

export const ACTIVE_STATUS_LABELS: Record<ActiveStatus, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

/** Tono visual asociado a cada estado de cita, para los badges. */
export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";

export const APPOINTMENT_STATUS_TONES: Record<AppointmentStatus, BadgeTone> = {
  scheduled: "neutral",
  confirmed: "info",
  attended: "success",
  cancelled: "danger",
  no_show: "warning",
};

export const PROGRESS_LEVEL_TONES: Record<ProgressLevel, BadgeTone> = {
  achieved: "success",
  in_progress: "info",
  needs_reinforcement: "warning",
};
