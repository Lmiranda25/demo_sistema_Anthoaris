import { useMemo, useState } from "react";
import { Plus, Stethoscope, Pencil } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { SpecialistFormDialog } from "@/features/specialists/components/specialist-form-dialog";
import {
  useAppointments,
  useBranches,
  usePatients,
  useSpecialists,
  useSpecialties,
} from "@/hooks/use-demo-data";
import { useScopedBranch } from "@/hooks/use-scoped-branch";
import type { Specialist } from "@/domain/entities";
import { startOfMonth } from "@/lib/dates";

export function SpecialistsPage() {
  const specialists = useSpecialists();
  const specialties = useSpecialties();
  const branches = useBranches();
  const patients = usePatients();
  const appointments = useAppointments();
  const scope = useScopedBranch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Specialist | undefined>();
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");

  const monthStart = startOfMonth(new Date()).getTime();

  const rows = useMemo(() => {
    let list = specialists ?? [];
    if (scope !== "all") list = list.filter((s) => s.branchIds.includes(scope));
    if (specialtyFilter !== "all") list = list.filter((s) => s.specialtyId === specialtyFilter);
    return [...list].sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [specialists, scope, specialtyFilter]);

  const specialtyName = (id: string) => specialties?.find((s) => s.id === id)?.name ?? "—";
  const branchNames = (ids: string[]) =>
    ids.map((id) => branches?.find((b) => b.id === id)?.name ?? "").filter(Boolean).join(", ");

  const activePatients = (id: string) =>
    (patients ?? []).filter((p) => p.assignedSpecialistId === id && p.status === "active").length;

  const monthSessions = (id: string) =>
    (appointments ?? []).filter(
      (a) =>
        a.specialistId === id &&
        a.status === "attended" &&
        new Date(a.startsAt).getTime() >= monthStart,
    ).length;

  function openCreate() {
    setEditing(undefined);
    setDialogOpen(true);
  }
  function openEdit(s: Specialist) {
    setEditing(s);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Especialistas"
        description="Equipo terapéutico y su carga de pacientes"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Nuevo especialista
          </Button>
        }
      />

      <div className="max-w-xs">
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Especialidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las especialidades</SelectItem>
            {specialties?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!specialists ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState icon={Stethoscope} title="Sin especialistas" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {s.firstName} {s.lastName}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{specialtyName(s.specialtyId)}</p>
                  </div>
                  <Badge tone={s.status === "active" ? "success" : "neutral"}>
                    {s.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sedes</span>
                  <span className="text-right font-medium">{branchNames(s.branchIds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horario</span>
                  <span className="text-right font-medium">{s.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pacientes activos</span>
                  <span className="font-medium">{activePatients(s.id)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sesiones del mes</span>
                  <span className="font-medium">{monthSessions(s.id)}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => openEdit(s)}>
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SpecialistFormDialog open={dialogOpen} onOpenChange={setDialogOpen} specialist={editing} />
    </div>
  );
}
