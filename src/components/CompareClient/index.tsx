'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import type { CompareCarDTO } from '@/lib/dto/compare'
import type { CarListItemDTO } from '@/lib/dto/car'
import type { Powertrain } from '@/lib/types'
import { formatPrice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SearchInput } from '@/components/ui/search-input'
import CarImage from '@/components/CarImage'
import PowertrainBadge from '@/components/PowertrainBadge'
import { CompareValue } from '@/components/compare/CompareValue'
import { WinnerIndicator } from '@/components/compare/WinnerIndicator'
import { SpecRow } from '@/components/compare/SpecRow'

const SPEC_ROWS: Array<{ key: string; labelKey: string; unit?: string; higherBetter?: boolean }> = [
  { key: 'torque', labelKey: 'torque', unit: 'Nm', higherBetter: true },
  { key: 'range', labelKey: 'range', unit: 'km', higherBetter: true },
  { key: 'topSpeed', labelKey: 'topSpeed', unit: 'km/h', higherBetter: true },
  { key: 'acceleration', labelKey: 'acceleration', unit: 's' },
  { key: 'seats', labelKey: 'seats', higherBetter: true },
  { key: 'weight', labelKey: 'weight', unit: 'kg' },
  { key: 'drivetrain', labelKey: 'drivetrain' },
  { key: 'groundClearance', labelKey: 'groundClearance', unit: 'mm', higherBetter: true },
  { key: 'trunkCapacity', labelKey: 'trunkCapacity', unit: 'L', higherBetter: true },
]

const MAX_COMPARE = 5
const PICKER_LIMIT = 20
const PICKER_DEBOUNCE_MS = 300

