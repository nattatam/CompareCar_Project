import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }))
const { findMany } = vi.hoisted(() => ({ findMany: vi.fn(async () => []) }))

vi.mock('@/lib/auth/server', () => ({ auth: { getSession } }))
vi.mock('@/lib/prisma', () => ({ prisma: { subModelCar: { findMany } } }))

import { GET, POST } from './route'

beforeEach(() => {
  getSession.mockReset()
  findMany.mockReset()
  getSession.mockResolvedValue({
    data: { session: { id: 'session-1' }, user: { id: 'user-1' } },
    error: null,
  })
})

describe('/api/cars/brand', () => {
  it('keeps GET public', async () => {
    findMany.mockResolvedValue([])

    const response = await GET(new Request('http://localhost:3000/api/cars/brand'))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([])
  })

  it('requires a session for POST', async () => {
    getSession.mockResolvedValue({ data: { session: null, user: null }, error: null })

    const response = await POST(
      new Request('http://localhost:3000/api/cars/brand', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Test', model: 'Model', subModel: 'Sub' }),
      }),
    )

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ message: 'Unauthorized' })
  })

  it('passes the guard for a valid session and reaches validation', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/cars/brand', {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin: 'http://localhost:3000' },
        body: 'not json',
      }),
    )

    expect(response.status).toBe(400)
  })
})
