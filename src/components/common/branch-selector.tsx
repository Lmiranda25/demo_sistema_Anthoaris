import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/hooks/use-demo-data";
import { useAppStore } from "@/stores/app.store";
import { useCurrentUser } from "@/features/auth/auth.store";
import { can } from "@/lib/permissions";

/**
 * Selector de sede (SSD 4.2). El dueño puede alternar entre consolidado y cada
 * sede. Otros roles quedan fijados a su sede asignada y el control se muestra
 * deshabilitado mostrando su sede.
 */
export function BranchSelector() {
  const branches = useBranches();
  const user = useCurrentUser();
  const branchScope = useAppStore((s) => s.branchScope);
  const setBranchScope = useAppStore((s) => s.setBranchScope);

  const canSeeAll = can(user?.role, "view:all-branches");

  // Si el usuario no puede ver todas las sedes, mostramos su sede fija.
  if (!canSeeAll) {
    const branch = branches?.find((b) => b.id === user?.branchId);
    return (
      <div className="flex h-10 items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-sm text-muted-foreground">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: branch?.color ?? "#94a3b8" }}
        />
        {branch?.name ?? "Sede"}
      </div>
    );
  }

  return (
    <Select value={branchScope} onValueChange={setBranchScope}>
      <SelectTrigger className="w-[150px] sm:w-[200px]">
        <SelectValue placeholder="Sede" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Consolidado (todas)</SelectItem>
        {branches?.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
