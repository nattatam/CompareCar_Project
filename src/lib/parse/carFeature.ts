import { z } from 'zod'
import { carFeatureInputSchema } from '@/lib/schema'

type Err = { ok: false; errors: Record<string, string> }

export type ParseCarFeatureResult = { ok: true; data: z.infer<typeof carFeatureInputSchema> } | Err

const VALIDATION_ERROR: Err = { ok: false, errors: { status: '400', message: 'validation fail' } }

export function parseCarFeature(body: unknown): ParseCarFeatureResult {
  const result = carFeatureInputSchema.safeParse(body)

  if (!result.success) return VALIDATION_ERROR

  return { ok: true, data: result.data }
}
