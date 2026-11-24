import Link from 'next/link'
import { Button } from '@/components/ui/button'
import BrandSearch from '@/components/admin/BrandSearch'
import BrandTable from '@/components/admin/BrandTable'
import { getBrands } from '@/lib/services/brand'

type Props = {
  searchParams: Promise<{ q?: string | string[] }>
}

export default async function BrandsListPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = (Array.isArray(q) ? q[0] : q)?.trim() ?? ''
  const brandList = await getBrands(query)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Brands</h1>
        <Button asChild>
          <Link href="/admin/brands/new">Add Brand</Link>
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BrandSearch query={query} />
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {query ? `${brandList.length} results for "${query}"` : `${brandList.length} entries`}
        </p>
      </div>

      <BrandTable brands={brandList} query={query} />
    </div>
  )
}
