import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithIntl } from '@/test/renderWithIntl'
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

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/admin/cars',
}))

describe('Header', () => {
  it('renders the brand name', () => {
    renderWithIntl(<Header />)
    expect(screen.getByText('CompareCar')).toBeInTheDocument()
  })

  it('renders the logo with alt text', () => {
    renderWithIntl(<Header />)
    expect(screen.getByAltText('CompareCar logo')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderWithIntl(<Header />)
    expect(screen.getByRole('link', { name: 'Catalog' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Compare' })).toHaveAttribute('href', '/compare')
  })

  it('hides the admin menu by default', () => {
    renderWithIntl(<Header />)
    expect(screen.queryByRole('button', { name: 'Admin menu' })).not.toBeInTheDocument()
  })

  it('shows the admin menu for a logged-in user', () => {
    renderWithIntl(<Header showAdminMenu />)
    expect(screen.getByRole('button', { name: 'Admin menu' })).toBeInTheDocument()
  })

  it('shows the logged-in admin name', () => {
    renderWithIntl(<Header showAdminMenu adminName="Somchai" />)
    expect(screen.getByText('Admin: Somchai')).toBeInTheDocument()
  })
})