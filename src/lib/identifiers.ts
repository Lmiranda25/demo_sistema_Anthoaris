/**
 * Generador de identificadores únicos para la demo.
 * Usa crypto.randomUUID cuando está disponible (todos los navegadores objetivo
 * del SSD lo soportan) y cae a un identificador basado en aleatoriedad si no.
 */
export function newId(prefix = ""): string {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return prefix ? `${prefix}_${uuid}` : uuid;
}
