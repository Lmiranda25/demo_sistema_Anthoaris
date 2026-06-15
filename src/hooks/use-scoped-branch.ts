import { useCurrentUser } from "@/features/auth/auth.store";
import { useAppStore } from "@/stores/app.store";
import { can } from "@/lib/permissions";

/**
 * Resuelve el filtro de sede efectivo para el usuario actual:
 * - El dueño usa el `branchScope` global ("all" o una sede concreta).
 * - Recepcionista/especialista quedan SIEMPRE limitados a su sede asignada,
 *   sin importar el estado global (SSD 3.1).
 *
 * Devuelve "all" o un branchId concreto.
 */
export function useScopedBranch(): string {
  const user = useCurrentUser();
  const branchScope = useAppStore((s) => s.branchScope);

  if (can(user?.role, "view:all-branches")) {
    return branchScope;
  }
  return user?.branchId ?? "all";
}

/** Helper para filtrar una lista de entidades con `branchId` por el scope. */
export function filterByBranch<T extends { branchId: string }>(
  items: T[] | undefined,
  scope: string,
): T[] {
  if (!items) return [];
  if (scope === "all") return items;
  return items.filter((i) => i.branchId === scope);
}
