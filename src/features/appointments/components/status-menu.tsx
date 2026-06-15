import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { changeAppointmentStatus } from "@/features/appointments/appointment.service";
import {
  APPOINTMENT_STATUS_LABELS,
  type AppointmentStatus,
} from "@/domain/enums";
import type { Appointment } from "@/domain/entities";

const TRANSITIONS: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "attended",
  "cancelled",
  "no_show",
];

/**
 * Menú para cambiar el estado de una cita. Al pasar a "atendida" descuenta una
 * sesión (una sola vez) vía el servicio (SSD 4.5, 10).
 */
export function AppointmentStatusMenu({ appointment }: { appointment: Appointment }) {
  async function setStatus(status: AppointmentStatus) {
    if (status === appointment.status) return;
    try {
      await changeAppointmentStatus(appointment.id, status);
      if (status === "attended" && appointment.packageId && !appointment.sessionConsumed) {
        toast.success("Cita atendida. Se descontó una sesión del paquete.");
      } else {
        toast.success(`Estado actualizado: ${APPOINTMENT_STATUS_LABELS[status]}`);
      }
    } catch {
      toast.error("No se pudo cambiar el estado");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Estado
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {TRANSITIONS.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => setStatus(status)}
            disabled={status === appointment.status}
          >
            {APPOINTMENT_STATUS_LABELS[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
