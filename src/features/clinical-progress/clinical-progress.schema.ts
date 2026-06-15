import { z } from "zod";

export const clinicalProgressSchema = z.object({
  objective: z.string().min(3, "Describe el objetivo trabajado"),
  observations: z.string().min(3, "Ingresa observaciones"),
  level: z.enum(["achieved", "in_progress", "needs_reinforcement"]),
});

export type ClinicalProgressValues = z.infer<typeof clinicalProgressSchema>;
