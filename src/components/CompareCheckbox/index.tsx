import type { MouseEvent } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface CompareCheckboxProps {
  selected: boolean
  onToggle: () => void
}

export function CompareCheckbox({ selected, onToggle }: CompareCheckboxProps) {
  const t = useTranslations('CompareCheckbox')
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onToggle()
  }

  return (
    <Button
      type="button"
      variant={selected ? 'default' : 'outline'}
      aria-pressed={selected}
      onClick={handleClick}
      className="mt-auto w-full cursor-pointer"
    >
      {selected && <Check className="size-4" />}
      {selected ? t('selected') : t('add')}
    </Button>
  )
}
