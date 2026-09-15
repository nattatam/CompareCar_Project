import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function Header() {
  const t = useTranslations('Nav')

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
          <Image src="/icon-compare-car.png" alt="CompareCar logo" width={32} height={32} className="h-8 w-8 rounded-lg object-contain" />
          CompareCar
        </Link>
        <nav className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">{t('catalog')}</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/compare">{t('compare')}</Link>
          </Button>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  )
}
