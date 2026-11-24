import { auth } from '@/lib/auth/server'

type RouteHandler = (request: Request, context: { params: Promise<{ path: string[] }> }) => Promise<Response>

const handler = auth.handler()

const blockedPaths = ['sign-up', 'sign-in/social', 'sign-in/magic-link', 'sign-in/email-otp', 'sign-in/phone-number']

function normalizeSegment(segment: string) {
  try {
    return decodeURIComponent(segment).toLowerCase()
  } catch {
    return segment.toLowerCase()
  }
}

function isBlockedPath(path: string[]) {
  const segments = path.filter(Boolean).map(normalizeSegment)

  return segments.some((_, index) =>
    blockedPaths.some((blocked) => {
      const rest = segments.slice(index).join('/')
      return rest === blocked || rest.startsWith(`${blocked}/`)
    }),
  )
}

function guard(next: RouteHandler): RouteHandler {
  return async (request, context) => {
    const { path } = await context.params
    if (isBlockedPath(path)) {
      return Response.json({ error: 'Sign-up is only available through the application form.' }, { status: 403 })
    }

    return next(request, context)
  }
}

export const GET = guard(handler.GET)
export const POST = guard(handler.POST)
export const PUT = guard(handler.PUT)
export const PATCH = guard(handler.PATCH)
export const DELETE = guard(handler.DELETE)
