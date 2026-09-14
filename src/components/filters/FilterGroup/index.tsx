interface FilterGroupProps {
  label: string
  children: React.ReactNode
}

export function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}