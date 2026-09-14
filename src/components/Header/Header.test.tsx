import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}))

describe('Header', () => {
  it('renders the brand name', () => {
    render(<Header />)
    expect(screen.getByText('CompareCar')).toBeInTheDocument()
  })

  it('renders the logo with alt text', () => {
    render(<Header />)
    expect(screen.getByAltText('CompareCar logo')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Compare' })).toHaveAttribute('href', '/compare')
  })
})