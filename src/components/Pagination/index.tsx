import { Button } from '@/components/ui/button'
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'

interface PaginationProps {
  page: number
  pageCount: number
  total: number
  onChange: (page: number) => void
}

export function Pagination({ page, pageCount, total, onChange }: PaginationProps) {
  const pageList = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <PaginationRoot className="mt-10 flex-col gap-4 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground tabular-nums">
        {total} car{total !== 1 ? 's' : ''} · Page {page} of {pageCount}
      </p>
      <PaginationContent>
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => onChange(page - 1)}
            className="cursor-pointer"
          >
            Previous
          </Button>
        </PaginationItem>
        {pageList.map((p) => (
          <PaginationItem key={p}>
            <Button
              type="button"
              variant={p === page ? 'default' : 'outline'}
              size="sm"
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
              className="cursor-pointer tabular-nums"
            >
              {p}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page === pageCount}
            onClick={() => onChange(page + 1)}
            className="cursor-pointer"
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  )
}
