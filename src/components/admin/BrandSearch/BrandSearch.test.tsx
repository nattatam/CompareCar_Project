import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import BrandSearch from '@/components/admin/BrandSearch'

const replace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/admin/brands',
}))

function type(input: HTMLElement, value: string) {
  fireEvent.change(input, { target: { value } })
}

describe('BrandSearch', () => {
  beforeEach(() => {
    replace.mockReset()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the current query from the URL', () => {
    render(<BrandSearch query="byd" />)
    expect(screen.getByRole('searchbox')).toHaveValue('byd')
  })

  it('debounces typing into a single navigation', () => {
    render(<BrandSearch query="" />)
    const input = screen.getByRole('searchbox')

    type(input, 'toy')
    type(input, 'toyo')

    expect(replace).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(replace).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/admin/brands?q=toyo', { scroll: false })
  })

  it('navigates back to the plain route when the field is cleared', () => {
    render(<BrandSearch query="byd" />)

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('searchbox')).toHaveValue('')

    act(() => {
      vi.advanceTimersByTime(400)
    })

    expect(replace).toHaveBeenCalledWith('/admin/brands', { scroll: false })
  })
})
