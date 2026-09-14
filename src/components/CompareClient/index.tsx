'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { cars } from '@/data/cars'
import type { Car } from '@/lib/types'
import { formatPrice } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import CarImage from '@/components/CarImage'
import PowertrainBadge from '@/components/PowertrainBadge'
import { CompareValue } from '@/components/compare/CompareValue'
import { WinnerIndicator } from '@/components/compare/WinnerIndicator'
import { SpecRow } from '@/components/compare/SpecRow'

const SPEC_ROWS: Array<{ key: string; label: string; unit?: string; higherBetter?: boolean }> = [
  { key: 'torque', label: 'Torque', unit: 'Nm', higherBetter: true },
  { key: 'range', label: 'Range', unit: 'km', higherBetter: true },
  { key: 'topSpeed', label: 'Top Speed', unit: 'km/h', higherBetter: true },
  { key: 'acceleration', label: '0-100 km/h', unit: 's' },
  { key: 'seats', label: 'Seats', higherBetter: true },
  { key: 'weight', label: 'Weight', unit: 'kg' },
  { key: 'drivetrain', label: 'Drivetrain' },
  { key: 'groundClearance', label: 'Ground Clearance', unit: 'mm', higherBetter: true },
  { key: 'trunkCapacity', label: 'Trunk Capacity', unit: 'L', higherBetter: true },
]

export default function CompareClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [query, setQuery] = useState('')

  const ids = useMemo(() => (searchParams.get('ids') ?? '').split(',').filter(Boolean).slice(0, 5), [searchParams])

  const compared: Car[] = useMemo(() => ids.map((id) => cars.find((c) => c.id === id)!).filter(Boolean), [ids])

  const available = cars.filter((c) => !ids.includes(c.id))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return available
    return available.filter((c) => `${c.brand} ${c.model}`.toLowerCase().includes(q))
  }, [available, query])

  function addCar(id: string) {
    if (compared.length >= 5) return
    if (compared.length === 4) setPickerOpen(false)
    router.push(`/compare?ids=${[...ids, id].join(',')}`)
  }

  function removeCar(idx: number) {
    const next = ids.filter((_, i) => i !== idx)
    router.push(next.length ? `/compare?ids=${next.join(',')}` : '/compare')
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Compare Cars</h1>
        {compared.length < 5 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPickerOpen((v) => !v)
              setQuery('')
            }}
          >
            {pickerOpen ? 'Close picker' : '+ Add car'}
          </Button>
        )}
      </div>

      {compared.length === 0 && !pickerOpen && (
        <Card className="p-16 text-center">
          <p className="text-muted-foreground">No cars selected for comparison.</p>
          <Button type="button" onClick={() => setPickerOpen(true)} className="mt-4">
            Add cars to compare
          </Button>
        </Card>
      )}

      {pickerOpen && compared.length < 5 && (
        <Card className="mb-6 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search car name..."
              aria-label="Search cars to compare"
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <CardContent className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto p-0 pr-1 sm:grid-cols-4">
            {filtered.map((car) => (
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
                  <PowertrainBadge powertrain={car.powertrain} />
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-full py-3 text-center text-sm text-muted-foreground">
                {available.length === 0 ? 'All cars are being compared.' : 'No cars match your search.'}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {compared.length > 0 && (
        <>
          <div className="hidden md:block">
            <Card className="overflow-x-auto p-0 shadow-md">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="w-40 p-4 font-medium text-muted-foreground">Specification</TableHead>
                    {compared.map((car, i) => (
                      <TableHead key={car.id} className="p-4 text-left align-top">
                        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                          <CarImage src={car.image} alt="" sizes="320px" className="object-contain" />
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <Link href={`/car/${car.id}`} className="cursor-pointer font-semibold text-foreground hover:text-primary">
                            {car.brand} {car.model}
                          </Link>
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => removeCar(i)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            Remove
                          </Button>
                        </div>
                        <PowertrainBadge powertrain={car.powertrain} className="mt-1" />
                        <p className="mt-1 text-sm font-semibold text-foreground tabular-nums">{formatPrice(car.price)}</p>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SPEC_ROWS.map((row) => {
                    const values = compared.map((c) => getSpecValue(c, row.key))
                    const same = values.every((v, _, arr) => v === arr[0])
                    const bestIdx = bestValueIndices(values, row.higherBetter)
                    return (
                      <TableRow key={row.key} className={same ? '' : 'bg-amber-50/60'}>
                        <TableCell className="p-4 font-medium text-foreground/80">{row.label}</TableCell>
                        {compared.map((car, i) => {
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
            {compared.map((car, i) => (
              <Card key={car.id} className="gap-0 overflow-hidden p-0 shadow-sm">
                <div className="relative aspect-[16/9] bg-muted">
                  <CarImage src={car.image} alt="" sizes="100vw" />
                  <div className="absolute left-3 top-3">
                    <PowertrainBadge powertrain={car.powertrain} />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Link href={`/car/${car.id}`} className="cursor-pointer text-lg font-semibold text-foreground hover:text-primary">
                      {car.brand} {car.model}
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => removeCar(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{formatPrice(car.price)}</p>
                  <dl className="mt-3 divide-y divide-border">
                    {SPEC_ROWS.map((row) => (
                      <SpecRow key={row.key} label={row.label} value={getSpecValue(car, row.key)} unit={row.unit} />
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

function bestValueIndices(values: Array<number | string | null>, higherBetter?: boolean): number[] {
  const numeric = values.map((v) => (typeof v === 'number' ? v : null))
  if (numeric.every((v) => v === null)) return []
  const valid = numeric.filter((v): v is number => v !== null)
  const target = higherBetter ? Math.max(...valid) : Math.min(...valid)
  return numeric.reduce<number[]>((acc, v, i) => (v === target ? [...acc, i] : acc), [])
}

function getSpecValue(car: Car, key: string): number | string | null {
  const specs = car.specs as unknown as Record<string, unknown>
  const v = specs[key]
  if (key === 'acceleration' && typeof v === 'object' && v !== null && 'zeroToHundred' in v) return (v as { zeroToHundred: number }).zeroToHundred
  if (key === 'range' && typeof v === 'object' && v !== null) {
    const range = v as { wltp?: number; nedc?: number }
    if (range.wltp != null) return range.wltp
    if (range.nedc != null) return range.nedc
    return null
  }
  if (typeof v === 'number' || typeof v === 'string') return v
  return null
}
