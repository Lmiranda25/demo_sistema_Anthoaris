import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, UserX } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { toast } from "@/components/ui/sonner";
import { AppointmentStatusBadge, ProgressLevelBadge } from "@/components/common/status-badge";
import { PackageProgress } from "@/features/packages/components/package-progress";
import {
  useAppointments,
  useClinicalProgressList,
  usePackages,
  usePatients,
} from "@/hooks/use-demo-data";
import { changeAppointmentStatus } from "@/features/appointments/appointment.service";
import { createClinicalProgress } from "@/features/clinical-progress/clinical-progress.service";
import {
  clinicalProgressSchema,
  type ClinicalProgressValues,
} from "@/features/clinical-progress/clinical-progress.schema";
import { canHaveClinicalProgress } from "@/domain/policies/appointments";
import { useCurrentUser } from "@/features/auth/auth.store";
import { calculateAge, formatDateTime } from "@/lib/dates";
import { PROGRESS_LEVEL_LABELS, type ProgressLevel } from "@/domain/enums";

/**
 * Pantalla de sesión del especialista (SSD 8 - /specialist/session/:id).
 * Permite marcar asistencia (descontando una sesión una sola vez) y registrar
 * la evolución clínica vinculada a la cita (SSD 4.6, Escena 3).
 */
export function SessionPage() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const appointments = useAppointments();
  const patients = usePatients();
  const packages = usePackages();
  const progressList = useClinicalProgressList();
  const [marking, setMarking] = useState(false);

  const appt = appointments?.find((a) => a.id === appointmentId);
  const patient = patients?.find((p) => p.id === appt?.patientId);
  const pkg = packages?.find((p) => p.id === appt?.packageId);
  const existingProgress = useMemo(
    () => progressList?.find((p) => p.appointmentId === appointmentId),
    [progressList, appointmentId],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClinicalProgressValues>({
    resolver: zodResolver(clinicalProgressSchema),
    defaultValues: { objective: "", observations: "", level: "in_progress" },
  });

  const level = watch("level");

  if (appointments === undefined || patients === undefined) return <LoadingState rows={4} />;
  if (!appt || !patient) {
    return (
      <EmptyState
        title="Cita no encontrada"
        action={<Button onClick={() => navigate("/specialist/today")}>Volver</Button>}
      />
    );
  }

  // Aislamiento: el especialista solo puede operar sus propias citas.
  if (appt.specialistId !== user?.specialistId) {
    return (
      <EmptyState
        title="Sin acceso a esta cita"
        description="Solo puedes ver tus propias sesiones."
        action={<Button onClick={() => navigate("/specialist/today")}>Volver</Button>}
      />
    );
  }

  async function mark(status: "attended" | "no_show") {
    if (!appt) return;
    setMarking(true);
    try {
      await changeAppointmentStatus(appt.id, status);
      if (status === "attended" && appt.packageId && !appt.sessionConsumed) {
        toast.success("Cita atendida. Se descontó una sesión del paquete.");
      } else if (status === "no_show") {
        toast.success("Marcada como inasistencia.");
      } else {
        toast.success("Cita atendida.");
      }
    } catch {
      toast.error("No se pudo actualizar la cita");
    } finally {
      setMarking(false);
    }
  }

  async function onSubmitProgress(values: ClinicalProgressValues) {
    if (!appt) return;
    try {
      await createClinicalProgress({ appointmentId: appt.id, ...values });
      toast.success("Evolución registrada");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo registrar la evolución");
    }
  }

  const canRegisterProgress = canHaveClinicalProgress(appt) && !existingProgress;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/specialist/today")} className="-ml-2">
        <ArrowLeft className="h-4 w-4" />
        Agenda de hoy
      </Button>

      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        description={`${calculateAge(patient.birthDate)} años · ${patient.initialReason}`}
        actions={<AppointmentStatusBadge status={appt.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Asistencia */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Asistencia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">{formatDateTime(appt.startsAt)}</div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => mark("attended")}
                disabled={marking || appt.status === "attended"}
              >
                <CheckCircle2 className="h-4 w-4" />
                Marcar atendida
              </Button>
              <Button
                variant="outline"
                onClick={() => mark("no_show")}
                disabled={marking || appt.status === "no_show"}
              >
                <UserX className="h-4 w-4" />
                No asistió
              </Button>
            </div>
            {appt.sessionConsumed && (
              <p className="text-xs text-success">Esta cita ya descontó una sesión del paquete.</p>
            )}
          </CardContent>
        </Card>

        {/* Paquete */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Paquete activo</CardTitle>
          </CardHeader>
          <CardContent>
            {pkg ? (
              <PackageProgress pkg={pkg} />
            ) : (
              <p className="text-sm text-muted-foreground">Esta cita no tiene paquete vinculado.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Evolución clínica */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución clínica</CardTitle>
        </CardHeader>
        <CardContent>
          {existingProgress ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ProgressLevelBadge level={existingProgress.level} />
                <span className="text-sm text-muted-foreground">
                  {formatDateTime(existingProgress.createdAt)}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Objetivo: </span>
                {existingProgress.objective}
              </div>
              <div className="text-sm">
                <span className="font-medium">Observaciones: </span>
                {existingProgress.observations}
              </div>
            </div>
          ) : !canRegisterProgress ? (
            <div className="rounded-md bg-muted/50 px-3 py-3 text-sm text-muted-foreground">
              Marca la cita como <strong>atendida</strong> para poder registrar la evolución.
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitProgress)} className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Objetivo trabajado</Label>
                <Textarea {...register("objective")} placeholder="Ej. Aumentar vocabulario expresivo" />
                {errors.objective && (
                  <p className="mt-1 text-xs text-destructive">{errors.objective.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-1.5 block">Observaciones</Label>
                <Textarea {...register("observations")} placeholder="Notas de la sesión…" />
                {errors.observations && (
                  <p className="mt-1 text-xs text-destructive">{errors.observations.message}</p>
                )}
              </div>
              <div>
                <Label className="mb-1.5 block">Progreso</Label>
                <Select
                  value={level}
                  onValueChange={(v) => setValue("level", v as ProgressLevel)}
                >
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(PROGRESS_LEVEL_LABELS) as ProgressLevel[]).map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {PROGRESS_LEVEL_LABELS[lvl]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isSubmitting}>
                Registrar evolución
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
