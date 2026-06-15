import { describe, it, expect } from "vitest";
import { absenteeismRate, countByStatus } from "@/domain/policies/metrics";

describe("absenteeismRate (SSD 19 - cálculo de ausentismo)", () => {
  it("calcula la proporción de inasistencias sobre citas concluidas", () => {
    const appts = [
      { status: "attended" as const },
      { status: "attended" as const },
      { status: "no_show" as const },
      { status: "cancelled" as const },
    ];
    // 1 no_show de 4 concluidas = 0.25
    expect(absenteeismRate(appts)).toBeCloseTo(0.25);
  });

  it("excluye citas aún programadas/confirmadas del denominador", () => {
    const appts = [
      { status: "attended" as const },
      { status: "no_show" as const },
      { status: "scheduled" as const },
      { status: "confirmed" as const },
    ];
    // Solo 2 concluidas (attended + no_show), 1 no_show => 0.5
    expect(absenteeismRate(appts)).toBeCloseTo(0.5);
  });

  it("devuelve 0 cuando no hay citas concluidas", () => {
    expect(absenteeismRate([{ status: "scheduled" }])).toBe(0);
    expect(absenteeismRate([])).toBe(0);
  });
});

describe("countByStatus", () => {
  it("cuenta cada estado", () => {
    const result = countByStatus([
      { status: "attended" },
      { status: "attended" },
      { status: "no_show" },
    ]);
    expect(result.attended).toBe(2);
    expect(result.no_show).toBe(1);
    expect(result.scheduled).toBe(0);
  });
});
