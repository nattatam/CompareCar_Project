import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceCompact(value: number): string {
  if (value >= 1_000_000) {
    const m = value / 1_000_000
    return `฿${m % 1 === 0 ? m : m.toFixed(1)}M`
  }
  if (value >= 1_000) return `฿${Math.round(value / 1000)}K`
  return `฿${value}`
}

export function scrollToTop(): void {
  if (typeof window === "undefined") return;

  const start = window.scrollY;
  if (start <= 0) return;

  const duration = 450;
  const startTime = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, Math.round(start * (1 - easeOutCubic(progress))));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}
