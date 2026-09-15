'use client'

import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  function switchLocale(newLocale: string) {
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant={locale === 'th' ? 'default' : 'ghost'}
        size="xs"
        onClick={() => switchLocale('th')}
        className="cursor-pointer text-xs"
      >
        TH
      </Button>
      <Button
        type="button"
        variant={locale === 'en' ? 'default' : 'ghost'}
        size="xs"
        onClick={() => switchLocale('en')}
        className="cursor-pointer text-xs"
      >
        EN
      </Button>
    </div>
  )
}
