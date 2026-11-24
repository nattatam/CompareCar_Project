import { Badge } from '@/components/ui/badge'
import { badgeLabel, POWERTRAIN_LABELS, type Powertrain } from '@/lib/types'

interface PowertrainBadgeProps {
  powertrain: Powertrain | { type: string; subType?: string } | string
  className?: string
}

const styles: Record<string, string> = {
  ICE: 'bg-zinc-100 text-zinc-700 ring-zinc-300',
  EV: 'bg-blue-50 text-blue-700 ring-blue-200',
  MHEV: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  HEV: 'bg-teal-50 text-teal-700 ring-teal-200',
  PHEV: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'REEV/EREV': 'bg-amber-50 text-amber-700 ring-amber-200',
}

export default function PowertrainBadge({ powertrain, className = '' }: PowertrainBadgeProps) {
  let label = 'ICE'
  if (typeof powertrain === 'string') {
    const p = powertrain.toUpperCase()
    if (p === 'EV' || p === 'BEV') label = 'EV'
    else if (p === 'ICE') label = 'ICE'
    else label = p
  } else if (powertrain && typeof powertrain === 'object') {
    const pt = powertrain as any
    const type = pt.type?.toString().toUpperCase()
    const subType = pt.subType?.toString().toUpperCase()
    if (type === 'EV') {
      label = 'EV'
    } else if (type === 'ICE') {
      label = 'ICE'
    } else if (subType) {
      if (subType === 'BEV') label = 'EV'
      else label = POWERTRAIN_LABELS[subType] ?? POWERTRAIN_LABELS[pt.subType] ?? subType
    } else if (type) {
      label = type
    } else {
      try {
        label = badgeLabel(powertrain as Powertrain)
      } catch {
        label = 'ICE'
      }
    }
  }

  const displayLabel = label.toString().toUpperCase()
  const style = styles[displayLabel] ?? styles.ICE
  return (
    <Badge variant="outline" className={`rounded-full px-2.5 font-semibold ring-1 ring-inset ${style} ${className}`}>
      {displayLabel}
    </Badge>
  )
}
