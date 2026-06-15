import {
  differenceInYears,
  format,
  formatDistanceToNow,
  isSameDay,
  parseISO,
  startOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * Calcula la edad en años a partir de una fecha de nacimiento (SSD 10 - Pacientes).
 * Acepta string ISO o Date. Si la fecha es inválida o futura, devuelve 0.
 */
export function calculateAge(birthDate: string | Date, today: Date = new Date()): number {
  const birth = typeof birthDate === "string" ? parseISO(birthDate) : birthDate;
  if (Number.isNaN(birth.getTime())) return 0;
  const age = differenceInYears(today, birth);
  return age < 0 ? 0 : age;
}

/** Formatea una fecha corta legible: "15 jun 2026". */
export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? parseISO(value) : value;
  return format(d, "d MMM yyyy", { locale: es });
}

/** Formatea fecha y hora: "15 jun 2026, 10:30". */
export function formatDateTime(value: string | Date): string {
  const d = typeof value === "string" ? parseISO(value) : value;
  return format(d, "d MMM yyyy, HH:mm", { locale: es });
}

/** Solo la hora: "10:30". */
export function formatTime(value: string | Date): string {
  const d = typeof value === "string" ? parseISO(value) : value;
  return format(d, "HH:mm", { locale: es });
}

/** Día de la semana legible y largo: "lunes 15 de junio". */
export function formatDayLong(value: string | Date): string {
  const d = typeof value === "string" ? parseISO(value) : value;
  return format(d, "EEEE d 'de' MMMM", { locale: es });
}

/** Distancia relativa: "hace 3 días". */
export function formatRelative(value: string | Date): string {
  const d = typeof value === "string" ? parseISO(value) : value;
  return formatDistanceToNow(d, { locale: es, addSuffix: true });
}

export {
  isSameDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  parseISO,
};
