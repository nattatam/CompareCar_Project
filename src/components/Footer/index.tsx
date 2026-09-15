import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('Footer')
  const tNav = useTranslations('Nav')

  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>{t('disclaimer')}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/disclaimer" className="font-medium text-primary hover:underline">
            {tNav('disclaimer')}
          </Link>
          <Link href="/credits" className="font-medium text-primary hover:underline">
            {tNav('imageCredits')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
