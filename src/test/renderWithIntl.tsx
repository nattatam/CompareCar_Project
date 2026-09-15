import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import en from '../../messages/en.json'

function Providers({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {children}
    </NextIntlClientProvider>
  )
}

export function renderWithIntl(ui: ReactElement) {
  return render(ui, { wrapper: Providers })
}