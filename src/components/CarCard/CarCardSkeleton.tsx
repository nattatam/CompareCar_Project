import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CarCardSkeleton() {
  return (
    <Card className="p-0 shadow-sm" aria-hidden="true">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <CardContent className="flex flex-1 flex-col gap-0 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-10" />
            <div className="flex gap-1.5 pt-1.5">
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-4 w-20 shrink-0" />
        </div>

        <div className="mt-3 mb-3 grid grid-cols-2 gap-1.5 rounded-lg bg-muted/50 p-2">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              <Skeleton className="size-3.5 shrink-0" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-2 w-12" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>

        <Skeleton className="h-5 w-full" />
      </CardContent>
    </Card>
  )
}
