import { subModelParamSchema } from '@/lib/schema'

export function parseSubModelParam(param: unknown) {
  const result = subModelParamSchema.safeParse(param)

  if (!result.success) return { ok: false as const, errors: { status: '400', message: 'validation fail' } }

  return { ok: true as const, data: result.data }
}
