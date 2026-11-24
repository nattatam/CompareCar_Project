import { describe, expect, it } from 'vitest'
import { getAllowedList, isAllowedEmail } from './signup-allowlist'

describe('getAllowedList', () => {
  it('normalizes comma separated values', () => {
    expect(getAllowedList(' Admin@Example.com , , user@example.com ')).toEqual([
      'admin@example.com',
      'user@example.com',
    ])
  })
})

describe('isAllowedEmail', () => {
  it('allows only configured emails', () => {
    const emails = getAllowedList('admin@example.com')

    expect(isAllowedEmail('ADMIN@example.com', emails)).toBe(true)
    expect(isAllowedEmail('other@gmail.com', emails)).toBe(false)
  })

  it('rejects every email when the list is empty', () => {
    expect(isAllowedEmail('anyone@example.com', [])).toBe(false)
  })

  it('supports the wildcard value', () => {
    expect(isAllowedEmail('anyone@example.com', getAllowedList('*'))).toBe(true)
  })
})
