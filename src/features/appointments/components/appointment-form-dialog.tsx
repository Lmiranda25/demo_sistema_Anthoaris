import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { createAppointment } from "@/features/appointments/appointment.service";
import { ScheduleConflictError } from "@/domain/errors";
import {
  usePackages,
  usePatients,
  useSpecialists,
} from "@/hooks/use-demo-data";
import { useScopedBranch, filterByBranch } from "@/hooks/use-scoped-branch";

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fecha por defecto (vista de agenda en un día concreto). */
  defaultDate?: string; // yyyy-mm-dd
}

const SLOT_MINUTES = 45;

export function AppointmentFormDialog({
  open,
  onOpenChange,
  defaultDate,
}: AppointmentFormDialogProps) {
  const patients = usePatients();
  const specialists = useSpecialists();
  const packages = usePackages();
  const scope = useScopedBranch();

  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [submitting, setSubmitting] = useState(false);

  const scopedPatients = filterByBranch(patients, scope).filter((p) => p.status === "active");
  const patient = patients?.find((p) => p.id === patientId);
  const specialist = specialists?.find((s) => s.id === patient?.assignedSpecialistId);
  // Paquete activo del paciente (si lo hay) para vincular y descontar sesión.
  const activePackage = packages?.find(
    (pk) => pk.patientId === patientId && pk.status === "active",
  );

  useEffect(() => {
    if (open) {
      setPatientId("");
      setDate(defaultDate ?? new Date().toISOString().slice(0, 10));
      setTime("09:00");
    }
  }, [open, defaultDate]);

  async function handleSubmit() {
    if (!patient || !patient.assignedSpecialistId) {
      toast.error("Selecciona un paciente con especialista asignado");
      return;
    }
    if (!date || !time) {
      toast.error("Indica fecha y hora");
      return;
    }
    const startsAt = new Date(`${date}T${time}:00`);
    const endsAt = new Date(startsAt.getTime() + SLOT_MINUTES * 60 * 1000);

    setSubmitting(true);
    try {
      await createAppointment({
        branchId: patient.branchId,
        patientId: patient.id,
        specialistId: patient.assignedSpecialistId,
        packageId: activePackage?.id,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
      toast.success("Cita creada");
      onOpenChange(false);
    } catch (err) {
      if (err instanceof ScheduleConflictError) {
        toast.error("Conflicto de horario: el especialista ya tiene una cita superpuesta.");
      } else {
        toast.error("No se pudo crear la cita");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
          <DialogDescription>
            La cita se asigna al especialista del paciente. Se valida que no haya
            horarios superpuestos.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Paciente</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona paciente" />
              </SelectTrigger>
              <SelectContent>
                {scopedPatients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {patient && (
            <div className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              Especialista:{" "}
              <span className="font-medium text-foreground">
                {specialist ? `${specialist.firstName} ${specialist.lastName}` : "Sin asignar"}
              </span>
              {!specialist && " — asigna un especialista al paciente primero."}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Fecha</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Hora</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            Crear cita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
