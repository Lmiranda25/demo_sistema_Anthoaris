import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { usePatients } from "@/hooks/use-demo-data";
import { useCurrentUser } from "@/features/auth/auth.store";
import { calculateAge } from "@/lib/dates";

/**
 * Pacientes asignados al especialista (SSD 3.1: "Acceso únicamente a los
 * pacientes asignados"). El filtro por especialista es la regla de aislamiento.
 */
export function SpecialistPatientsPage() {
  const user = useCurrentUser();
  const patients = usePatients();
  const [search, setSearch] = useState("");

  const mine = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (patients ?? [])
      .filter((p) => p.assignedSpecialistId === user?.specialistId)
      .filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [patients, user?.specialistId, search]);

  return (
    <div className="space-y-6">
      <PageHeader title="Mis pacientes" description="Pacientes asignados a tu cargo" />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente…"
          className="pl-9"
        />
      </div>

      {!patients ? (
        <LoadingState />
      ) : mine.length === 0 ? (
        <EmptyState icon={Users} title="No tienes pacientes asignados" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => (
            <Card key={p.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {calculateAge(p.birthDate)} años
                    </div>
                  </div>
                  <Badge tone={p.status === "active" ? "success" : "neutral"}>
                    {p.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{p.initialReason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
