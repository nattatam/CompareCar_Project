import { z } from 'zod'
import { featureParamSchema, featureSchema } from '@/lib/schema'

type Err = { ok: false; errors: Record<string, string> }

export type ParseFeatureParamResult = { ok: true; data: z.infer<typeof featureParamSchema> } | Err
export type ParseFeatureResult = { ok: true; data: z.infer<typeof featureSchema> } | Err

const VALIDATION_ERROR: Err = { ok: false, errors: { status: '400', message: 'validation fail' } }

export function parseFeatureParam(param: unknown): ParseFeatureParamResult {
  const result = featureParamSchema.safeParse(param)

  if (!result.success) return VALIDATION_ERROR

  return { ok: true, data: result.data }
}

export function parseFeature(body: unknown): ParseFeatureResult {
  const result = featureSchema.safeParse(body)

  if (!result.success) return VALIDATION_ERROR

  return { ok: true, data: result.data }
}
