/**
 * Formats a monetary value as Guatemalan currency (Quetzales).
 * Input: "1234.50" or 1234.50
 * Output: "Q 1,234.50"
 */
export function formatGuatemalanCurrency(value: string | number): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return 'Q 0.00';
  }

  return `Q ${numValue.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formats an ISO date string to Spanish locale date format.
 * Input: "2026-08-14T23:59:59.999Z"
 * Output: "14 de agosto de 2026"
 */
export function formatDateSpanish(isoDate: string): string {
  const date = new Date(isoDate);

  return date.toLocaleDateString('es-GT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Formats a period range with Spanish locale.
 * Input: { from: "...", to: "..." }
 * Output: "01 de agosto de 2026 — 31 de agosto de 2026"
 */
export function formatPeriod(from: string, to: string): string {
  const fromFormatted = formatDateSpanish(from);
  const toFormatted = formatDateSpanish(to);
  return `${fromFormatted} — ${toFormatted}`;
}
