import type { Metadata } from 'next'
import SignUpForm from './SignUpForm'

export const metadata: Metadata = {
  title: 'Admin sign up',
  robots: { index: false, follow: false },
}

export default function AdminSignUpPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
