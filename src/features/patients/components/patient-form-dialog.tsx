import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import {
  patientFormSchema,
  type PatientFormValues,
} from "@/features/patients/patient.schema";
import { createPatient, updatePatient, updateGuardian } from "@/features/patients/patient.service";
import { useBranches, useGuardians, useSpecialists } from "@/hooks/use-demo-data";
import type { Guardian, Patient } from "@/domain/entities";

interface PatientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Si se pasa, el formulario edita; si no, crea. */
  patient?: Patient;
  guardian?: Guardian;
  /** Sede preseleccionada (recepcionista fijado a su sede). */
  defaultBranchId?: string;
  /** Si true, el campo de sede queda bloqueado. */
  lockBranch?: boolean;
}

const emptyValues: PatientFormValues = {
  firstName: "",
  lastName: "",
  birthDate: "",
  branchId: "",
  initialReason: "",
  assignedSpecialistId: undefined,
  guardianFirstName: "",
  guardianLastName: "",
  guardianRelationship: "",
  guardianPhone: "",
  guardianEmail: "",
};

export function PatientFormDialog({
  open,
  onOpenChange,
  patient,
  guardian,
  defaultBranchId,
  lockBranch,
}: PatientFormDialogProps) {
  const branches = useBranches();
  const specialists = useSpecialists();
  const guardians = useGuardians();
  const isEdit = !!patient;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: emptyValues,
  });

  // Rellena los valores al abrir (crear o editar).
  useEffect(() => {
    if (!open) return;
    if (patient) {
      const g = guardian ?? guardians?.find((x) => x.id === patient.guardianId);
      reset({
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthDate: patient.birthDate,
        branchId: patient.branchId,
        initialReason: patient.initialReason,
        assignedSpecialistId: patient.assignedSpecialistId,
        guardianFirstName: g?.firstName ?? "",
        guardianLastName: g?.lastName ?? "",
        guardianRelationship: g?.relationship ?? "",
        guardianPhone: g?.phone ?? "",
        guardianEmail: g?.email ?? "",
      });
    } else {
      reset({ ...emptyValues, branchId: defaultBranchId ?? "" });
    }
  }, [open, patient, guardian, guardians, defaultBranchId, reset]);

  const branchId = watch("branchId");
  const assignedSpecialistId = watch("assignedSpecialistId");

  // Especialistas disponibles para la sede elegida.
  const availableSpecialists =
    specialists?.filter((s) => s.status === "active" && (!branchId || s.branchIds.includes(branchId))) ?? [];

  async function onSubmit(values: PatientFormValues) {
    try {
      if (isEdit && patient) {
        await updatePatient(patient.id, values);
        if (patient.guardianId) {
          await updateGuardian(patient.guardianId, {
            firstName: values.guardianFirstName,
            lastName: values.guardianLastName,
            relationship: values.guardianRelationship,
            phone: values.guardianPhone,
            email: values.guardianEmail,
          });
        }
        toast.success("Paciente actualizado");
      } else {
        await createPatient(values);
        toast.success("Paciente creado");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar el paciente");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar paciente" : "Nuevo paciente"}</DialogTitle>
          <DialogDescription>
            Todo paciente debe registrarse junto a un apoderado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <section className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">Datos del paciente</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombres" error={errors.firstName?.message}>
                <Input {...register("firstName")} placeholder="Ej. Tomás" />
              </Field>
              <Field label="Apellidos" error={errors.lastName?.message}>
                <Input {...register("lastName")} placeholder="Ej. Torres" />
              </Field>
              <Field label="Fecha de nacimiento" error={errors.birthDate?.message}>
                <Input type="date" {...register("birthDate")} />
              </Field>
              <Field label="Sede principal" error={errors.branchId?.message}>
                <Select
                  value={branchId}
                  onValueChange={(v) => setValue("branchId", v, { shouldValidate: true })}
                  disabled={lockBranch}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona sede" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches?.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Motivo de consulta o diagnóstico inicial" error={errors.initialReason?.message}>
              <Textarea {...register("initialReason")} placeholder="Ej. Retraso en el lenguaje expresivo" />
            </Field>
            <Field label="Especialista asignado (opcional)">
              <Select
                value={assignedSpecialistId ?? "none"}
                onValueChange={(v) =>
                  setValue("assignedSpecialistId", v === "none" ? undefined : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin asignar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {availableSpecialists.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.firstName} {s.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </section>

          <section className="space-y-4 border-t border-border pt-4">
            <h4 className="text-sm font-medium text-muted-foreground">Datos del apoderado</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombres" error={errors.guardianFirstName?.message}>
                <Input {...register("guardianFirstName")} placeholder="Ej. María" />
              </Field>
              <Field label="Apellidos" error={errors.guardianLastName?.message}>
                <Input {...register("guardianLastName")} placeholder="Ej. Torres" />
              </Field>
              <Field label="Parentesco" error={errors.guardianRelationship?.message}>
                <Input {...register("guardianRelationship")} placeholder="Ej. Madre" />
              </Field>
              <Field label="Teléfono" error={errors.guardianPhone?.message}>
                <Input {...register("guardianPhone")} placeholder="Ej. 999888777" />
              </Field>
              <Field label="Correo" error={errors.guardianEmail?.message} className="sm:col-span-2">
                <Input {...register("guardianEmail")} placeholder="correo@ejemplo.com" />
              </Field>
            </div>
          </section>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Guardar cambios" : "Crear paciente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
