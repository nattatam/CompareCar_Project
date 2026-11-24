import { z } from 'zod'
import { carFormSchema, brandSchema } from '@/lib/schema'
import type { CarInput, BrandInput } from '@/lib/schema'

export type ParseCarResult = { ok: true; data: CarInput } | { ok: false; errors: Record<string, string> }

const GROUP_KEYS = new Set(['spec', 'dimension'])

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const issue of error.issues) {
    const key = issue.path
      .map((part) => String(part))
      .filter((part) => !GROUP_KEYS.has(part))
      .join('.')

    if (key === '') {
      errors.form ??= issue.message
      continue
    }
    errors[key] ??= issue.message
  }

  return errors
}

export function parseCarInput(body: unknown): ParseCarResult {
  const result = carFormSchema.safeParse(body)
  if (!result.success) return { ok: false, errors: toFieldErrors(result.error) }

  return { ok: true, data: result.data }
}
