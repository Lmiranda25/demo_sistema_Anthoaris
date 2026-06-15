import { create } from "zustand";
import type { AppointmentStatus } from "@/domain/enums";

/** Periodo simulado para el dashboard (SSD 4.2). */
export type DashboardPeriod = "this_month" | "last_month" | "last_3_months";

interface FiltersState {
  // Dashboard
  period: DashboardPeriod;
  setPeriod: (period: DashboardPeriod) => void;

  // Agenda
  appointmentStatus: AppointmentStatus | "all";
  setAppointmentStatus: (status: AppointmentStatus | "all") => void;
  appointmentSpecialistId: string | "all";
  setAppointmentSpecialistId: (id: string | "all") => void;

  // Búsqueda de pacientes/especialistas
  patientSearch: string;
  setPatientSearch: (q: string) => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  period: "this_month",
  setPeriod: (period) => set({ period }),

  appointmentStatus: "all",
  setAppointmentStatus: (appointmentStatus) => set({ appointmentStatus }),
  appointmentSpecialistId: "all",
  setAppointmentSpecialistId: (appointmentSpecialistId) => set({ appointmentSpecialistId }),

  patientSearch: "",
  setPatientSearch: (patientSearch) => set({ patientSearch }),
}));
