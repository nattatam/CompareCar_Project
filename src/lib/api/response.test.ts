import { describe, expect, it } from 'vitest'
import { apiError, readJsonBody, validationError } from './response'

describe('api response helpers', () => {
  it('builds an error response with the given status', async () => {
    const response = apiError('Car not found', 404)

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ message: 'Car not found' })
  })

  it('includes field errors only when provided', async () => {
    const response = validationError({ name: 'required' })

    expect(response.status).toBe(422)
    expect(await response.json()).toEqual({
      message: 'Validation failed',
      errors: { name: 'required' },
    })
  })

  it('returns the parsed body for valid JSON', async () => {
    const request = new Request('http://localhost/api', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    })

    const result = await readJsonBody(request)

    expect(result).toEqual({ ok: true, body: { name: 'Test' } })
  })

  it('returns a 400 response for invalid JSON', async () => {
    const request = new Request('http://localhost/api', {
      method: 'POST',
      body: 'not json',
    })

    const result = await readJsonBody(request)

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.response.status).toBe(400)
    expect(await result.response.json()).toEqual({ message: 'Invalid JSON body' })
  })
})
