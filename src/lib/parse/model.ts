import { modelParamSchema } from '@/lib/schema'

export function paresModelParam(body: unknown) {
  const result = modelParamSchema.safeParse(body)

  if (!result.success) return { ok: false as const, errors: { status: '400', message: 'validation fail' } }

  return { ok: true as const, data: result.data }
}
