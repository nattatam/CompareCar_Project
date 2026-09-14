import Link from 'next/link'
import type { Car } from '@/lib/types'
import { formatPrice } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Zap, Gauge, Timer, Route, Fuel, Users, Settings, Battery, Cog, LifeBuoy } from 'lucide-react'
import CarImage from '../CarImage'
import ImageCredit from '../ImageCredit'
import PowertrainBadge from '../PowertrainBadge'
import { CompareCheckbox } from '@/components/CompareCheckbox'
import { CategoryIcon } from '@/components/icons/carIcons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface CarCardProps {
  car: Car
  selected: boolean
  onToggle?: (id: string) => void
}

export default function CarCard({ car, selected, onToggle }: CarCardProps) {
  return (
    <Card
      className={cn(
        'group relative flex flex-col gap-0 overflow-hidden p-0 shadow-sm transition hover:shadow-lg',
        selected ? 'border-primary shadow-lg shadow-primary/30 ring-primary/40 hover:shadow-primary/40' : 'hover:shadow-primary/10'
      )}
    >
      <ImageCredit image={car.image} />
      <Link href={`/car/${car.id}`} className="block w-full shrink-0 bg-muted relative">
        <div className="relative aspect-[16/10] w-full">
          <CarImage src={car.image} alt={`${car.brand} ${car.model}`} sizes="(min-width:768px) 33vw, 100vw" priority />
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-0 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{car.brand}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="truncate text-base font-semibold text-foreground">
                  {car.model}
                  {car.subModel && <span className="text-sm font-normal text-muted-foreground"> {car.subModel}</span>}
                </h3>
              </TooltipTrigger>
              <TooltipContent>
                {car.model}
                {car.subModel ? ` ${car.subModel}` : ''}
              </TooltipContent>
            </Tooltip>
            <p className="mt-0.5 text-sm font-normal text-muted-foreground/70">{car.year}</p>
            <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <PowertrainBadge powertrain={car.powertrain} />
              <Badge variant="outline" className="rounded-full bg-muted font-semibold text-muted-foreground">
                <span className="flex shrink-0 items-center">
                  <CategoryIcon category={car.category} className="size-7" />
                </span>
                {car.category}
              </Badge>
            </span>
          </div>
          <p className="shrink-0 text-right text-sm font-semibold text-foreground tabular-nums">{formatPrice(car.price)}</p>
        </div>

        <div className="mt-3 mb-3 grid grid-cols-2 gap-1.5 rounded-lg bg-muted/50 p-2">
          {/* Row 1: Power & Torque */}
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            <Zap className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">Power</p>
              <p className="text-xs font-semibold text-foreground tabular-nums">
                {'horsepower' in car.specs ? car.specs.horsepower : Math.round(car.specs.powerKw * 1.341)} hp
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            <Cog className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">Torque</p>
              <p className="text-xs font-semibold text-foreground tabular-nums">{car.specs.torque} Nm</p>
            </div>
          </div>

          {/* Row 2: 0-100 & Drivetrain */}
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            <Timer className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">0-100 km/h</p>
              <p className="text-xs font-semibold text-foreground tabular-nums">
                {car.specs.acceleration.zeroToHundred != null ? `${car.specs.acceleration.zeroToHundred}s` : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            <LifeBuoy className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">Drive</p>
              <p className="text-xs font-semibold text-foreground">{car.specs.drivetrain}</p>
            </div>
          </div>

          {/* Row 3: Range/Fuel & Seats */}
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            {'range' in car.specs ? <Route className="size-3.5 shrink-0 text-primary" /> : <Fuel className="size-3.5 shrink-0 text-primary" />}
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">{'range' in car.specs ? 'Range' : 'Economy'}</p>
              {'range' in car.specs ? (
                car.specs.range.nedc != null && car.specs.range.wltp != null ? (
                  <>
                    <p className="text-xs font-semibold text-foreground tabular-nums">{car.specs.range.nedc} km NEDC</p>
                    <p className="text-[10px] leading-tight text-muted-foreground tabular-nums">{car.specs.range.wltp} km WLTP</p>
                  </>
                ) : car.specs.range.nedc != null ? (
                  <p className="text-xs font-semibold text-foreground tabular-nums">{car.specs.range.nedc} km NEDC</p>
                ) : car.specs.range.wltp != null ? (
                  <p className="text-xs font-semibold text-foreground tabular-nums">{car.specs.range.wltp} km WLTP</p>
                ) : (
                  <p className="text-xs font-semibold text-foreground tabular-nums">N/A</p>
                )
              ) : 'fuelEconomy' in car.specs && car.specs.fuelEconomy ? (
                <p className="text-xs font-semibold text-foreground tabular-nums">{car.specs.fuelEconomy} km/L</p>
              ) : (
                <p className="text-xs font-semibold text-foreground tabular-nums">N/A</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            <Users className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">Seats</p>
              <p className="text-xs font-semibold text-foreground">{car.specs.seats}</p>
            </div>
          </div>

          {/* Row 4: Transmission/Battery & Top Speed */}
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            {'battery' in car.specs ? (
              <Battery className="size-3.5 shrink-0 text-primary" />
            ) : (
              <Settings className="size-3.5 shrink-0 text-primary" />
            )}
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">{'battery' in car.specs ? 'Battery' : 'Gearbox'}</p>
              <p className="text-xs font-semibold text-foreground truncate">
                {'battery' in car.specs ? `${car.specs.battery.capacity} kWh` : 'transmission' in car.specs ? car.specs.transmission : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
            <Gauge className="size-3.5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-[10px] leading-tight text-muted-foreground">Top Speed</p>
              <p className="text-xs font-semibold text-foreground tabular-nums">{car.specs.topSpeed ? `${car.specs.topSpeed} km/h` : 'N/A'}</p>
            </div>
          </div>
        </div>

        <CompareCheckbox selected={selected} onToggle={() => onToggle?.(car.id)} />
      </CardContent>
    </Card>
  )
}
