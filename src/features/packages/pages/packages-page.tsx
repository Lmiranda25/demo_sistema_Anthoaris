import { useMemo, useState } from "react";
import { Plus, Package, RefreshCw, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PackageAlertBadge } from "@/features/packages/components/package-progress";
import { PackageFormDialog } from "@/features/packages/components/package-form-dialog";
import { RenewPackageDialog } from "@/features/packages/components/renew-package-dialog";
import { usePackages, usePatients, useServices } from "@/hooks/use-demo-data";
import { useScopedBranch, filterByBranch } from "@/hooks/use-scoped-branch";
import { packageAlertLevel, remainingSessions } from "@/domain/policies/packages";
import { formatCurrency } from "@/lib/currency";
import type { SessionPackage } from "@/domain/entities";

export function PackagesPage() {
  const packages = usePackages();
  const patients = usePatients();
  const services = useServices();
  const scope = useScopedBranch();
  const [createOpen, setCreateOpen] = useState(false);
  const [renewTarget, setRenewTarget] = useState<SessionPackage | null>(null);

  const rows = useMemo(() => {
    const scoped = filterByBranch(packages, scope);
    // Ordena primero los que requieren atención (crítico, luego advertencia).
    const weight = (p: SessionPackage) => {
      const lvl = packageAlertLevel(p);
      return lvl === "critical" ? 0 : lvl === "warning" ? 1 : 2;
    };
    return [...scoped].sort((a, b) => weight(a) - weight(b));
  }, [packages, scope]);

  const alerts = rows.filter((p) => p.status === "active" && remainingSessions(p) <= 1);

  const patientName = (id: string) => {
    const p = patients?.find((x) => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "—";
  };
  const serviceName = (id: string) => services?.find((s) => s.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Paquetes y sesiones"
        description="Ventas, consumo de sesiones y renovaciones"
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo paquete
          </Button>
        }
      />

      {alerts.length > 0 && (
        <Card className="border-warning/40 bg-warning/10">
          <CardContent className="flex items-center gap-3 py-4 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-warning-foreground" />
            <span>
              <strong>{alerts.length}</strong>{" "}
              {alerts.length === 1 ? "paquete necesita" : "paquetes necesitan"} renovación próxima.
            </span>
          </CardContent>
        </Card>
      )}

      {!packages ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aún no hay paquetes"
          description="Registra el primer paquete de sesiones."
        />
      ) : (
        <>
          {/* Escritorio/tablet: tabla */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Sesiones</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{patientName(pkg.patientId)}</TableCell>
                    <TableCell className="text-muted-foreground">{serviceName(pkg.serviceId)}</TableCell>
                    <TableCell>
                      {pkg.usedSessions}/{pkg.totalSessions}
                    </TableCell>
                    <TableCell>
                      <PackageAlertBadge pkg={pkg} />
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(pkg.price)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setRenewTarget(pkg)}>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Renovar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Móvil: tarjetas */}
          <div className="space-y-3 md:hidden">
            {rows.map((pkg) => (
              <Card key={pkg.id}>
                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium">{patientName(pkg.patientId)}</div>
                      <div className="text-sm text-muted-foreground">{serviceName(pkg.serviceId)}</div>
                    </div>
                    <PackageAlertBadge pkg={pkg} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {pkg.usedSessions}/{pkg.totalSessions} sesiones
                    </span>
                    <span className="font-medium">{formatCurrency(pkg.price)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setRenewTarget(pkg)}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Renovar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <PackageFormDialog open={createOpen} onOpenChange={setCreateOpen} />
      <RenewPackageDialog
        open={!!renewTarget}
        onOpenChange={(o) => !o && setRenewTarget(null)}
        pkg={renewTarget}
      />
    </div>
  );
}
