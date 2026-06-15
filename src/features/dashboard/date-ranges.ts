import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";

/** Rango de fechas inclusivo. Las fechas son objetos Date locales. */
export interface DateRange {
  from: Date;
  to: Date;
}

/** Atajo de rango predefinido para el selector de fechas. */
export interface RangeShortcut {
  id: string;
  label: string;
  getRange: (now?: Date) => DateRange;
}

/** Atajos rápidos del selector (equivalentes a los periodos anteriores + Hoy). */
export const RANGE_SHORTCUTS: RangeShortcut[] = [
  {
    id: "today",
    label: "Hoy",
    getRange: (now = new Date()) => ({ from: startOfDay(now), to: endOfDay(now) }),
  },
  {
    id: "this_month",
    label: "Este mes",
    getRange: (now = new Date()) => ({ from: startOfMonth(now), to: endOfMonth(now) }),
  },
  {
    id: "last_month",
    label: "Mes anterior",
    getRange: (now = new Date()) => {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return { from: startOfMonth(prev), to: endOfMonth(prev) };
    },
  },
  {
    id: "last_3_months",
    label: "Últimos 3 meses",
    getRange: (now = new Date()) => ({
      from: startOfMonth(new Date(now.getFullYear(), now.getMonth() - 2, 1)),
      to: endOfMonth(now),
    }),
  },
];

/** Rango por defecto: el mes actual. */
export function defaultRange(now = new Date()): DateRange {
  return { from: startOfMonth(now), to: endOfMonth(now) };
}

/** Serializa un rango a ISO (para guardarlo en el store). */
export function serializeRange(range: DateRange): { from: string; to: string } {
  return { from: range.from.toISOString(), to: range.to.toISOString() };
}

/** Reconstruye un rango desde ISO. */
export function parseRange(stored: { from: string; to: string }): DateRange {
  return { from: new Date(stored.from), to: new Date(stored.to) };
}
