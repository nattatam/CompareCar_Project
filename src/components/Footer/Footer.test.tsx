import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from './'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Footer', () => {
  it('renders the brand line', () => {
    render(<Footer />)
    expect(
      screen.getByText('CompareCar — independent car comparison platform. Data for reference only.')
    ).toBeInTheDocument()
  })

  it('renders the disclaimer link', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Disclaimer' })).toHaveAttribute('href', '/disclaimer')
  })

  it('renders the image credits link', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Image credits (Wikimedia Commons)' })).toHaveAttribute('href', '/credits')
  })
})