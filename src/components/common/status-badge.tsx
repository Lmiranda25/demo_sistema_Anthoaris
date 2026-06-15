import { Badge } from "@/components/ui/badge";
import {
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_TONES,
  PROGRESS_LEVEL_LABELS,
  PROGRESS_LEVEL_TONES,
  type AppointmentStatus,
  type ProgressLevel,
} from "@/domain/enums";

/** Badge del estado de una cita con su color correspondiente. */
export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return <Badge tone={APPOINTMENT_STATUS_TONES[status]}>{APPOINTMENT_STATUS_LABELS[status]}</Badge>;
}

/** Badge del nivel de progreso clínico. */
export function ProgressLevelBadge({ level }: { level: ProgressLevel }) {
  return <Badge tone={PROGRESS_LEVEL_TONES[level]}>{PROGRESS_LEVEL_LABELS[level]}</Badge>;
}
