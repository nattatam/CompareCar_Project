import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SignUpForm from './SignUpForm'

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('./action', () => ({
  signUpWithEmail: vi.fn(async () => ({
    fieldErrors: { email: 'Please use an approved email address.' },
  })),
}))

describe('SignUpForm', () => {
  it('keeps entered values when sign-up fails', async () => {
    const user = userEvent.setup()
    render(<SignUpForm />)

    await user.type(screen.getByLabelText('Name'), 'Somchai')
    await user.type(screen.getByLabelText('Email'), 'somchai@example.com')
    await user.type(screen.getByLabelText('Password'), 'StrongPass1!')
    await user.type(screen.getByLabelText('Confirm password'), 'StrongPass1!')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText('Please use an approved email address.')).toBeInTheDocument()
    })
    expect(screen.getByLabelText('Name')).toHaveValue('Somchai')
    expect(screen.getByLabelText('Email')).toHaveValue('somchai@example.com')
    expect(screen.getByLabelText('Password')).toHaveValue('StrongPass1!')
    expect(screen.getByLabelText('Confirm password')).toHaveValue('StrongPass1!')
  })
})
