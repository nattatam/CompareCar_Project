import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl } from '@/test/renderWithIntl'
import AdminNav from '@/components/admin/AdminNav'

const { mockUsePathname, mockReplace, mockRefresh, mockToastError } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
  mockReplace: vi.fn(),
  mockRefresh: vi.fn(),
  mockToastError: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ replace: mockReplace, refresh: mockRefresh }),
}))

vi.mock('sonner', () => ({ toast: { error: mockToastError } }))

vi.mock('@/components/ui/hover-card', () => ({
  HoverCard: ({ children }: { children: ReactNode }) => <>{children}</>,
  HoverCardTrigger: ({ children }: { children: ReactNode }) => <>{children}</>,
  HoverCardContent: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

describe('AdminNav', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/admin/brands')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('lists every list page and create form in two labeled groups', () => {
    renderWithIntl(<AdminNav />)

    const viewGroup = screen.getByRole('group', { name: 'View data' })
    const createGroup = screen.getByRole('group', { name: 'Create' })

    expect(within(viewGroup).getByRole('link', { name: 'Brands' })).toHaveAttribute('href', '/admin/brands')
    expect(within(viewGroup).getByRole('link', { name: 'Cars' })).toHaveAttribute('href', '/admin/cars')
    expect(within(createGroup).getByRole('link', { name: 'Brand, model & submodel' })).toHaveAttribute(
      'href',
      '/admin/brands/new',
    )
    expect(within(createGroup).getByRole('link', { name: 'Car' })).toHaveAttribute('href', '/admin/cars/new')
    expect(screen.queryByRole('link', { name: /sign (in|up)/i })).not.toBeInTheDocument()
  })

  it('marks the matching view tab on a list page', () => {
    mockUsePathname.mockReturnValue('/admin/cars')
    renderWithIntl(<AdminNav />)

    expect(screen.getByRole('link', { name: 'Cars' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Car' })).not.toHaveAttribute('aria-current')
  })

  it('marks the matching create tab on a create page', () => {
    mockUsePathname.mockReturnValue('/admin/brands/new')
    renderWithIntl(<AdminNav />)

    expect(screen.getByRole('link', { name: 'Brand, model & submodel' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Brands' })).not.toHaveAttribute('aria-current')
  })

  it('keeps all links inactive on unrelated admin paths', () => {
    mockUsePathname.mockReturnValue('/admin/unknown')
    renderWithIntl(<AdminNav />)

    const current = screen.getAllByRole('link').filter((link) => link.getAttribute('aria-current') === 'page')
    expect(current).toHaveLength(0)
  })

  it('toggles the card on touch and ignores mouse clicks on the trigger', () => {
    renderWithIntl(<AdminNav />)
    const trigger = screen.getByRole('button', { name: 'Admin menu' })

    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.pointerUp(trigger, { pointerType: 'mouse' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')

    fireEvent.pointerUp(trigger, { pointerType: 'touch' })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    fireEvent.pointerUp(trigger, { pointerType: 'touch' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('logs out through the API and redirects to sign-in', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    renderWithIntl(<AdminNav />)

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/logout',
        expect.objectContaining({ method: 'POST', credentials: 'same-origin' }),
      )
    })
    expect(mockReplace).toHaveBeenCalledWith('/auth/sign-in')
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('shows an error and stays signed in when logout fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false })
    vi.stubGlobal('fetch', fetchMock)
    renderWithIntl(<AdminNav />)

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))

    await waitFor(() => expect(mockToastError).toHaveBeenCalled())
    expect(mockReplace).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Log out' })).toBeEnabled()
  })
})
