import { AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SessionPackage } from "@/domain/entities";
import { packageAlertLevel, remainingSessions } from "@/domain/policies/packages";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/dates";

/**
 * Muestra el progreso de un paquete con su barra y alerta de renovación
 * (SSD 4.7, 10). Estados: normal, advertencia (1 sesión), crítico (0 sesiones).
 */
export function PackageProgress({ pkg }: { pkg: SessionPackage }) {
  const remaining = remainingSessions(pkg);
  const level = packageAlertLevel(pkg);
  const pct = pkg.totalSessions > 0 ? (pkg.usedSessions / pkg.totalSessions) * 100 : 0;

  const barColor =
    level === "critical" ? "bg-destructive" : level === "warning" ? "bg-warning" : "bg-primary";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Sesiones</span>
        <span className="font-medium">
          {pkg.usedSessions} / {pkg.totalSessions} usadas
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Restantes</span>
        <span className="font-medium">{remaining}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Precio</span>
        <span className="font-medium">{formatCurrency(pkg.price)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Compra</span>
        <span className="font-medium">{formatDate(pkg.purchasedAt)}</span>
      </div>

      {level === "warning" && (
        <Badge tone="warning" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Queda 1 sesión
        </Badge>
      )}
      {level === "critical" && (
        <Badge tone="danger" className="gap-1">
          <AlertCircle className="h-3 w-3" />
          Renovación requerida
        </Badge>
      )}
    </div>
  );
}

/** Indicador compacto de alerta para tablas/listas. */
export function PackageAlertBadge({ pkg }: { pkg: SessionPackage }) {
  const level = packageAlertLevel(pkg);
  const remaining = remainingSessions(pkg);
  if (level === "normal") {
    return <Badge tone="neutral">{remaining} restantes</Badge>;
  }
  if (level === "warning") {
    return <Badge tone="warning">Queda 1</Badge>;
  }
  return <Badge tone="danger">Sin sesiones</Badge>;
}
