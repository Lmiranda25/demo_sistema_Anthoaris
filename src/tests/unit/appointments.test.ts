import { describe, it, expect } from "vitest";
import {
  rangesOverlap,
  hasScheduleConflict,
  shouldConsumeSession,
} from "@/domain/policies/appointments";
import type { Appointment } from "@/domain/entities";

function appt(partial: Partial<Appointment>): Appointment {
  return {
    id: "ap_x",
    branchId: "b1",
    patientId: "p1",
    specialistId: "s1",
    packageId: "pk1",
    startsAt: "2026-06-15T09:00:00.000Z",
    endsAt: "2026-06-15T09:45:00.000Z",
    status: "scheduled",
    sessionConsumed: false,
    ...partial,
  };
}

describe("rangesOverlap", () => {
  it("detecta solapamiento real", () => {
    expect(
      rangesOverlap(
        "2026-06-15T09:00:00",
        "2026-06-15T10:00:00",
        "2026-06-15T09:30:00",
        "2026-06-15T10:30:00",
      ),
    ).toBe(true);
  });

  it("no marca solapamiento cuando solo se tocan en el límite", () => {
    expect(
      rangesOverlap(
        "2026-06-15T09:00:00",
        "2026-06-15T10:00:00",
        "2026-06-15T10:00:00",
        "2026-06-15T11:00:00",
      ),
    ).toBe(false);
  });
});

describe("hasScheduleConflict (SSD 19 - horarios superpuestos)", () => {
  const existing = [
    appt({ id: "ap_1", specialistId: "s1", startsAt: "2026-06-15T09:00:00", endsAt: "2026-06-15T09:45:00" }),
  ];

  it("detecta conflicto con el mismo especialista", () => {
    const candidate = { specialistId: "s1", startsAt: "2026-06-15T09:30:00", endsAt: "2026-06-15T10:15:00" };
    expect(hasScheduleConflict(candidate, existing)).toBe(true);
  });

  it("no hay conflicto con otro especialista", () => {
    const candidate = { specialistId: "s2", startsAt: "2026-06-15T09:30:00", endsAt: "2026-06-15T10:15:00" };
    expect(hasScheduleConflict(candidate, existing)).toBe(false);
  });

  it("ignora la propia cita al reprogramar", () => {
    const candidate = { specialistId: "s1", startsAt: "2026-06-15T09:00:00", endsAt: "2026-06-15T09:45:00" };
    expect(hasScheduleConflict(candidate, existing, "ap_1")).toBe(false);
  });

  it("ignora citas canceladas", () => {
    const cancelled = [appt({ id: "ap_2", status: "cancelled" })];
    const candidate = { specialistId: "s1", startsAt: "2026-06-15T09:00:00", endsAt: "2026-06-15T09:45:00" };
    expect(hasScheduleConflict(candidate, cancelled)).toBe(false);
  });
});

describe("shouldConsumeSession (SSD 19 - prevención de doble descuento)", () => {
  it("consume al pasar a atendida con paquete y sin consumo previo", () => {
    expect(shouldConsumeSession(appt({ sessionConsumed: false }), "attended")).toBe(true);
  });

  it("NO consume si ya consumió antes", () => {
    expect(shouldConsumeSession(appt({ sessionConsumed: true }), "attended")).toBe(false);
  });

  it("NO consume si no hay paquete", () => {
    expect(shouldConsumeSession(appt({ packageId: undefined }), "attended")).toBe(false);
  });

  it("NO consume para estados distintos de atendida", () => {
    expect(shouldConsumeSession(appt({}), "cancelled")).toBe(false);
  });
});
