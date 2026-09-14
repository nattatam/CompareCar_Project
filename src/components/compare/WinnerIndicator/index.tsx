interface WinnerIndicatorProps {
  show: boolean
}

export function WinnerIndicator({ show }: WinnerIndicatorProps) {
  if (!show) return null
  return (
    <span aria-label="best value" className="mr-1 text-xs font-bold text-amber-700">
      ★
    </span>
  )
}