import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithIntl } from '@/test/renderWithIntl'
import { Pagination } from '.'

describe('Pagination', () => {
  it('renders the total count and page info', () => {
    renderWithIntl(<Pagination page={1} pageCount={3} total={42} onChange={() => {}} />)
    expect(screen.getByText('42 cars · Page 1 of 3')).toBeInTheDocument()
  })

  it('renders singular when total is 1', () => {
    renderWithIntl(<Pagination page={1} pageCount={1} total={1} onChange={() => {}} />)
    expect(screen.getByText('1 car · Page 1 of 1')).toBeInTheDocument()
  })

  it('disables Previous on the first page', () => {
    renderWithIntl(<Pagination page={1} pageCount={3} total={30} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })

  it('disables Next on the last page', () => {
    renderWithIntl(<Pagination page={3} pageCount={3} total={30} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('marks the current page with aria-current', () => {
    renderWithIntl(<Pagination page={2} pageCount={5} total={50} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: '2' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: '1' })).not.toHaveAttribute('aria-current')
  })

  it('calls onChange with the previous page number', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithIntl(<Pagination page={2} pageCount={5} total={50} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Previous' }))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('calls onChange with the next page number', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithIntl(<Pagination page={2} pageCount={5} total={50} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('calls onChange when a page number is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderWithIntl(<Pagination page={1} pageCount={3} total={30} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: '3' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })
})