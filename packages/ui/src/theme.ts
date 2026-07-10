function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return { r, g, b };
}

/** Perceived brightness (ITU-R BT.601) — cukup akurat untuk pilih warna teks kontras, tanpa dependency. */
function getReadableForeground(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155 ? "#1A1A1A" : "#F5F3EA";
}

/**
 * Terapkan warna brand dinamis dari StoreSetting ke seluruh UI lewat CSS
 * variable — dikonsumsi oleh token Tailwind di `styles.css` (`--color-primary`).
 */
export function applyBrandColor(hex: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--brand-primary", hex);
  document.documentElement.style.setProperty("--brand-primary-fg", getReadableForeground(hex));
}

/** Bootstrap global brand color (statis). Panggil dari app's main.tsx saat startup. */
export function bootstrapTheme() {
  applyBrandColor("#1A3A32");
}
