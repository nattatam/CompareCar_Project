import { withAuth } from '@/lib/auth/api-guard'
import { auth } from '@/lib/auth/server'
import { serverError } from '@/lib/api/response'

export const POST = withAuth(async () => {
  const { error } = await auth.signOut()

  if (error) {
    return serverError(error.message || 'Logout failed')
  }

  return Response.json({ ok: true })
})
