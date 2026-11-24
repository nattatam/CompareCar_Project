import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getSession, signOut } = vi.hoisted(() => ({ getSession: vi.fn(), signOut: vi.fn() }))

vi.mock('@/lib/auth/server', () => ({ auth: { getSession, signOut } }))

import { POST } from './route'

function makeRequest() {
  return new Request('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
  })
}

beforeEach(() => {
  getSession.mockReset().mockResolvedValue({
    data: { session: { id: 'session-1' }, user: { id: 'user-1', name: 'Admin' } },
    error: null,
  })
  signOut.mockReset().mockResolvedValue({ error: null })
})

describe('logout route', () => {
  it('signs out an authenticated user', async () => {
    const response = await POST(makeRequest())

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    expect(signOut).toHaveBeenCalledOnce()
  })

  it('rejects an unauthenticated request without signing out', async () => {
    getSession.mockResolvedValueOnce({ data: { session: null, user: null }, error: null })

    const response = await POST(makeRequest())

    expect(response.status).toBe(401)
    expect(signOut).not.toHaveBeenCalled()
  })

  it('returns an error when sign out fails', async () => {
    signOut.mockResolvedValueOnce({ error: { message: 'Upstream error' } })

    const response = await POST(makeRequest())

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ message: 'Upstream error' })
  })
})
