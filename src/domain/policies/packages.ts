import type { SessionPackage } from "@/domain/entities";

/**
 * Sesiones restantes de un paquete (SSD 10 - Paquetes):
 *   sesionesRestantes = totalSesiones - sesionesUtilizadas
 * Nunca devuelve negativo.
 */
export function remainingSessions(pkg: Pick<SessionPackage, "totalSessions" | "usedSessions">): number {
  return Math.max(0, pkg.totalSessions - pkg.usedSessions);
}

export type PackageAlertLevel = "normal" | "warning" | "critical";

/**
 * Nivel de alerta visual según las sesiones restantes (SSD 10):
 *   - más de 1  -> normal
 *   - igual a 1 -> advertencia
 *   - igual a 0 -> renovación requerida (crítico)
 */
export function packageAlertLevel(
  pkg: Pick<SessionPackage, "totalSessions" | "usedSessions">,
): PackageAlertLevel {
  const remaining = remainingSessions(pkg);
  if (remaining === 0) return "critical";
  if (remaining === 1) return "warning";
  return "normal";
}

/** Estado derivado del paquete a partir del consumo de sesiones. */
export function derivePackageStatus(
  pkg: Pick<SessionPackage, "totalSessions" | "usedSessions" | "status">,
): SessionPackage["status"] {
  if (pkg.status === "cancelled") return "cancelled";
  return remainingSessions(pkg) === 0 ? "completed" : "active";
}
