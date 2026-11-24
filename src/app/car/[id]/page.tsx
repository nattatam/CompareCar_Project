import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { formatPrice, badgeLabel } from '@/lib/types'
import type { Powertrain } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CarImage from '@/components/CarImage'
import ImageCredit from '@/components/ImageCredit'
import PowertrainBadge from '@/components/PowertrainBadge'
import { SpecRadar } from '@/components/car/SpecRadar'
import { BarChartCard } from '@/components/car/BarChartCard'
import FeatureSections from '@/components/car/FeatureSections'
import { CAR_FEATURES } from '@/data/features'
import { CategoryIcon } from '@/components/icons/carIcons'
import { absoluteUrl, carBreadcrumbJsonLd, carDescription, carOgImage, carPageTitle, carProductJsonLd, carDisplayName } from '@/lib/site'
import { getCarDisplayName, localizeCar } from '@/lib/car-i18n'
import { getCarByName } from '@/lib/services/car-detail'
import type { CarDetail } from '@/lib/services/car-detail'
import { getCars } from '@/lib/services/car'
import { getImageCreditByImage } from '@/lib/services/image-credit'
import { toCarDetailView } from '@/lib/mappers/car-detail'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const dbCar = await getCarByName(id)
  if (!dbCar)
    return {
      title: 'Car not found',
    }
  const car = toCarDetailView(dbCar, id)
  const tCars = await getTranslations('Cars')
  const displayCar = localizeCar(car, tCars)
  return {
    title: carPageTitle(displayCar),
    description: carDescription(displayCar),
    alternates: {
      canonical: `/car/${car.id}`,
    },
    openGraph: {
      type: 'website',
      siteName: 'CompareCar',
      title: carPageTitle(displayCar),
      description: carDescription(displayCar),
      url: absoluteUrl(`/car/${car.id}`),
      images: [{ url: carOgImage(displayCar), alt: carDisplayName(displayCar) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: carPageTitle(displayCar),
      description: carDescription(displayCar),
      images: [carOgImage(displayCar)],
    },
    keywords: [
      displayCar.brand,
      `${displayCar.brand} ${displayCar.model}`,
      `${displayCar.brand} ${displayCar.model} price`,
      `${displayCar.brand} ${displayCar.model} specifications`,
      displayCar.category,
      badgeLabel(displayCar.powertrain),
    ],
  }
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params
  const dbCar = await getCarByName(id)
  if (!dbCar) notFound()

  const car = toCarDetailView(dbCar, id)
  const credit = await getImageCreditByImage(car.image)
  const tCars = await getTranslations('Cars')
  const displayCar = localizeCar(car, tCars)

  const t = await getTranslations('Detail')
  const tSpec = await getTranslations('CarSpec')
  const tPowertrain = await getTranslations('Powertrain')

  const features = CAR_FEATURES[id]
  const intelligentAssist = car.specs.intelligentAssist ?? features?.intelligentAssist
  const security = car.specs.security ?? features?.security

  const { data: catalogEntries } = await getCars(1, 500)
  const catalog = catalogEntries.map((entry) => toCarDetailView(entry, entry.name))

  const specRows = buildSpecRows(dbCar, tSpec)

  const jsonLdProduct = carProductJsonLd(displayCar)
  const jsonLdBreadcrumb = carBreadcrumbJsonLd(displayCar)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdProduct).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdBreadcrumb).replace(/</g, '\\u003c'),
        }}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft />
            {t('backToCatalog')}
          </Link>
        </Button>

        <div className="mt-4 grid gap-8 lg:grid-cols-5">
          {/* Left: image + summary */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
              <CarImage src={car.image} alt={`${displayCar.brand} ${getCarDisplayName(displayCar, tCars)}`} sizes="(min-width:1024px) 40vw, 100vw" priority />
              <ImageCredit credit={credit} className="absolute right-3 top-3" />
              <div className="absolute left-3 top-3 flex gap-2">
                <PowertrainBadge powertrain={car.powertrain} />
              </div>
            </div>

            <Card className="mt-4 p-5 shadow-md">
              <CardContent className="p-0">
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>{textValue(displayCar.brand)}</span>
                  <span aria-hidden="true">•</span>
                  <CategoryIcon category={car.category} className="size-7" />
                  <span>{textValue(car.category)}</span>
                </p>
                <h1 className="mt-1 text-2xl font-bold text-foreground">
                  {textValue(displayCar.model)}{' '}
                  <span className="font-normal text-muted-foreground">{textValue(displayCar.subModel)}</span>{' '}
                  <span className="font-normal text-muted-foreground/70">{car.year}</span>
                </h1>
                <p className="mt-2 text-xl font-semibold text-foreground tabular-nums">{formatPrice(car.price)}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('powertrain')}: {powertrainDescription(car, tPowertrain)}
                </p>
                {car.officialUrl && (
                  <Button asChild variant="outline" className="mt-4 w-full cursor-pointer">
                    <a href={car.officialUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4" aria-hidden="true" />
                      {t('officialWebsite')}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: specs + charts */}
          <div className="lg:col-span-3">
            <Card className="p-5 shadow-md">
              <CardContent className="p-0">
                <h2 className="mb-4 text-lg font-semibold text-foreground">{t('specifications')}</h2>
                <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {specRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between border-b border-border pb-2">
                      <dt className="text-sm text-muted-foreground">{row.label}</dt>
                      <dd className="text-sm font-medium text-foreground tabular-nums">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <FeatureSections intelligentAssist={intelligentAssist} security={security} />

            <Card className="mt-6 p-5 shadow-md">
              <CardContent className="p-0">
                <h2 className="mb-2 text-lg font-semibold text-foreground">{t('performanceVsCategory')}</h2>
                <p className="mb-4 text-xs text-muted-foreground">{t('radarDescription')}</p>
                <SpecRadar car={car} catalog={catalog} />
              </CardContent>
            </Card>

            <Card className="mt-6 p-5 shadow-md">
              <CardContent className="p-0">
                <h2 className="mb-4 text-lg font-semibold text-foreground">{t('specsVsAverage', { category: textValue(car.category) })}</h2>
                <BarChartCard car={car} catalog={catalog} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

function toNumber(value: { toString(): string } | number | null | undefined): number | undefined {
  if (value == null) return undefined
  const parsed = typeof value === 'number' ? value : Number(value.toString())
  return Number.isFinite(parsed) ? parsed : undefined
}

function formatValue(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

function numberValue(value: { toString(): string } | number | null | undefined): string {
  return formatValue(toNumber(value) ?? 0)
}

function textValue(value?: string | null): string {
  if (value == null) return '-'
  const trimmed = value.trim()
  if (trimmed === '' || trimmed === 'UNKNOWN') return '-'
  return trimmed
}

function buildSpecRows(car: CarDetail, t: Awaited<ReturnType<typeof getTranslations>>) {
  const rows: Array<{ label: string; value: string }> = []
  const spec = car.spec
  const powerKw = toNumber(spec?.powerKw) ?? 0

  rows.push({
    label: t('power'),
    value: `${formatValue(Math.round(powerKw * 1.341))} hp (${formatValue(powerKw)} kW)`,
  })
  rows.push({ label: t('torque'), value: `${numberValue(spec?.torque)} Nm` })
  rows.push({ label: t('topSpeed'), value: `${numberValue(spec?.topSpeed)} km/h` })
  rows.push({ label: t('acceleration'), value: `${numberValue(spec?.acceleration)} s` })
  rows.push({ label: t('drivetrain'), value: textValue(spec?.drivetrain) })
  rows.push({ label: t('seats'), value: `${spec?.seats ?? 0}` })
  rows.push({ label: t('weight'), value: `${numberValue(spec?.weight)} kg` })

  rows.push({ label: t('rangeWLTP'), value: `${numberValue(spec?.range?.wltp)} km` })
  rows.push({ label: t('rangeNEDC'), value: `${numberValue(spec?.range?.nedc)} km` })
  rows.push({ label: t('rangeEPA'), value: `${numberValue(spec?.range?.epa)} km` })
  rows.push({ label: t('rangeCLTC'), value: `${numberValue(spec?.range?.cltc)} km` })

  rows.push({
    label: t('battery'),
    value: `${numberValue(spec?.battery.capacity)} kWh (${textValue(spec?.battery.type)})`,
  })
  rows.push({
    label: t('motor'),
    value: textValue(spec?.motorType ? spec.motorType.replaceAll('_', ' ') : null),
  })
  rows.push({ label: t('chargingAC'), value: `${numberValue(spec?.charge?.ac)} kW` })
  rows.push({ label: t('chargingDC'), value: `${numberValue(spec?.charge?.dc)} kW` })
  rows.push({ label: t('chargingTime'), value: `${numberValue(spec?.charge?.time)} min` })
  rows.push({
    label: t('driveModes'),
    value: spec?.driveModes?.length ? spec.driveModes.join(', ') : '-',
  })

  rows.push({ label: t('length'), value: `${numberValue(spec?.dimensionCar.length)} mm` })
  rows.push({ label: t('width'), value: `${numberValue(spec?.dimensionCar.width)} mm` })
  rows.push({ label: t('height'), value: `${numberValue(spec?.dimensionCar.height)} mm` })
  rows.push({ label: t('wheelbase'), value: `${numberValue(spec?.dimensionCar.wheelbase)} mm` })
  rows.push({ label: t('groundClearance'), value: `${numberValue(spec?.groundClearance)} mm` })
  rows.push({ label: t('turningRadius'), value: `${numberValue(spec?.turningRadius)} m` })
  rows.push({ label: t('trunkCapacity'), value: `${numberValue(spec?.trunkCapacity)} L` })
  rows.push({ label: t('trunkCapacityMax'), value: `${numberValue(spec?.trunkCapacityMax)} L` })

  return rows
}

function powertrainDescription(car: { powertrain: Powertrain }, t: Awaited<ReturnType<typeof getTranslations>>) {
  if (!car.powertrain) return '-'
  if (car.powertrain.type === 'ICE') return t('ICE')
  if (car.powertrain.type === 'EV') return t('EV')
  switch (car.powertrain.subType) {
    case 'MHEV':
      return t('MHEV')
    case 'PHEV':
      return t('PHEV')
    case 'REEV/EREV':
      return t('REEV')
    case 'HEV':
      return t('HEV')
    default:
      return '-'
  }
}
