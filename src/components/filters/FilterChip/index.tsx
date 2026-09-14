import { Button } from '@/components/ui/button'

interface FilterChipProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <Button
      type="button"
      variant={active ? 'default' : 'outline'}
      size="xs"
      aria-pressed={active}
      onClick={onClick}
      className={`h-8 rounded-full px-3 leading-none font-medium ${active ? '' : 'text-muted-foreground'}`}
    >
      <span className="flex items-center gap-1.5">{children}</span>
    </Button>
  )
}