import type {
  Appointment,
  Patient,
  Payment,
  Service,
  SessionPackage,
  Specialist,
  Specialty,
} from "@/domain/entities";
import { absenteeismRate } from "@/domain/policies/metrics";
import { remainingSessions } from "@/domain/policies/packages";
import type {
  DashboardKpis,
  RevenueByMonth,
  RevenueByService,
  SpecialistPerformance,
} from "@/features/dashboard/dashboard.types";

/** Conjunto de datos crudos que el dashboard necesita para calcular KPIs. */
export interface DashboardSource {
  patients: Patient[];
  appointments: Appointment[];
  payments: Payment[];
  packages: SessionPackage[];
  specialists: Specialist[];
  specialties: Specialty[];
  services: Service[];
}

/** Rango de fechas inclusivo [desde, hasta] elegido en el calendario. */
export type DateTuple = [Date, Date];

/** Pertenencia inclusiva al rango (el calendario entrega 'hasta' = fin del día). */
function inRange(iso: string, [from, to]: DateTuple): boolean {
  const t = new Date(iso).getTime();
  return t >= from.getTime() && t <= to.getTime();
}

/** Filtra el conjunto por sede ("all" = sin filtro). */
export function scopeByBranch(source: DashboardSource, branchScope: string): DashboardSource {
  if (branchScope === "all") return source;
  return {
    ...source,
    patients: source.patients.filter((p) => p.branchId === branchScope),
    appointments: source.appointments.filter((a) => a.branchId === branchScope),
    payments: source.payments.filter((p) => p.branchId === branchScope),
    packages: source.packages.filter((p) => p.branchId === branchScope),
    specialists: source.specialists.filter((s) => s.branchIds.includes(branchScope)),
  };
}

export function computeKpis(source: DashboardSource, range: DateTuple): DashboardKpis {
  const paymentsInRange = source.payments.filter((p) => inRange(p.paidAt, range));
  const apptsInRange = source.appointments.filter((a) => inRange(a.startsAt, range));
  const patientsInRange = source.patients.filter((p) => inRange(p.createdAt, range));

  const monthlyRevenue = paymentsInRange.reduce((sum, p) => sum + p.amount, 0);

  const attendedSessions = apptsInRange.filter((a) => a.status === "attended").length;
  const scheduledAppointments = apptsInRange.filter(
    (a) => a.status === "scheduled" || a.status === "confirmed",
  ).length;
  const cancelledAppointments = apptsInRange.filter((a) => a.status === "cancelled").length;
  const noShowAppointments = apptsInRange.filter((a) => a.status === "no_show").length;

  const expiringPackages = source.packages.filter(
    (pkg) => pkg.status === "active" && remainingSessions(pkg) <= 1,
  ).length;

  return {
    monthlyRevenue,
    newPatients: patientsInRange.length,
    attendedSessions,
    scheduledAppointments,
    cancelledAppointments,
    noShowAppointments,
    absenteeismRate: absenteeismRate(apptsInRange),
    expiringPackages,
  };
}

export function revenueByService(
  source: DashboardSource,
  range: DateTuple,
): RevenueByService[] {
  const packageById = new Map(source.packages.map((p) => [p.id, p]));
  const serviceById = new Map(source.services.map((s) => [s.id, s]));
  const totals = new Map<string, number>();

  for (const payment of source.payments) {
    if (!inRange(payment.paidAt, range)) continue;
    const pkg = packageById.get(payment.packageId);
    const service = pkg ? serviceById.get(pkg.serviceId) : undefined;
    const name = service?.name ?? "Otros";
    totals.set(name, (totals.get(name) ?? 0) + payment.amount);
  }

  return [...totals.entries()]
    .map(([serviceName, amount]) => ({ serviceName, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function revenueByMonth(
  source: DashboardSource,
  months = 6,
  now = new Date(),
): RevenueByMonth[] {
  const labels = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const result: RevenueByMonth[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const from = date.getTime();
    const to = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
    const amount = source.payments
      .filter((p) => {
        const t = new Date(p.paidAt).getTime();
        return t >= from && t < to;
      })
      .reduce((sum, p) => sum + p.amount, 0);
    result.push({ label: labels[date.getMonth()], amount });
  }
  return result;
}

export function specialistPerformance(
  source: DashboardSource,
  range: DateTuple,
): SpecialistPerformance[] {
  const specialtyById = new Map(source.specialties.map((s) => [s.id, s]));

  return source.specialists
    .map((sp) => {
      const appts = source.appointments.filter(
        (a) => a.specialistId === sp.id && inRange(a.startsAt, range),
      );
      const attendedSessions = appts.filter((a) => a.status === "attended").length;
      const activePatients = source.patients.filter(
        (p) => p.assignedSpecialistId === sp.id && p.status === "active",
      ).length;
      return {
        specialistId: sp.id,
        name: `${sp.firstName} ${sp.lastName}`,
        specialty: specialtyById.get(sp.specialtyId)?.name ?? "—",
        attendedSessions,
        activePatients,
        absenteeismRate: absenteeismRate(appts),
      };
    })
    .sort((a, b) => b.attendedSessions - a.attendedSessions);
}
