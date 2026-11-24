import { z } from 'zod'
import { powerTrainParamSchema, powerTrainSchema } from '@/lib/schema'

type Err = { ok: false; errors: Record<string, string> }

export type ParsePowerTrainParamResult = { ok: true; data: z.infer<typeof powerTrainParamSchema> } | Err
export type ParsePowerTrainResult = { ok: true; data: z.infer<typeof powerTrainSchema> } | Err

const VALIDATION_ERROR: Err = { ok: false, errors: { status: '400', message: 'validation fail' } }

export function parsePowerTrainParam(param: unknown): ParsePowerTrainParamResult {
  const result = powerTrainParamSchema.safeParse(param)

  if (!result.success) return VALIDATION_ERROR

  return { ok: true, data: result.data }
}

export function parsePowerTrain(body: unknown): ParsePowerTrainResult {
  const result = powerTrainSchema.safeParse(body)

  if (!result.success) return VALIDATION_ERROR

  return { ok: true, data: result.data }
}
