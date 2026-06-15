import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Package,
  BarChart3,
  Settings,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import type { Capability } from "@/lib/permissions";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Capacidad requerida para ver el ítem. Si se omite, siempre visible. */
  capability?: Capability;
}

/** Navegación del área administrativa (dueño y recepcionista) — SSD 8. */
export const APP_NAV: NavItem[] = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard, capability: "view:dashboard" },
  { to: "/app/patients", label: "Pacientes", icon: Users, capability: "manage:patients" },
  { to: "/app/specialists", label: "Especialistas", icon: Stethoscope, capability: "manage:specialists" },
  { to: "/app/appointments", label: "Agenda", icon: CalendarDays, capability: "manage:appointments" },
  { to: "/app/packages", label: "Paquetes", icon: Package, capability: "manage:packages" },
  { to: "/app/reports", label: "Reportes", icon: BarChart3, capability: "view:reports" },
  { to: "/app/settings", label: "Configuración", icon: Settings, capability: "view:settings" },
];

/** Navegación del especialista (vista propia) — SSD 8. */
export const SPECIALIST_NAV: NavItem[] = [
  { to: "/specialist/today", label: "Hoy", icon: CalendarCheck },
  { to: "/specialist/patients", label: "Mis pacientes", icon: Users },
];
