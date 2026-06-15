import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { PatientFormDialog } from "@/features/patients/components/patient-form-dialog";
import { usePatients, useSpecialists, useBranches } from "@/hooks/use-demo-data";
import { useScopedBranch, filterByBranch } from "@/hooks/use-scoped-branch";
import { useCurrentUser } from "@/features/auth/auth.store";
import { can } from "@/lib/permissions";
import { calculateAge } from "@/lib/dates";

export function PatientsPage() {
  const navigate = useNavigate();
  const patients = usePatients();
  const specialists = useSpecialists();
  const branches = useBranches();
  const scope = useScopedBranch();
  const user = useCurrentUser();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const lockBranch = !can(user?.role, "view:all-branches");

  const rows = useMemo(() => {
    const scoped = filterByBranch(patients, scope);
    const q = search.trim().toLowerCase();
    return scoped
      .filter((p) => `${p.firstName} ${p.lastName} ${p.initialReason}`.toLowerCase().includes(q))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [patients, scope, search]);

  const specialistName = (id?: string) => {
    const s = specialists?.find((x) => x.id === id);
    return s ? `${s.firstName} ${s.lastName}` : "Sin asignar";
  };
  const branchName = (id: string) => branches?.find((b) => b.id === id)?.name ?? "—";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacientes"
        description="Registro y consulta de pacientes y apoderados"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nuevo paciente
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o motivo…"
          className="pl-9"
        />
      </div>

      {!patients ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? "Sin resultados" : "Aún no hay pacientes"}
          description={
            search ? "Prueba con otro término de búsqueda." : "Crea el primer paciente de la demo."
          }
          action={
            !search ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nuevo paciente
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Escritorio/tablet: tabla */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Sede</TableHead>
                  <TableHead>Especialista</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/app/patients/${p.id}`)}
                  >
                    <TableCell className="font-medium">
                      {p.firstName} {p.lastName}
                      <div className="text-xs font-normal text-muted-foreground">
                        {p.initialReason}
                      </div>
                    </TableCell>
                    <TableCell>{calculateAge(p.birthDate)} años</TableCell>
                    <TableCell className="text-muted-foreground">{branchName(p.branchId)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {specialistName(p.assignedSpecialistId)}
                    </TableCell>
                    <TableCell>
                      <Badge tone={p.status === "active" ? "success" : "neutral"}>
                        {p.status === "active" ? "Activo" : "Archivado"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Móvil: tarjetas (SSD 7.4 - tarjetas en lugar de tablas anchas) */}
          <div className="space-y-3 md:hidden">
            {rows.map((p) => (
              <Card
                key={p.id}
                className="cursor-pointer active:bg-muted/40"
                onClick={() => navigate(`/app/patients/${p.id}`)}
              >
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <div className="font-medium">
                      {p.firstName} {p.lastName}
                    </div>
                    <div className="mt-0.5 truncate text-sm text-muted-foreground">
                      {p.initialReason}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {calculateAge(p.birthDate)} años · {branchName(p.branchId)}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {specialistName(p.assignedSpecialistId)}
                    </div>
                  </div>
                  <Badge tone={p.status === "active" ? "success" : "neutral"}>
                    {p.status === "active" ? "Activo" : "Archivado"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      <PatientFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultBranchId={lockBranch ? user?.branchId : undefined}
        lockBranch={lockBranch}
      />
    </div>
  );
}
