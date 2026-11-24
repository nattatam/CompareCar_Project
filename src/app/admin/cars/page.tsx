import Link from 'next/link'
import CarSearch from '@/components/admin/CarSearch'
import CarTable from '@/components/admin/CarTable'
import { Button } from '@/components/ui/button'
import { getCars } from '@/lib/services/car'
import { toCarListDTO } from '@/lib/mappers/car'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

type Props = {
  searchParams: Promise<{ q?: string | string[]; page?: string | string[] }>
}

function buildHref(base: string, params: Record<string, string | undefined>) {
  const sp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      sp.set(key, value.trim())
    }
  })
  const qs = sp.toString()
  return qs ? `${base}?${qs}` : base
}

export default async function CarListPage({ searchParams }: Props) {
  const { q, page: pageParam } = await searchParams
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? ''
  const currentPage = Math.max(1, Number(Array.isArray(pageParam) ? pageParam[0] : pageParam) || 1)
  const limit = 20

  const carData = await getCars(currentPage, limit, query)
  const { data: carList, pagination } = toCarListDTO(carData)
  const { total, totalPages } = pagination

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Brands</h1>
        <Button asChild>
          <Link href="/admin/cars/new">Add Car</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CarSearch query={query} />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {query ? `${carList.length} results for "${query}"` : `${total} entries`}
        </p>
      </div>

      <CarTable list={carList} query={query} pagination={pagination} />
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={buildHref('/admin/cars', { q: query || undefined, page: String(Math.max(1, currentPage - 1)) })}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href={buildHref('/admin/cars', { q: query || undefined, page: String(page) })} isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href={buildHref('/admin/cars', { q: query || undefined, page: String(Math.min(totalPages, currentPage + 1)) })}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
