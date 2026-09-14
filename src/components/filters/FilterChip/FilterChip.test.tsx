import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterChip } from '.'

describe('FilterChip', () => {
  it('renders its children', () => {
    render(
      <FilterChip active={false} onClick={() => {}}>
        SUV
      </FilterChip>
    )
    expect(screen.getByRole('button', { name: 'SUV' })).toBeInTheDocument()
  })

  it('reflects the active state via aria-pressed', () => {
    const { rerender } = render(
      <FilterChip active={false} onClick={() => {}}>
        ICE
      </FilterChip>
    )
    expect(screen.getByRole('button', { name: 'ICE' })).toHaveAttribute('aria-pressed', 'false')

    rerender(
      <FilterChip active onClick={() => {}}>
        ICE
      </FilterChip>
    )
    expect(screen.getByRole('button', { name: 'ICE' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('applies the default variant when active and outline when inactive', () => {
    const { rerender } = render(
      <FilterChip active onClick={() => {}}>
        PHEV
      </FilterChip>
    )
    const activeButton = screen.getByRole('button', { name: 'PHEV' })
    expect(activeButton.className).toContain('bg-primary')

    rerender(
      <FilterChip active={false} onClick={() => {}}>
        PHEV
      </FilterChip>
    )
    expect(screen.getByRole('button', { name: 'PHEV' }).className).not.toContain('bg-primary')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <FilterChip active={false} onClick={onClick}>
        BEV
      </FilterChip>
    )

    await user.click(screen.getByRole('button', { name: 'BEV' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
