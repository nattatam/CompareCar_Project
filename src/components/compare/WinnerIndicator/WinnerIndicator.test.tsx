import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WinnerIndicator } from '.'

describe('WinnerIndicator', () => {
  it('renders the star when show is true', () => {
    render(<WinnerIndicator show />)
    expect(screen.getByLabelText('best value')).toBeInTheDocument()
  })

  it('renders nothing when show is false', () => {
    const { container } = render(<WinnerIndicator show={false} />)
    expect(container.firstChild).toBeNull()
  })
})