import { z } from "zod";

/** Validación del formulario de paciente + apoderado (SSD 6.3, 10). */
export const patientFormSchema = z.object({
  firstName: z.string().min(2, "Ingresa el nombre"),
  lastName: z.string().min(2, "Ingresa el apellido"),
  birthDate: z
    .string()
    .min(1, "Ingresa la fecha de nacimiento")
    .refine((v) => new Date(v) <= new Date(), "La fecha no puede ser futura"),
  branchId: z.string().min(1, "Selecciona una sede"),
  initialReason: z.string().min(3, "Describe el motivo de consulta"),
  assignedSpecialistId: z.string().optional(),

  guardianFirstName: z.string().min(2, "Ingresa el nombre del apoderado"),
  guardianLastName: z.string().min(2, "Ingresa el apellido del apoderado"),
  guardianRelationship: z.string().min(2, "Indica el parentesco"),
  guardianPhone: z.string().min(6, "Ingresa un teléfono válido"),
  guardianEmail: z.string().email("Correo inválido"),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
