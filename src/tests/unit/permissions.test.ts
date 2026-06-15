import { describe, it, expect } from "vitest";
import { can, canAny, canAll } from "@/lib/permissions";

describe("permisos por rol (SSD 19 - validación de permisos)", () => {
  it("el dueño ve reportes financieros globales", () => {
    expect(can("owner", "view:financials")).toBe(true);
    expect(can("owner", "view:reports")).toBe(true);
    expect(can("owner", "view:all-branches")).toBe(true);
  });

  it("la recepcionista NO ve reportes globales ni clínica completa", () => {
    expect(can("receptionist", "view:reports")).toBe(false);
    expect(can("receptionist", "view:financials")).toBe(false);
    expect(can("receptionist", "view:clinical:full")).toBe(false);
    // pero sí gestiona pacientes y citas
    expect(can("receptionist", "manage:patients")).toBe(true);
    expect(can("receptionist", "manage:appointments")).toBe(true);
  });

  it("el especialista NO ve dinero, pero sí crea clínica", () => {
    expect(can("specialist", "view:financials")).toBe(false);
    expect(can("specialist", "register:payments")).toBe(false);
    expect(can("specialist", "view:reports")).toBe(false);
    expect(can("specialist", "create:clinical")).toBe(true);
    expect(can("specialist", "view:clinical:full")).toBe(true);
  });

  it("un rol indefinido no tiene permisos", () => {
    expect(can(undefined, "view:dashboard")).toBe(false);
  });

  it("canAny y canAll combinan capacidades", () => {
    expect(canAny("receptionist", ["view:reports", "manage:patients"])).toBe(true);
    expect(canAll("receptionist", ["view:reports", "manage:patients"])).toBe(false);
    expect(canAll("owner", ["view:reports", "manage:patients"])).toBe(true);
  });
});
