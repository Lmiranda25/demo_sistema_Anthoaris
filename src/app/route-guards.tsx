import { Navigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/features/auth/auth.store";
import { can, type Capability } from "@/lib/permissions";

/**
 * Exige una sesión activa. Si no existe, redirige al login (SSD 19 -
 * "Redirección cuando no existe sesión").
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

/**
 * Enruta al área correcta según el rol. El especialista vive en /specialist;
 * el resto en /app (SSD 8).
 */
export function RequireRoleArea({
  area,
  children,
}: {
  area: "app" | "specialist";
  children: React.ReactNode;
}) {
  const user = useCurrentUser();
  if (!user) return <Navigate to="/login" replace />;

  const isSpecialist = user.role === "specialist";
  if (area === "specialist" && !isSpecialist) {
    return <Navigate to="/app/dashboard" replace />;
  }
  if (area === "app" && isSpecialist) {
    return <Navigate to="/specialist/today" replace />;
  }
  return <>{children}</>;
}

/**
 * Bloquea el acceso a un módulo si el rol no tiene la capacidad (SSD 19 -
 * "Acceso bloqueado a módulos no permitidos").
 */
export function RequireCapability({
  capability,
  children,
}: {
  capability: Capability;
  children: React.ReactNode;
}) {
  const user = useCurrentUser();
  if (!can(user?.role, capability)) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
}

/** Destino inicial tras iniciar sesión, según rol. */
export function homePathForRole(role: string | undefined): string {
  return role === "specialist" ? "/specialist/today" : "/app/dashboard";
}
