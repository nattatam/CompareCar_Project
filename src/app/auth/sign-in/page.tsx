import type { Metadata } from 'next'
import SignInForm from './SignInForm'

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  )
}
