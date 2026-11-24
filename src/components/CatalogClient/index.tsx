'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { scrollToTop } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Pagination } from '@/components/Pagination'
import CarCard from '@/components/CarCard'
import CompareBar from '@/components/CompareBar'
import FilterBar from '@/components/FilterBar'
import { DEFAULT_PRICE_RANGE } from '@/constants/constants'
import type { Brand, Subtype } from '@/constants/constants'
import DisclaimerBox from '@/components/DisclaimerBox'
import type { CarListItemDTO } from '@/lib/dto/car'
import type { PowertrainType, Category } from '@/lib/types'

type PaginationInfo = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type Props = {
  searchParams?: { q?: string | string[]; page?: string | string[] }
}

export default function CatalogClient({ searchParams }: Props) {
  const router = useRouter()
  const t = useTranslations('Catalog')
  const initialQuery = Array.isArray(searchParams?.q) ? searchParams?.q[0] : (searchParams?.q ?? '')
  const initialPage = Math.max(1, Number(Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page) || 1)
  const [query, setQuery] = useState(initialQuery)
  const [powertrain, setPowertrain] = useState<'All' | PowertrainType>('All')
  const [subtype, setSubtype] = useState<Subtype>('All')
  const [category, setCategory] = useState<'All' | Category>('All')
  const [brand, setBrand] = useState<Brand>('All')
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE_RANGE)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(initialPage)
  const [carList, setCarList] = useState<CarListItemDTO[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({ page: initialPage, limit: 24, total: 0, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(false)

  function handlePageChange(nextPage: number) {
    setPage(nextPage)
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (brand && brand !== 'All') params.set('brand', brand)
    if (category && category !== 'All') params.set('category', category)
    if (powertrain && powertrain !== 'All') params.set('powertrain', powertrain)
    if (subtype && subtype !== 'All') params.set('subtype', subtype)
    const [min, max] = priceRange
    if (min > 0) params.set('minPrice', String(min))
    if (max < 5000000) params.set('maxPrice', String(max))
    if (nextPage > 1) params.set('page', String(nextPage))
    const qs = params.toString()
    router.push(qs ? `/?${qs}` : '/', { scroll: false })
    scrollToTop()
  }

  function resetPage(updateFilter: () => void, newQuery?: string) {
    setPage(1)
    updateFilter()
  }

  const dataCar = async (p = page, q = query) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      params.set('page', String(p))
      if (q.trim()) params.set('q', q.trim())
      if (brand && brand !== 'All') params.set('brand', brand)
      if (category && category !== 'All') params.set('category', category)
      if (powertrain && powertrain !== 'All') params.set('powertrain', powertrain)
      if (subtype && subtype !== 'All') params.set('subtype', subtype)
      const [min, max] = priceRange
      if (min > 0) params.set('minPrice', String(min))
      if (max < 5000000) params.set('maxPrice', String(max))
      const res = await fetch(`/api/cars?${params.toString()}`)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`)
      }
      const json = await res.json()
      setCarList(json.data ?? [])
      if (json.pagination) {
        setPagination(json.pagination)
      }
      return json.data
    } catch (error) {
      return
    } finally {
      setIsLoading(false)
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function goCompare() {
    const ids = Array.from(selected)
    if (ids.length === 0) return
    router.push(`/compare?ids=${ids.join(',')}`)
  }

  useEffect(() => {
    dataCar(page, query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    setPage(1)
    const qv = query
    const params = new URLSearchParams()
    if (qv.trim()) params.set('q', qv.trim())
    if (brand && brand !== 'All') params.set('brand', brand)
    if (category && category !== 'All') params.set('category', category)
    if (powertrain && powertrain !== 'All') params.set('powertrain', powertrain)
    if (subtype && subtype !== 'All') params.set('subtype', subtype)
    const [min, max] = priceRange
    if (min > 0) params.set('minPrice', String(min))
    if (max < 5000000) params.set('maxPrice', String(max))
    const qs = params.toString()
    router.push(qs ? `/?${qs}` : '/', { scroll: false })
    dataCar(1, qv)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, brand, category, powertrain, subtype, priceRange])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-1 text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:w-72 lg:self-start">
          <FilterBar
            query={query}
            powertrain={powertrain}
            subtype={subtype}
            category={category}
            brand={brand}
            priceRange={priceRange}
            onQueryChange={(v) => resetPage(() => setQuery(v), v)}
            onPowertrainChange={(v) => resetPage(() => setPowertrain(v))}
            onSubtypeChange={(v) => resetPage(() => setSubtype(v))}
            onCategoryChange={(v) => resetPage(() => setCategory(v))}
            onBrandChange={(v) => resetPage(() => setBrand(v))}
            onPriceRangeChange={(v) => resetPage(() => setPriceRange(v))}
            onClearPrice={() => setPriceRange(DEFAULT_PRICE_RANGE)}
          />
        </aside>

        <div className="min-w-0 flex-1">

          {carList.length === 0 && !isLoading ? (
            <Card className="py-16 text-center">
              <p className="text-muted-foreground">{t('empty')}</p>
            </Card>
          ) : (
            <>
              <div className="scroll-mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {carList.map((car) => (
                  <CarCard key={car.id} car={car} selected={selected.has(car.id)} onToggle={toggle} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination page={pagination.page} pageCount={pagination.totalPages} total={pagination.total} onChange={handlePageChange} />
              )}
            </>
          )}
        </div>
      </div>

      <CompareBar count={selected.size} onCompare={goCompare} onClear={() => setSelected(new Set())} />
      <DisclaimerBox className="mt-10" />
    </div>
  )
}
