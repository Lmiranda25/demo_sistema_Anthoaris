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
import { createSpecialist, updateSpecialist } from "@/features/specialists/specialist.service";
import { useBranches, useSpecialties } from "@/hooks/use-demo-data";
import type { Specialist } from "@/domain/entities";
import { cn } from "@/lib/cn";

interface SpecialistFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialist?: Specialist;
}

export function SpecialistFormDialog({
  open,
  onOpenChange,
  specialist,
}: SpecialistFormDialogProps) {
  const branches = useBranches();
  const specialties = useSpecialties();
  const isEdit = !!specialist;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialtyId, setSpecialtyId] = useState("");
  const [branchIds, setBranchIds] = useState<string[]>([]);
  const [schedule, setSchedule] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (specialist) {
      setFirstName(specialist.firstName);
      setLastName(specialist.lastName);
      setSpecialtyId(specialist.specialtyId);
      setBranchIds(specialist.branchIds);
      setSchedule(specialist.schedule);
      setEmail(specialist.email);
    } else {
      setFirstName("");
      setLastName("");
      setSpecialtyId("");
      setBranchIds([]);
      setSchedule("");
      setEmail("");
    }
  }, [open, specialist]);

  function toggleBranch(id: string) {
    setBranchIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  }

  async function handleSubmit() {
    if (!firstName || !lastName || !specialtyId || branchIds.length === 0) {
      toast.error("Completa nombre, especialidad y al menos una sede");
      return;
    }
    setSubmitting(true);
    const input = { firstName, lastName, specialtyId, branchIds, schedule, email };
    try {
      if (isEdit && specialist) {
        await updateSpecialist(specialist.id, input);
        toast.success("Especialista actualizado");
      } else {
        await createSpecialist(input);
        toast.success("Especialista creado");
      }
      onOpenChange(false);
    } catch {
      toast.error("No se pudo guardar el especialista");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar especialista" : "Nuevo especialista"}</DialogTitle>
          <DialogDescription>Datos profesionales y sedes asignadas.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block">Nombres</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block">Apellidos</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block">Especialidad</Label>
            <Select value={specialtyId} onValueChange={setSpecialtyId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona especialidad" />
              </SelectTrigger>
              <SelectContent>
                {specialties?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block">Sedes asignadas</Label>
            <div className="flex flex-wrap gap-2">
              {branches?.map((b) => {
                const active = branchIds.includes(b.id);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => toggleBranch(b.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {b.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block">Horario</Label>
            <Input
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Ej. Lun a Vie, 09:00 - 14:00"
            />
          </div>

          <div>
            <Label className="mb-1.5 block">Correo</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@anthoaris.demo" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {isEdit ? "Guardar cambios" : "Crear especialista"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
