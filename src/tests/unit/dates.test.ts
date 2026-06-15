import { describe, it, expect } from "vitest";
import { calculateAge } from "@/lib/dates";

describe("calculateAge (SSD 19 - cálculo de edad)", () => {
  const reference = new Date("2026-06-15T12:00:00");

  it("calcula la edad exacta cuando el cumpleaños ya pasó", () => {
    expect(calculateAge("2020-01-01", reference)).toBe(6);
  });

  it("resta un año si el cumpleaños aún no llega en el año en curso", () => {
    expect(calculateAge("2020-12-31", reference)).toBe(5);
  });

  it("devuelve 0 para fechas futuras", () => {
    expect(calculateAge("2030-01-01", reference)).toBe(0);
  });

  it("devuelve 0 para fechas inválidas", () => {
    expect(calculateAge("no-es-fecha", reference)).toBe(0);
  });
});
