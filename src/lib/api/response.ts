type FieldErrors = Record<string, string | string[]>

type JsonBodyResult =
  | { ok: true; body: unknown }
  | { ok: false; response: Response }

export function apiError(message: string, status: number, errors?: FieldErrors) {
  return Response.json(errors ? { message, errors } : { message }, { status })
}

export function validationError(errors: FieldErrors) {
  return apiError('Validation failed', 422, errors)
}

export function serverError(message: string) {
  return apiError(message, 500)
}

export async function readJsonBody(req: Request): Promise<JsonBodyResult> {
  try {
    return { ok: true, body: await req.json() }
  } catch {
    return { ok: false, response: apiError('Invalid JSON body', 400) }
  }
}
