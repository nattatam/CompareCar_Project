import { CompareValue } from '@/components/compare/CompareValue'

interface SpecRowProps {
  label: string
  value: number | string | null | undefined
  unit?: string
}

export function SpecRow({ label, value, unit }: SpecRowProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground tabular-nums">
        <CompareValue value={value} unit={unit} />
      </dd>
    </div>
  )
}