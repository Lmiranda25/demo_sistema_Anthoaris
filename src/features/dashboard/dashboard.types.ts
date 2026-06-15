import type { ProgressLevel } from "@/domain/enums";

/** KPIs principales del dashboard (SSD 4.2). */
export interface DashboardKpis {
  monthlyRevenue: number;
  newPatients: number;
  attendedSessions: number;
  scheduledAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  absenteeismRate: number; // 0..1
  expiringPackages: number; // paquetes con 0 o 1 sesión restante
}

/** Ingreso por tipo de servicio (SSD 4.2). */
export interface RevenueByService {
  serviceName: string;
  amount: number;
}

/** Ingreso por mes para la tendencia. */
export interface RevenueByMonth {
  label: string;
  amount: number;
}

/** Rendimiento de un especialista (SSD 4.2). */
export interface SpecialistPerformance {
  specialistId: string;
  name: string;
  specialty: string;
  attendedSessions: number;
  activePatients: number;
  absenteeismRate: number;
}

/** Distribución de niveles de progreso clínico. */
export type ProgressDistribution = Record<ProgressLevel, number>;
