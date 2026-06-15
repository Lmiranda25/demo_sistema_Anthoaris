import { useMemo } from "react";
import { PageHeader } from "@/components/common/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/feedback/loading-state";
import { RevenueTrendChart } from "@/features/dashboard/components/charts";
import { PeriodSelector } from "@/features/dashboard/components/period-selector";
import {
  computeKpis,
  revenueByMonth,
  scopeByBranch,
  type DashboardSource,
} from "@/features/dashboard/dashboard.service";
import { absenteeismRate } from "@/domain/policies/metrics";
import {
  useAppointments,
  useBranches,
  usePackages,
  usePatients,
  usePayments,
  useServices,
  useSpecialists,
  useSpecialties,
} from "@/hooks/use-demo-data";
import { useFiltersStore } from "@/stores/filters.store";
import { formatCurrency } from "@/lib/currency";

/**
 * Reportes financieros y de ausentismo por sede (SSD 3.1 - acceso del dueño).
 * Compara las dos sedes lado a lado.
 */
export function ReportsPage() {
  const patients = usePatients();
  const appointments = useAppointments();
  const payments = usePayments();
  const packages = usePackages();
  const specialists = useSpecialists();
  const specialties = useSpecialties();
  const services = useServices();
  const branches = useBranches();
  const period = useFiltersStore((s) => s.period);

  const loaded =
    patients && appointments && payments && packages && specialists && specialties && services && branches;

  const source = useMemo<DashboardSource | null>(() => {
    if (!loaded) return null;
    return { patients, appointments, payments, packages, specialists, specialties, services };
  }, [loaded, patients, appointments, payments, packages, specialists, specialties, services]);

  const byBranch = useMemo(() => {
    if (!source || !branches) return [];
    return branches.map((branch) => {
      const scoped = scopeByBranch(source, branch.id);
      const kpis = computeKpis(scoped, period);
      return {
        branch,
        revenue: kpis.monthlyRevenue,
        attended: kpis.attendedSessions,
        newPatients: kpis.newPatients,
        absenteeism: kpis.absenteeismRate,
      };
    });
  }, [source, branches, period]);

  const consolidatedTrend = useMemo(() => (source ? revenueByMonth(source) : []), [source]);

  const totalAbsenteeism = source ? absenteeismRate(source.appointments) : 0;
  const totalRevenue = byBranch.reduce((sum, b) => sum + b.revenue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        description="Comparativo financiero y de ausentismo por sede"
        actions={<PeriodSelector />}
      />

      {!source ? (
        <LoadingState rows={4} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="py-5">
                <div className="text-sm text-muted-foreground">Ingresos totales</div>
                <div className="mt-1 text-2xl font-semibold">{formatCurrency(totalRevenue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5">
                <div className="text-sm text-muted-foreground">Ausentismo global</div>
                <div className="mt-1 text-2xl font-semibold">
                  {Math.round(totalAbsenteeism * 100)}%
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-5">
                <div className="text-sm text-muted-foreground">Sedes activas</div>
                <div className="mt-1 text-2xl font-semibold">{branches?.length ?? 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Comparativo por sede</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sede</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Sesiones</TableHead>
                    <TableHead className="text-right">Pacientes nuevos</TableHead>
                    <TableHead className="text-right">Ausentismo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byBranch.map((b) => (
                    <TableRow key={b.branch.id}>
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: b.branch.color }}
                          />
                          {b.branch.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(b.revenue)}</TableCell>
                      <TableCell className="text-right">{b.attended}</TableCell>
                      <TableCell className="text-right">{b.newPatients}</TableCell>
                      <TableCell className="text-right">
                        <Badge tone={b.absenteeism > 0.2 ? "danger" : "neutral"}>
                          {Math.round(b.absenteeism * 100)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <RevenueTrendChart data={consolidatedTrend} />
        </>
      )}
    </div>
  );
}
