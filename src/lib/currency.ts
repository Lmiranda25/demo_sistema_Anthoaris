/**
 * Formato de moneda para la demo. Usa Soles peruanos (PEN) por el contexto del
 * centro, pero al ser datos ficticios el valor es solo ilustrativo.
 */
const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  maximumFractionDigits: 0,
});

export function formatCurrency(amount: number): string {
  return formatter.format(amount);
}

/** Versión compacta para KPIs grandes (ej. S/ 12.5k). */
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return `S/ ${(amount / 1000).toLocaleString("es-PE", { maximumFractionDigits: 1 })}k`;
  }
  return formatCurrency(amount);
}
