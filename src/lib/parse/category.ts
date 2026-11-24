import { categorySchema } from '@/lib/schema'
import type { CategoryInput } from '@/lib/schema'

export type ParseBrandResult = { ok: true; data: CategoryInput } | { ok: false; errors: Record<string, string> }

export function parseCategoryInput(body: unknown): ParseBrandResult {
  const result = categorySchema.safeParse(body)

  if (!result.success) return { ok: false, errors: { status: '400', message: 'error check' } }

  return { ok: true, data: result.data }
}
