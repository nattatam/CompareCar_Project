import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { TriangleAlert } from 'lucide-react'

interface DisclaimerBoxProps {
  className?: string
}

export default function DisclaimerBox({ className = '' }: DisclaimerBoxProps) {
  const t = useTranslations('Disclaimer')

  return (
    <aside
      className={`flex flex-col gap-10 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 sm:flex-row sm:items-start ${className}`}
    >
      <p className="flex-1 flex gap-1">
        <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
        <strong className="font-semibold text-amber-950">{t('note')}</strong> {t('noteText')}
      </p>
      <Link href="/disclaimer" className="shrink-0 font-medium text-amber-800 underline-offset-4 hover:underline">
        {t('readMore')}
      </Link>
    </aside>
  )
}
