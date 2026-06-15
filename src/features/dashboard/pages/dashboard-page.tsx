import { useMemo } from "react";
import {
  Banknote,
  UserPlus,
  CalendarCheck2,
  CalendarClock,
  CalendarX2,
  UserX,
  Percent,
  PackageX,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { PeriodSelector } from "@/features/dashboard/components/period-selector";
import {
  RevenueByServiceChart,
  RevenueTrendChart,
} from "@/features/dashboard/components/charts";
import { SpecialistPerformanceTable } from "@/features/dashboard/components/specialist-performance-table";
import {
  computeKpis,
  revenueByMonth,
  revenueByService,
  scopeByBranch,
  specialistPerformance,
  type DashboardSource,
} from "@/features/dashboard/dashboard.service";
import {
  useAppointments,
  usePackages,
  usePatients,
  usePayments,
  useServices,
  useSpecialists,
  useSpecialties,
} from "@/hooks/use-demo-data";
import { useScopedBranch } from "@/hooks/use-scoped-branch";
import { useFiltersStore } from "@/stores/filters.store";
import { formatCurrencyCompact } from "@/lib/currency";
import { LoadingCards, LoadingState } from "@/components/feedback/loading-state";

export function DashboardPage() {
  const patients = usePatients();
  const appointments = useAppointments();
  const payments = usePayments();
  const packages = usePackages();
  const specialists = useSpecialists();
  const specialties = useSpecialties();
  const services = useServices();
  const period = useFiltersStore((s) => s.period);
  const branchScope = useScopedBranch();

  const loaded =
    patients && appointments && payments && packages && specialists && specialties && services;

  const scoped = useMemo<DashboardSource | null>(() => {
    if (!loaded) return null;
    const source: DashboardSource = {
      patients,
      appointments,
      payments,
      packages,
      specialists,
      specialties,
      services,
    };
    return scopeByBranch(source, branchScope);
  }, [loaded, patients, appointments, payments, packages, specialists, specialties, services, branchScope]);

  const kpis = useMemo(() => (scoped ? computeKpis(scoped, period) : null), [scoped, period]);
  const trend = useMemo(() => (scoped ? revenueByMonth(scoped) : []), [scoped]);
  const byService = useMemo(() => (scoped ? revenueByService(scoped, period) : []), [scoped, period]);
  const performance = useMemo(
    () => (scoped ? specialistPerformance(scoped, period) : []),
    [scoped, period],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Indicadores de operación e ingresos"
        actions={<PeriodSelector />}
      />

      {!kpis ? (
        <>
          <LoadingCards />
          <LoadingState rows={3} />
        </>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Ingresos del periodo"
              value={formatCurrencyCompact(kpis.monthlyRevenue)}
              icon={Banknote}
              tone="success"
            />
            <KpiCard label="Pacientes nuevos" value={String(kpis.newPatients)} icon={UserPlus} />
            <KpiCard
              label="Sesiones realizadas"
              value={String(kpis.attendedSessions)}
              icon={CalendarCheck2}
            />
            <KpiCard
              label="Citas programadas"
              value={String(kpis.scheduledAppointments)}
              icon={CalendarClock}
            />
            <KpiCard
              label="Citas canceladas"
              value={String(kpis.cancelledAppointments)}
              icon={CalendarX2}
              tone="danger"
            />
            <KpiCard
              label="Inasistencias"
              value={String(kpis.noShowAppointments)}
              icon={UserX}
              tone="warning"
            />
            <KpiCard
              label="Ausentismo"
              value={`${Math.round(kpis.absenteeismRate * 100)}%`}
              icon={Percent}
              tone={kpis.absenteeismRate > 0.2 ? "danger" : "default"}
            />
            <KpiCard
              label="Paquetes por agotarse"
              value={String(kpis.expiringPackages)}
              icon={PackageX}
              tone={kpis.expiringPackages > 0 ? "warning" : "default"}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RevenueTrendChart data={trend} />
            <RevenueByServiceChart data={byService} />
          </div>

          <SpecialistPerformanceTable data={performance} />
        </>
      )}
    </div>
  );
}
