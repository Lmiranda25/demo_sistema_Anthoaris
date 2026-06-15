import type { UserRole } from "@/domain/enums";

/**
 * Capacidades del sistema. Los componentes ocultan controles según estas
 * capacidades y los servicios las validan (SSD 10 - Permisos).
 *
 * NOTA: en producción los permisos DEBEN validarse en el servidor. Aquí son
 * solo de presentación.
 */
export type Capability =
  | "view:dashboard"
  | "view:financials" // ingresos, pagos, reportes globales
  | "view:reports"
  | "manage:patients"
  | "view:patients:all" // ve todos los pacientes (no solo los asignados)
  | "manage:specialists"
  | "manage:appointments"
  | "manage:packages"
  | "register:payments"
  | "view:clinical:full" // ve el texto clínico completo
  | "view:clinical:exists" // solo ve que existe una evolución
  | "create:clinical" // crea evoluciones
  | "view:all-branches" // acceso a todas las sedes
  | "view:settings"
  | "reset:demo";

const ROLE_CAPABILITIES: Record<UserRole, Capability[]> = {
  // Súper Administrador: acceso amplio, vista consolidada (SSD 3.1)
  owner: [
    "view:dashboard",
    "view:financials",
    "view:reports",
    "manage:patients",
    "view:patients:all",
    "manage:specialists",
    "manage:appointments",
    "manage:packages",
    "view:clinical:full", // solo para fines de demostración (SSD 4.6)
    "view:all-branches",
    "view:settings",
    "reset:demo",
  ],
  // Recepcionista: solo su sede, sin clínica detallada ni reportes globales
  receptionist: [
    "view:dashboard",
    "manage:patients",
    "view:patients:all",
    "manage:appointments",
    "manage:packages",
    "register:payments",
    "view:clinical:exists",
  ],
  // Especialista: su agenda, sus pacientes, su clínica. Sin dinero (SSD 3.1)
  specialist: [
    "view:patients:all", // pero limitado a asignados vía servicio
    "manage:appointments",
    "view:clinical:full",
    "create:clinical",
  ],
};

/** ¿El rol tiene la capacidad indicada? */
export function can(role: UserRole | undefined, capability: Capability): boolean {
  if (!role) return false;
  return ROLE_CAPABILITIES[role].includes(capability);
}

/** ¿El rol tiene TODAS las capacidades indicadas? */
export function canAll(role: UserRole | undefined, capabilities: Capability[]): boolean {
  return capabilities.every((c) => can(role, c));
}

/** ¿El rol tiene AL MENOS UNA de las capacidades? */
export function canAny(role: UserRole | undefined, capabilities: Capability[]): boolean {
  return capabilities.some((c) => can(role, c));
}
