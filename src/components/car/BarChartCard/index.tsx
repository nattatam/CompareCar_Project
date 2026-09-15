'use client'

import {
  ResponsiveContainer,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { useTranslations } from 'next-intl'
import { cars } from '@/data/cars'
import type { Car } from '@/lib/types'
import { getValue } from '@/components/car/SpecRadar'

const ACCENT = '#2563eb'
const MUTED = '#a1a1aa'

interface BarChartCardProps {
  car: Car
}

export function BarChartCard({ car }: BarChartCardProps) {
  const t = useTranslations('CarCard')
  const categoryCars = cars.filter((c) => c.category === car.category)

  function avgForKey(key: Parameters<typeof getValue>[1]): number {
    return Math.round((categoryCars.reduce((a, c) => a + getValue(c, key), 0) / categoryCars.length) * 10) / 10
  }

  const items = [
    {
      label: t('power'),
      value: getValue(car, 'power'),
      avg: avgForKey('power'),
      unit: 'hp',
    },
    {
      label: t('torque'),
      value: getValue(car, 'torque'),
      avg: avgForKey('torque'),
      unit: 'Nm',
    },
    {
      label: t('topSpeed'),
      value: getValue(car, 'topSpeed'),
      avg: avgForKey('topSpeed'),
      unit: 'km/h',
    },
  ]

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items}>
          <CartesianGrid stroke="#f0f0f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 12 }} axisLine={{ stroke: '#e4e4e7' }} tickLine={false} />
          <YAxis tick={{ fill: MUTED, fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value, name) => [`${value}`, name]} contentStyle={{ borderRadius: 8, border: '1px solid #e4e4e7' }} />
          <Bar name={`${car.brand} ${car.model}`} dataKey="value" fill={ACCENT} radius={[4, 4, 0, 0]} />
          <Bar name={`${car.category} avg`} dataKey="avg" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}