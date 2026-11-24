import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }))

vi.mock('./server', () => ({ auth: { getSession } }))

import { withAuth } from './api-guard'

const okHandler = async (request: Request) => new Response(request.method.toLowerCase())

function makeRequest(url = 'http://localhost:3000/api/cars', headers?: HeadersInit) {
  return new Request(url, { method: 'POST', headers })
}

beforeEach(() => {
  getSession.mockReset()
  getSession.mockResolvedValue({
    data: { session: { id: 'session-1' }, user: { id: 'user-1' } },
    error: null,
  })
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('withAuth', () => {
  it('returns 401 when there is no session', async () => {
    getSession.mockResolvedValueOnce({ data: { session: null, user: null }, error: null })

    const response = await withAuth(okHandler)(makeRequest())

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ message: 'Unauthorized' })
  })

  it('returns 401 when the session lookup fails', async () => {
    getSession.mockRejectedValueOnce(new Error('network error'))

    const response = await withAuth(okHandler)(makeRequest())

    expect(response.status).toBe(401)
  })

  it('returns 401 when the session lookup reports an error', async () => {
    getSession.mockResolvedValueOnce({
      data: { session: { id: 'session-1' }, user: { id: 'user-1' } },
      error: { message: 'invalid session' },
    })

    const response = await withAuth(okHandler)(makeRequest())

    expect(response.status).toBe(401)
  })

  it('allows a same-origin request without an Origin header in development', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const response = await withAuth(okHandler)(makeRequest())

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('post')
  })

  it('rejects a missing Origin header in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')

    const response = await withAuth(okHandler)(makeRequest())

    expect(response.status).toBe(403)
  })

  it('allows a matching Origin header', async () => {
    const response = await withAuth(okHandler)(
      makeRequest('http://localhost:3000/api/cars', { origin: 'http://localhost:3000' }),
    )

    expect(response.status).toBe(200)
  })

  it('rejects a mismatched Origin header', async () => {
    const response = await withAuth(okHandler)(
      makeRequest('http://localhost:3000/api/cars', { origin: 'https://evil.example' }),
    )

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ message: 'Invalid origin' })
  })

  it('rejects a protocol mismatch', async () => {
    const response = await withAuth(okHandler)(
      makeRequest('http://localhost:3000/api/cars', { origin: 'https://localhost:3000' }),
    )

    expect(response.status).toBe(403)
  })

  it('uses forwarded proxy headers to validate the original origin', async () => {
    const response = await withAuth(okHandler)(
      makeRequest('http://10.0.0.5:3000/api/cars', {
        origin: 'https://www.example.com',
        'x-forwarded-host': 'www.example.com, 10.0.0.5:3000',
        'x-forwarded-proto': 'https',
      }),
    )

    expect(response.status).toBe(200)
  })
})
