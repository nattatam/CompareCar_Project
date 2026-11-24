import { brandSchema } from '@/lib/schema'
import type { BrandInput } from '@/lib/schema'

export type ParseBrandResult = { ok: true; data: BrandInput } | { ok: false; errors: Record<string, string> }

export function parseBrandInput(body: unknown): ParseBrandResult {
  const result = brandSchema.safeParse(body)

  if (!result.success) return { ok: false, errors: { status: '400', message: 'error check' } }

  return { ok: true, data: result.data }
}
