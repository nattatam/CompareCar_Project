import Link from 'next/link'
import { useTranslations } from 'next-intl'
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
import type { CarListItemDTO } from '@/lib/dto/car'
import { getCarAltText, getCarDisplayName } from '@/lib/car-i18n'

type CarCardProps = {
  car: CarListItemDTO
  selected?: boolean
  onToggle?: (id: string) => void
}

export default function CarCard({ car, selected = false, onToggle }: CarCardProps) {
  const t = useTranslations('CarCard')
  const tCars = useTranslations('Cars')
  const spec = car.spec
  const displayName = getCarDisplayName(car, tCars)
  const altText = getCarAltText(car, tCars)

  return (
    <Card
      className={cn(
        'group relative flex flex-col gap-0 overflow-hidden p-0 shadow-sm transition hover:shadow-lg',
        selected ? 'border-primary shadow-lg shadow-primary/30 ring-primary/40 hover:shadow-primary/40' : 'hover:shadow-primary/10'
      )}
    >
      <ImageCredit credit={car.credit} />
      <Link href={`/car/${car.name}`} className="block w-full shrink-0 bg-muted relative">
        <div className="relative aspect-[16/10] w-full">
          <CarImage src={car.image} alt={altText} sizes="(min-width:768px) 33vw, 100vw" priority />
        </div>
      </Link>

      <CardContent className="flex flex-1 flex-col gap-0 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{car.brand}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className="truncate text-base font-semibold text-foreground">{displayName}</h3>
              </TooltipTrigger>
              <TooltipContent>{displayName}</TooltipContent>
            </Tooltip>
            <p className="mt-0.5 text-sm font-normal text-muted-foreground/70">{car.year}</p>
            <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <PowertrainBadge powertrain={car.powerTrain as any} />
              <Badge variant="outline" className="rounded-full bg-muted font-semibold text-muted-foreground">
                <span className="flex shrink-0 items-center">
                  <CategoryIcon category={car.category as any} className="size-7" />
                </span>
                {car.category}
              </Badge>
            </span>
          </div>
          <p className="shrink-0 text-right text-sm font-semibold text-foreground tabular-nums">{formatPrice(car.price)}</p>
        </div>

        {spec && (
          <div className="mt-3 mb-3 grid grid-cols-2 gap-1.5 rounded-lg bg-muted/50 p-2">
            {/* Row 1: Power & Torque */}
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              <Zap className="size-3.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{t('power')}</p>
                <p className="text-xs font-semibold text-foreground tabular-nums">
                  {spec.powerKw !== undefined ? Math.round(spec.powerKw * 1.341) : 'N/A'} hp
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              <Cog className="size-3.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{t('torque')}</p>
                <p className="text-xs font-semibold text-foreground tabular-nums">{spec.torque !== undefined ? `${spec.torque} Nm` : 'N/A'}</p>
              </div>
            </div>

            {/* Row 2: 0-100 & Drivetrain */}
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              <Timer className="size-3.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{t('acceleration')}</p>
                <p className="text-xs font-semibold text-foreground tabular-nums">
                  {spec.acceleration !== undefined && spec.acceleration !== null ? `${spec.acceleration}s` : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              <LifeBuoy className="size-3.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{t('drive')}</p>
                <p className="text-xs font-semibold text-foreground">{spec.drivetrain || 'N/A'}</p>
              </div>
            </div>

            {/* Row 3: Range/Fuel & Seats */}
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              {spec.range ? <Route className="size-3.5 shrink-0 text-primary" /> : <Fuel className="size-3.5 shrink-0 text-primary" />}
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{spec.range ? t('range') : t('economy')}</p>
                {spec.range ? (
                  spec.range.nedc != null && spec.range.wltp != null ? (
                    <>
                      <p className="text-xs font-semibold text-foreground tabular-nums">{spec.range.nedc} km NEDC</p>
                      <p className="text-[10px] leading-tight text-muted-foreground tabular-nums">{spec.range.wltp} km WLTP</p>
                    </>
                  ) : spec.range.nedc != null ? (
                    <p className="text-xs font-semibold text-foreground tabular-nums">{spec.range.nedc} km NEDC</p>
                  ) : spec.range.wltp != null ? (
                    <p className="text-xs font-semibold text-foreground tabular-nums">{spec.range.wltp} km WLTP</p>
                  ) : (
                    <p className="text-xs font-semibold text-foreground tabular-nums">N/A</p>
                  )
                ) : (
                  <p className="text-xs font-semibold text-foreground tabular-nums">N/A</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              <Users className="size-3.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{t('seats')}</p>
                <p className="text-xs font-semibold text-foreground">{spec.seats ?? 'N/A'}</p>
              </div>
            </div>

            {/* Row 4: Transmission/Battery & Top Speed */}
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              {spec.battery ? <Battery className="size-3.5 shrink-0 text-primary" /> : <Settings className="size-3.5 shrink-0 text-primary" />}
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{spec.battery ? t('battery') : t('gearbox')}</p>
                <p className="text-xs font-semibold text-foreground truncate">{spec.battery ? `${spec.battery.capacity} kWh` : 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-card p-1.5">
              <Gauge className="size-3.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-[10px] leading-tight text-muted-foreground">{t('topSpeed')}</p>
                <p className="text-xs font-semibold text-foreground tabular-nums">{spec.topSpeed ? `${spec.topSpeed} km/h` : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        <CompareCheckbox selected={selected} onToggle={() => onToggle?.(car.id)} />
      </CardContent>
    </Card>
  )
}
