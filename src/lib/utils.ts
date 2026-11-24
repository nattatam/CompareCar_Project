import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { POWERTRAIN_LABELS, Powertrain } from '@/lib/types'

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
  if (typeof window === 'undefined') return

  const start = window.scrollY
  if (start <= 0) return

  const duration = 450
  const startTime = performance.now()
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, Math.round(start * (1 - easeOutCubic(progress))))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

export function badgeLabel(powertrain: Powertrain): string {
  if (powertrain.type === 'ICE') return 'ICE'
  if (powertrain.type === 'EV') return 'EV'
  return POWERTRAIN_LABELS[powertrain.subType ?? 'HEV']
}

export function formatPrice(price: number): string {
  return `฿${price.toLocaleString('en-US')}`
}

export function buildHref(base: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      sp.set(key, value.trim())
    }
  })
  const qs = sp.toString()
  return qs ? `${base}?${qs}` : base
}
