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
import { createPackage } from "@/features/packages/package.service";
import { usePatients, useServices } from "@/hooks/use-demo-data";
import { useScopedBranch, filterByBranch } from "@/hooks/use-scoped-branch";
import { formatCurrency } from "@/lib/currency";

interface PackageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Paciente preseleccionado (al crear desde su ficha). */
  defaultPatientId?: string;
}

export function PackageFormDialog({
  open,
  onOpenChange,
  defaultPatientId,
}: PackageFormDialogProps) {
  const patients = usePatients();
  const services = useServices();
  const scope = useScopedBranch();

  const [patientId, setPatientId] = useState(defaultPatientId ?? "");
  const [serviceId, setServiceId] = useState("");
  const [totalSessions, setTotalSessions] = useState(8);
  const [submitting, setSubmitting] = useState(false);

  const scopedPatients = filterByBranch(patients, scope).filter((p) => p.status === "active");
  const service = services?.find((s) => s.id === serviceId);
  const price = service ? service.defaultSessionPrice * totalSessions : 0;

  useEffect(() => {
    if (open) {
      setPatientId(defaultPatientId ?? "");
      setServiceId("");
      setTotalSessions(8);
    }
  }, [open, defaultPatientId]);

  async function handleSubmit() {
    if (!patientId || !serviceId) {
      toast.error("Selecciona paciente y servicio");
      return;
    }
    const patient = patients?.find((p) => p.id === patientId);
    if (!patient) return;
    setSubmitting(true);
    try {
      await createPackage({
        patientId,
        serviceId,
        branchId: patient.branchId,
        totalSessions,
        price,
      });
      toast.success("Paquete registrado");
      onOpenChange(false);
    } catch {
      toast.error("No se pudo registrar el paquete");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo paquete de sesiones</DialogTitle>
          <DialogDescription>Registra una venta ficticia de sesiones.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block">Paciente</Label>
            <Select value={patientId} onValueChange={setPatientId} disabled={!!defaultPatientId}>
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

          <div>
            <Label className="mb-1.5 block">Servicio</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona servicio" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} · {formatCurrency(s.defaultSessionPrice)}/sesión
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">Cantidad de sesiones</Label>
            <Input
              type="number"
              min={1}
              max={40}
              value={totalSessions}
              onChange={(e) => setTotalSessions(Math.max(1, Number(e.target.value)))}
            />
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-base font-semibold">{formatCurrency(price)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            Registrar paquete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