export default function CompareClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations('Compare')
  const tSpec = useTranslations('CompareSpec')
  const tCommon = useTranslations('Common')

  const idsParam = searchParams.get('ids') ?? ''
  const ids = useMemo(
    () =>
      Array.from(
        new Set(
          idsParam
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        )
      ).slice(0, MAX_COMPARE),
    [idsParam]
  )

  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [compared, setCompared] = useState<CompareCarDTO[]>([])
  const [missingIds, setMissingIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(ids.length > 0)
  const [error, setError] = useState(false)
  const [pickerCars, setPickerCars] = useState<CarListItemDTO[]>([])
  const [pickerLoading, setPickerLoading] = useState(false)

  useEffect(() => {
    if (ids.length === 0) return

    const controller = new AbortController()

    async function load() {
      setIsLoading(true)
      setError(false)
      try {
        const res = await fetch(`/api/compare?ids=${encodeURIComponent(ids.join(','))}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setCompared(Array.isArray(json.data) ? json.data : [])
        setMissingIds(Array.isArray(json.missingIds) ? json.missingIds : [])
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setCompared([])
        setError(true)
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [ids])

  useEffect(() => {
    if (!pickerOpen) return

    const controller = new AbortController()
    const delay = query.trim() ? PICKER_DEBOUNCE_MS : 0
    const timer = setTimeout(async () => {
      setPickerLoading(true)
      try {
        const params = new URLSearchParams({ limit: String(PICKER_LIMIT) })
        if (query.trim()) params.set('q', query.trim())
        const res = await fetch(`/api/cars?${params.toString()}`, { signal: controller.signal })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        setPickerCars(Array.isArray(json.data) ? json.data : [])
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setPickerCars([])
      } finally {
        if (!controller.signal.aborted) setPickerLoading(false)
      }
    }, delay)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [pickerOpen, query])

  const available = useMemo(() => pickerCars.filter((car) => !ids.includes(car.id)), [pickerCars, ids])

  const hasIds = ids.length > 0
  const visibleCompared = hasIds ? compared : []
  const visibleMissingIds = hasIds ? missingIds : []
  const showLoading = hasIds && isLoading && visibleCompared.length === 0
  const showError = hasIds && error

  function addCar(id: string) {
    if (ids.length >= MAX_COMPARE) return
    if (!ids.includes(id)) {
      router.push(`/compare?ids=${[...ids, id].join(',')}`)
    }
    if (ids.length === MAX_COMPARE - 1) setPickerOpen(false)
  }

  function removeCar(id: string) {
    const next = ids.filter((carId) => carId !== id)
    router.push(next.length ? `/compare?ids=${next.join(',')}` : '/compare')
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
        {ids.length < MAX_COMPARE && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPickerOpen((v) => !v)
              setQuery('')
            }}
          >
            {pickerOpen ? t('closePicker') : t('addCar')}
          </Button>
        )}
      </div>

      {visibleMissingIds.length > 0 && (
        <p className="mb-4 text-sm text-muted-foreground" role="status">
          {t('missingCars', { count: visibleMissingIds.length })}
        </p>
      )}

      {pickerOpen && ids.length < MAX_COMPARE && (
        <Card className="mb-6 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <SearchInput value={query} onValueChange={setQuery} label={t('searchLabel')} placeholder={t('searchPlaceholder')} className="w-full" />
            {pickerLoading && <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden="true" />}
          </div>
          <CardContent className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto p-0 pr-1 sm:grid-cols-4">
            {available.map((car) => (
              <button
                key={car.id}
                type="button"
                onClick={() => addCar(car.id)}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-background p-2 text-left transition hover:border-primary hover:bg-muted"
              >
                <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded bg-muted">
                  <CarImage src={car.image} alt="" sizes="64px" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {car.brand} {car.model}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{car.subModel ?? '—'}</p>
                  <PowertrainBadge powertrain={car.powerTrain as Powertrain} />
                </div>
              </button>
            ))}
            {!pickerLoading && available.length === 0 && (
              <p className="col-span-full py-3 text-center text-sm text-muted-foreground">{query.trim() ? t('noMatch') : t('allCompared')}</p>
            )}
          </CardContent>
        </Card>
      )}

      {showLoading && (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
          <span>{t('loading')}</span>
        </div>
      )}

      {showError && (
        <Card className="p-16 text-center">
          <p className="text-muted-foreground">{t('error')}</p>
        </Card>
      )}

      {!showLoading && !showError && visibleCompared.length === 0 && !pickerOpen && (
        <Card className="p-16 text-center">
          <p className="text-muted-foreground">{t('noCars')}</p>
          <Button type="button" onClick={() => setPickerOpen(true)} className="mt-4">
            {t('addCarsToCompare')}
          </Button>
        </Card>
      )}

      {visibleCompared.length > 0 && (
        <>
          <div className="hidden md:block">
            <Card className="overflow-x-auto p-0 shadow-md">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="w-40 p-4 font-medium text-muted-foreground">{t('specification')}</TableHead>
                    {visibleCompared.map((car) => (
                      <TableHead key={car.id} className="p-4 text-left align-top">
                        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                          <CarImage src={car.image} alt={`${car.brand} ${car.model}`} sizes="320px" className="object-contain" />
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <Link href={`/car/${car.name}`} className="cursor-pointer font-semibold text-foreground hover:text-primary">
                            {car.brand} {car.model}
                          </Link>
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => removeCar(car.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            {tCommon('remove')}
                          </Button>
                        </div>
                        <PowertrainBadge powertrain={toPowertrain(car)} className="mt-1" />
                        <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">{formatPrice(car.price)}</p>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SPEC_ROWS.map((row) => {
                    const values = visibleCompared.map((c) => getSpecValue(c, row.key))
                    const same = values.every((v, _, arr) => v === arr[0])
                    const bestIdx = bestValueIndices(values, row.higherBetter)
                    return (
                      <TableRow key={row.key} className={same ? '' : 'bg-amber-50/60'}>
                        <TableCell className="p-4 font-medium text-foreground/80">{tSpec(row.labelKey)}</TableCell>
                        {visibleCompared.map((car, i) => {
                          const v = getSpecValue(car, row.key)
                          const isBest = !same && bestIdx.includes(i)
                          return (
                            <TableCell key={car.id} className="p-4 tabular-nums">
                              <WinnerIndicator show={isBest} />
                              <CompareValue value={v} unit={row.unit} isBest={isBest} />
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>

          <div className="space-y-4 md:hidden">
            {visibleCompared.map((car) => (
              <Card key={car.id} className="gap-0 overflow-hidden p-0 shadow-sm">
                <div className="relative aspect-[16/9] bg-muted">
                  <CarImage src={car.image} alt={`${car.brand} ${car.model}`} sizes="100vw" />
                  <div className="absolute left-3 top-3">
                    <PowertrainBadge powertrain={toPowertrain(car)} />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Link href={`/car/${car.name}`} className="cursor-pointer text-lg font-semibold text-foreground hover:text-primary">
                      {car.brand} {car.model}
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => removeCar(car.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      {tCommon('remove')}
                    </Button>
                  </div>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{formatPrice(car.price)}</p>
                  <dl className="mt-3 divide-y divide-border">
                    {SPEC_ROWS.map((row) => (
                      <SpecRow key={row.key} label={tSpec(row.labelKey)} value={getSpecValue(car, row.key)} unit={row.unit} />
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function toPowertrain(car: CompareCarDTO): Powertrain {
  return {
    type: car.powerTrain.type as Powertrain['type'],
    subType: car.powerTrain.subType as Powertrain['subType'],
  }
}

function bestValueIndices(values: Array<number | string | null>, higherBetter?: boolean): number[] {
  const numeric = values.map((v) => (typeof v === 'number' ? v : null))
  if (numeric.every((v) => v === null)) return []
  const valid = numeric.filter((v): v is number => v !== null)
  const target = higherBetter ? Math.max(...valid) : Math.min(...valid)
  return numeric.reduce<number[]>((acc, v, i) => (v === target ? [...acc, i] : acc), [])
}

function getSpecValue(car: CompareCarDTO, key: string): number | string | null {
  if (!car.spec) return null
  if (key === 'range') {
    return car.spec.range?.wltp ?? car.spec.range?.nedc ?? null
  }
  const value = car.spec[key as keyof typeof car.spec]
  if (typeof value === 'number' || typeof value === 'string') return value
  return null
}
