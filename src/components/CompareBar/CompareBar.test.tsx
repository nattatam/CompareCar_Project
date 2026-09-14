import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CompareBar from './'

describe('CompareBar', () => {
  it('renders nothing when count is 0', () => {
    const { container } = render(<CompareBar count={0} onCompare={() => {}} onClear={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows the selected count', () => {
    render(<CompareBar count={2} onCompare={() => {}} onClear={() => {}} />)
    expect(screen.getByText('2 cars selected')).toBeInTheDocument()
  })

  it('shows singular text for 1 car', () => {
    render(<CompareBar count={1} onCompare={() => {}} onClear={() => {}} />)
    expect(screen.getByText('1 car selected')).toBeInTheDocument()
  })

  it('disables compare when fewer than 2 cars selected', () => {
    render(<CompareBar count={1} onCompare={() => {}} onClear={() => {}} />)
    expect(screen.getByRole('button', { name: 'Compare (1)' })).toBeDisabled()
  })

  it('enables compare when 2 or more cars selected', () => {
    render(<CompareBar count={3} onCompare={() => {}} onClear={() => {}} />)
    expect(screen.getByRole('button', { name: 'Compare (3)' })).toBeEnabled()
  })

  it('calls onCompare when compare clicked', async () => {
    const user = userEvent.setup()
    const onCompare = vi.fn()
    render(<CompareBar count={2} onCompare={onCompare} onClear={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'Compare (2)' }))
    expect(onCompare).toHaveBeenCalledTimes(1)
  })

  it('calls onClear when clear clicked', async () => {
    const user = userEvent.setup()
    const onClear = vi.fn()
    render(<CompareBar count={2} onCompare={() => {}} onClear={onClear} />)
    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(onClear).toHaveBeenCalledTimes(1)
  })
})