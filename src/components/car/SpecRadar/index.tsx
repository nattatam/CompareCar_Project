'use client'

import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { useTranslations } from 'next-intl'
import type { Car } from '@/lib/types'

const ACCENT = '#2563eb'
const MUTED = '#a1a1aa'

type NumericKey = 'power' | 'torque' | 'topSpeed' | 'acceleration' | 'weight' | 'seats'

export function getValue(car: Car, key: NumericKey): number {
  switch (key) {
    case 'power':
      return 'horsepower' in car.specs
        ? (car.specs.horsepower ?? 0)
        : Math.round((car.specs.powerKw ?? 0) * 1.341)
    case 'torque':
      return car.specs.torque ?? 0
    case 'topSpeed':
      return car.specs.topSpeed ?? 0
    case 'acceleration':
      return typeof car.specs.acceleration === 'number' ? car.specs.acceleration : 0
    case 'weight':
      return car.specs.weight ?? 0
    case 'seats':
      return car.specs.seats ?? 0
  }
}

interface SpecRadarProps {
  car: Car
  catalog?: Car[]
}

export function SpecRadar({ car, catalog }: SpecRadarProps) {
  const t = useTranslations('CarCard')
  const metrics: Array<{ key: NumericKey; label: string; invert?: boolean }> = [
    { key: 'power', label: t('power') },
    { key: 'torque', label: t('torque') },
    { key: 'acceleration', label: t('acceleration'), invert: true },
    { key: 'topSpeed', label: t('topSpeed') },
  ]

  const allCars = catalog && catalog.length > 0 ? catalog : [car]
  const categoryCars = allCars.filter((c) => c.category === car.category)
  const peers = categoryCars.length > 0 ? categoryCars : allCars
  const averages = metrics.map((m) => {
    const values = peers.map((c) => getValue(c, m.key))
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return { avg, value: getValue(car, m.key) }
  })

  const maxFor = metrics.map((m) => {
    const vals = allCars.map((c) => getValue(c, m.key))
    return Math.max(...vals) * 1.1 || 1
  })

  const data = metrics.map((m, i) => ({
    label: m.label,
    carPct: (getValue(car, m.key) / maxFor[i]) * 100,
    avgPct: (averages[i].avg / maxFor[i]) * 100,
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e4e4e7" />
          <PolarAngleAxis dataKey="label" tick={{ fill: MUTED, fontSize: 12 }} />
          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
          <Radar name="Average" dataKey="avgPct" stroke={MUTED} fill={MUTED} fillOpacity={0.15} />
          <Radar name={car.model} dataKey="carPct" stroke={ACCENT} fill={ACCENT} fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}