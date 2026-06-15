import type { Appointment } from "@/domain/entities";

/**
 * Porcentaje de ausentismo (SSD 4.2, 19):
 * proporción de citas con inasistencia ("no_show") respecto al total de citas
 * que ya tuvieron desenlace (atendidas + canceladas + no asistió).
 *
 * Se excluyen las citas aún programadas/confirmadas porque todavía no se sabe
 * si habrá ausentismo. Devuelve 0 cuando no hay citas con desenlace.
 */
export function absenteeismRate(appointments: Pick<Appointment, "status">[]): number {
  const concluded = appointments.filter(
    (a) => a.status === "attended" || a.status === "cancelled" || a.status === "no_show",
  );
  if (concluded.length === 0) return 0;
  const noShows = concluded.filter((a) => a.status === "no_show").length;
  return noShows / concluded.length;
}

/** Cuenta citas por estado, útil para KPIs del dashboard. */
export function countByStatus(
  appointments: Pick<Appointment, "status">[],
): Record<Appointment["status"], number> {
  const base: Record<Appointment["status"], number> = {
    scheduled: 0,
    confirmed: 0,
    attended: 0,
    cancelled: 0,
    no_show: 0,
  };
  for (const a of appointments) base[a.status] += 1;
  return base;
}
