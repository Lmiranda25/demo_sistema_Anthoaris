import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Archive, ArchiveRestore } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "@/components/ui/sonner";
import { PatientFormDialog } from "@/features/patients/components/patient-form-dialog";
import { PackageProgress } from "@/features/packages/components/package-progress";
import {
  AppointmentStatusBadge,
  ProgressLevelBadge,
} from "@/components/common/status-badge";
import {
  useAppointments,
  useBranches,
  useClinicalProgressList,
  useGuardians,
  usePackages,
  usePatient,
  useServices,
  useSpecialists,
} from "@/hooks/use-demo-data";
import { setPatientStatus } from "@/features/patients/patient.service";
import { calculateAge, formatDate, formatDateTime } from "@/lib/dates";
import { useCurrentUser } from "@/features/auth/auth.store";
import { can } from "@/lib/permissions";

export function PatientDetailPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = usePatient(patientId);
  const guardians = useGuardians();
  const specialists = useSpecialists();
  const branches = useBranches();
  const appointments = useAppointments();
  const packages = usePackages();
  const services = useServices();
  const progressList = useClinicalProgressList();
  const user = useCurrentUser();
  const [editOpen, setEditOpen] = useState(false);

  const canSeeClinical = can(user?.role, "view:clinical:full");

  const guardian = guardians?.find((g) => g.id === patient?.guardianId);
  const specialist = specialists?.find((s) => s.id === patient?.assignedSpecialistId);
  const branch = branches?.find((b) => b.id === patient?.branchId);

  const patientAppointments = useMemo(
    () =>
      (appointments ?? [])
        .filter((a) => a.patientId === patientId)
        .sort((a, b) => b.startsAt.localeCompare(a.startsAt)),
    [appointments, patientId],
  );
  const patientPackages = useMemo(
    () => (packages ?? []).filter((p) => p.patientId === patientId),
    [packages, patientId],
  );
  const patientProgress = useMemo(
    () =>
      (progressList ?? [])
        .filter((p) => p.patientId === patientId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [progressList, patientId],
  );

  if (patient === undefined) return <LoadingState rows={4} />;
  if (patient === null) {
    return (
      <EmptyState
        title="Paciente no encontrado"
        action={<Button onClick={() => navigate("/app/patients")}>Volver</Button>}
      />
    );
  }

  async function toggleArchive() {
    if (!patient) return;
    const next = patient.status === "active" ? "inactive" : "active";
    await setPatientStatus(patient.id, next);
    toast.success(next === "inactive" ? "Paciente archivado" : "Paciente reactivado");
  }

  const serviceName = (id: string) => services?.find((s) => s.id === id)?.name ?? "Servicio";

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/app/patients")} className="-ml-2">
        <ArrowLeft className="h-4 w-4" />
        Pacientes
      </Button>

      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description={patient.initialReason}
        actions={
          <>
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" onClick={toggleArchive}>
              {patient.status === "active" ? (
                <>
                  <Archive className="h-4 w-4" />
                  Archivar
                </>
              ) : (
                <>
                  <ArchiveRestore className="h-4 w-4" />
                  Reactivar
                </>
              )}
            </Button>
          </>
        }
      />

      <Tabs defaultValue="summary">
        <TabsList className="w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
          <TabsTrigger value="packages">Paquetes</TabsTrigger>
          <TabsTrigger value="progress">Evolución</TabsTrigger>
        </TabsList>

        {/* Resumen */}
        <TabsContent value="summary">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Datos del paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Info label="Edad" value={`${calculateAge(patient.birthDate)} años`} />
                <Info label="Fecha de nacimiento" value={formatDate(patient.birthDate)} />
                <Info label="Sede principal" value={branch?.name ?? "—"} />
                <Info
                  label="Especialista"
                  value={specialist ? `${specialist.firstName} ${specialist.lastName}` : "Sin asignar"}
                />
                <Info
                  label="Estado"
                  value={
                    <Badge tone={patient.status === "active" ? "success" : "neutral"}>
                      {patient.status === "active" ? "Activo" : "Archivado"}
                    </Badge>
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Apoderado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Info label="Nombre" value={guardian ? `${guardian.firstName} ${guardian.lastName}` : "—"} />
                <Info label="Parentesco" value={guardian?.relationship ?? "—"} />
                <Info label="Teléfono" value={guardian?.phone ?? "—"} />
                <Info label="Correo" value={guardian?.email ?? "—"} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Citas */}
        <TabsContent value="appointments">
          <Card>
            <CardContent className="pt-6">
              {patientAppointments.length === 0 ? (
                <EmptyState title="Sin citas registradas" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Especialista</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientAppointments.map((a) => {
                      const s = specialists?.find((x) => x.id === a.specialistId);
                      return (
                        <TableRow key={a.id}>
                          <TableCell>{formatDateTime(a.startsAt)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {s ? `${s.firstName} ${s.lastName}` : "—"}
                          </TableCell>
                          <TableCell>
                            <AppointmentStatusBadge status={a.status} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paquetes */}
        <TabsContent value="packages">
          <div className="grid gap-4 sm:grid-cols-2">
            {patientPackages.length === 0 ? (
              <EmptyState title="Sin paquetes" className="sm:col-span-2" />
            ) : (
              patientPackages.map((pkg) => (
                <Card key={pkg.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{serviceName(pkg.serviceId)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PackageProgress pkg={pkg} />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Evolución */}
        <TabsContent value="progress">
          <Card>
            <CardContent className="pt-6">
              {patientProgress.length === 0 ? (
                <EmptyState title="Sin evoluciones registradas" />
              ) : (
                <div className="space-y-4">
                  {patientProgress.map((p) => {
                    const s = specialists?.find((x) => x.id === p.specialistId);
                    return (
                      <div key={p.id} className="rounded-lg border border-border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-medium">{formatDateTime(p.date)}</div>
                          <ProgressLevelBadge level={p.level} />
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {s ? `${s.firstName} ${s.lastName}` : ""}
                        </div>
                        {/* Recepcionista solo ve que existe, no el contenido clínico (SSD 4.6) */}
                        {canSeeClinical ? (
                          <div className="mt-3 space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Objetivo: </span>
                              {p.objective}
                            </div>
                            <div>
                              <span className="font-medium">Observaciones: </span>
                              {p.observations}
                            </div>
                          </div>
                        ) : (
                          <div className="mt-3 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                            Evolución registrada. El contenido clínico está restringido para
                            tu rol.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PatientFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        patient={patient}
        guardian={guardian}
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
