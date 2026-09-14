import { Check } from 'lucide-react'

interface FeatureListProps {
  items: string[]
}

export function FeatureList({ items }: FeatureListProps) {
  return (
    <ul className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-2 text-sm text-foreground"
        >
          <Check
            className="mt-0.5 size-4 shrink-0 text-primary"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}