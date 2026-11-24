import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/auth/server', () => {
  const passthrough = vi.fn(async () => new Response('ok'))

  return {
    auth: {
      handler: () => ({
        GET: passthrough,
        POST: passthrough,
        PUT: passthrough,
        PATCH: passthrough,
        DELETE: passthrough,
      }),
    },
  }
})

import { GET, POST } from './route'

function context(path: string[]) {
  return { params: Promise.resolve({ path }) }
}

describe('auth route guard', () => {
  it('blocks direct sign-up endpoints', async () => {
    const response = await POST(new Request('http://localhost/api/auth/sign-up/email', { method: 'POST' }), context(['sign-up', 'email']))

    expect(response.status).toBe(403)
  })

  it('blocks other user-creation endpoints', async () => {
    const response = await POST(new Request('http://localhost/api/auth/sign-in/magic-link', { method: 'POST' }), context(['sign-in', 'magic-link']))

    expect(response.status).toBe(403)
  })

  it('allows regular auth endpoints', async () => {
    const response = await GET(new Request('http://localhost/api/auth/get-session'), context(['get-session']))

    expect(response.status).toBe(200)
  })
})
