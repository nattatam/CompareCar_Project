import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/60">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>CompareCar — independent car comparison platform. Data for reference only.</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link href="/disclaimer" className="font-medium text-primary hover:underline">
            Disclaimer
          </Link>
          <Link href="/credits" className="font-medium text-primary hover:underline">
            Image credits (Wikimedia Commons)
          </Link>
        </div>
      </div>
    </footer>
  )
}
