import type { MouseEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface CompareCheckboxProps {
  selected: boolean
  onToggle: () => void
}

export function CompareCheckbox({ selected, onToggle }: CompareCheckboxProps) {
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
      {selected ? 'Selected for compare' : 'Add to compare'}
    </Button>
  )
}
