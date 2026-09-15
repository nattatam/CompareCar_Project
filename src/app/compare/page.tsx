import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Loader2 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import CompareClient from '@/components/CompareClient'

export const metadata: Metadata = {
  title: 'Compare Cars Side-by-Side',
  description:
    'Put two to five cars side-by-side and compare power, torque, acceleration, range, fuel economy, dimensions, and price. See which car wins each category.',
  alternates: {
    canonical: '/compare',
  },
}

export default async function ComparePage() {
  const t = await getTranslations('Compare')

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <div className="flex items-center justify-center gap-2 py-16 text-zinc-500">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <span>{t('loading')}</span>
          </div>
        </div>
      }
    >
      <CompareClient />
    </Suspense>
  )
}
