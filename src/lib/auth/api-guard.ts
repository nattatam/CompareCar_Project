import { auth } from './server'
import { apiError } from '@/lib/api/response'

type ApiHandler<RequestType extends Request, Args extends unknown[]> = (
  request: RequestType,
  ...args: Args
) => Promise<Response>

function firstHeaderValue(value: string | null) {
  return value?.split(',')[0]?.trim() || null
}

async function hasSession() {
  try {
    const session = await auth.getSession()
    return !session.error && Boolean(session.data?.session)
  } catch {
    return false
  }
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return process.env.NODE_ENV !== 'production'

  let originUrl: URL
  try {
    originUrl = new URL(origin)
  } catch {
    return false
  }

  const requestUrl = new URL(request.url)
  const host = firstHeaderValue(request.headers.get('x-forwarded-host')) ?? request.headers.get('host') ?? requestUrl.host
  const protocol = firstHeaderValue(request.headers.get('x-forwarded-proto')) ?? requestUrl.protocol.slice(0, -1)

  return originUrl.host === host && originUrl.protocol === `${protocol}:`
}

export function withAuth<RequestType extends Request, Args extends unknown[]>(
  handler: ApiHandler<RequestType, Args>,
): ApiHandler<RequestType, Args> {
  return async (request, ...args) => {
    if (!(await hasSession())) {
      return apiError('Unauthorized', 401)
    }

    if (!isAllowedOrigin(request)) {
      return apiError('Invalid origin', 403)
    }

    return handler(request, ...args)
  }
}
