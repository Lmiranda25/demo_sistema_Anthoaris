import { describe, it, expect } from "vitest";
import {
  remainingSessions,
  packageAlertLevel,
  derivePackageStatus,
} from "@/domain/policies/packages";

describe("remainingSessions (SSD 19 - cálculo de sesiones restantes)", () => {
  it("resta usadas de totales", () => {
    expect(remainingSessions({ totalSessions: 10, usedSessions: 3 })).toBe(7);
  });

  it("nunca devuelve negativo", () => {
    expect(remainingSessions({ totalSessions: 5, usedSessions: 8 })).toBe(0);
  });
});

describe("packageAlertLevel (SSD 10 - estados visuales)", () => {
  it("normal cuando quedan más de 1", () => {
    expect(packageAlertLevel({ totalSessions: 10, usedSessions: 2 })).toBe("normal");
  });

  it("advertencia cuando queda exactamente 1", () => {
    expect(packageAlertLevel({ totalSessions: 10, usedSessions: 9 })).toBe("warning");
  });

  it("crítico cuando quedan 0", () => {
    expect(packageAlertLevel({ totalSessions: 10, usedSessions: 10 })).toBe("critical");
  });
});

describe("derivePackageStatus", () => {
  it("queda completado al agotar sesiones", () => {
    expect(
      derivePackageStatus({ totalSessions: 4, usedSessions: 4, status: "active" }),
    ).toBe("completed");
  });

  it("se mantiene activo si quedan sesiones", () => {
    expect(
      derivePackageStatus({ totalSessions: 4, usedSessions: 1, status: "active" }),
    ).toBe("active");
  });

  it("respeta el estado cancelado", () => {
    expect(
      derivePackageStatus({ totalSessions: 4, usedSessions: 1, status: "cancelled" }),
    ).toBe("cancelled");
  });
});
