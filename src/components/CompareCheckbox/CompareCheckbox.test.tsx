import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl } from '@/test/renderWithIntl'
import { CompareCheckbox } from '.'

describe('CompareCheckbox', () => {
  it('shows the add label with aria-pressed false when not selected', () => {
    renderWithIntl(<CompareCheckbox selected={false} onToggle={() => {}} />)
    const button = screen.getByRole('button', { name: 'Add to compare' })
    expect(button).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows the selected label with aria-pressed true when selected', () => {
    renderWithIntl(<CompareCheckbox selected onToggle={() => {}} />)
    const button = screen.getByRole('button', { name: 'Selected for compare' })
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    renderWithIntl(<CompareCheckbox selected={false} onToggle={onToggle} />)
    await user.click(screen.getByRole('button', { name: 'Add to compare' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle even when already selected', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    renderWithIntl(<CompareCheckbox selected onToggle={onToggle} />)
    await user.click(screen.getByRole('button', { name: 'Selected for compare' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })
})