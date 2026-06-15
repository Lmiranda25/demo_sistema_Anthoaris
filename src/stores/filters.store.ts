import { create } from "zustand";
import type { AppointmentStatus } from "@/domain/enums";
import { defaultRange, serializeRange, type DateRange } from "@/features/dashboard/date-ranges";

interface FiltersState {
  // Dashboard / Reportes: rango de fechas (ISO) seleccionado con calendario.
  dateFrom: string;
  dateTo: string;
  setDateRange: (range: DateRange) => void;

  // Agenda
  appointmentStatus: AppointmentStatus | "all";
  setAppointmentStatus: (status: AppointmentStatus | "all") => void;
  appointmentSpecialistId: string | "all";
  setAppointmentSpecialistId: (id: string | "all") => void;

  // Búsqueda de pacientes/especialistas
  patientSearch: string;
  setPatientSearch: (q: string) => void;
}

const initialRange = serializeRange(defaultRange());

export const useFiltersStore = create<FiltersState>((set) => ({
  dateFrom: initialRange.from,
  dateTo: initialRange.to,
  setDateRange: (range) => {
    const iso = serializeRange(range);
    set({ dateFrom: iso.from, dateTo: iso.to });
  },

  appointmentStatus: "all",
  setAppointmentStatus: (appointmentStatus) => set({ appointmentStatus }),
  appointmentSpecialistId: "all",
  setAppointmentSpecialistId: (appointmentSpecialistId) => set({ appointmentSpecialistId }),

  patientSearch: "",
  setPatientSearch: (patientSearch) => set({ patientSearch }),
}));
