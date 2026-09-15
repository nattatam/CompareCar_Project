import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface CompareBarProps {
  count: number
  onCompare: () => void
  onClear: () => void
}

export default function CompareBar({ count, onCompare, onClear }: CompareBarProps) {
  const t = useTranslations('CompareBar')
  const tCommon = useTranslations('Common')

  if (count === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground tabular-nums">
            {t('selected', { count })}
          </p>
          <p className="text-xs text-muted-foreground">{t('hint')}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="outline" onClick={onClear}>
            {tCommon('clear')}
          </Button>
          <Button type="button" onClick={onCompare} disabled={count < 2}>
            {t('compare', { count })}
          </Button>
        </div>
      </div>
    </div>
  )
}
