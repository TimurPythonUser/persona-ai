const exact = new Intl.NumberFormat("ru-RU");

/** 1 223 000 → «1.2M», 284 000 → «284K», 1 240 → «1 240». */
export function formatCompact(n: number) {
  if (n >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (n >= 10_000) return `${trim(n / 1_000)}K`;
  return exact.format(n);
}

/** Точное число с неразрывными пробелами: 18 401. */
export function formatExact(n: number) {
  return exact.format(n);
}

function trim(value: number) {
  return value >= 100 ? Math.round(value).toString() : value.toFixed(1).replace(/\.0$/, "");
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
