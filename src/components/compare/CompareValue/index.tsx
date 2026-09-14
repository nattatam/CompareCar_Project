interface CompareValueProps {
  value: number | string | null | undefined
  unit?: string
  isBest?: boolean
}

export function CompareValue({ value, unit, isBest }: CompareValueProps) {
  if (value === null || value === undefined) {
    return <span className="text-foreground/80">—</span>
  }
  const formatted =
    typeof value === 'number' && !Number.isInteger(value)
      ? value.toFixed(1)
      : String(value)
  const text = unit ? `${formatted} ${unit}` : formatted
  return (
    <span className={isBest ? 'font-bold text-foreground' : 'text-foreground/80'}>
      {text}
    </span>
  )
}