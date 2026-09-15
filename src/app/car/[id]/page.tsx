import Link from "next/link";
import { notFound } from "next/navigation";
import { cars } from "@/data/cars";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { formatPrice, badgeLabel } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CarImage from "@/components/CarImage";
import ImageCredit from "@/components/ImageCredit";
import PowertrainBadge from "@/components/PowertrainBadge";
import { SpecRadar } from "@/components/car/SpecRadar";
import { BarChartCard } from "@/components/car/BarChartCard";
import FeatureSections from "@/components/car/FeatureSections";
import { CAR_FEATURES } from "@/data/features";
import { CategoryIcon } from "@/components/icons/carIcons";
import {
  absoluteUrl,
  carBreadcrumbJsonLd,
  carDescription,
  carOgImage,
  carPageTitle,
  carProductJsonLd,
  carDisplayName,
} from "@/lib/site";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = cars.find((c) => c.id === id);
  if (!car)
    return {
      title: "Car not found",
    };
  return {
    title: carPageTitle(car),
    description: carDescription(car),
    alternates: {
      canonical: `/car/${car.id}`,
    },
    openGraph: {
      type: "website",
      siteName: "CompareCar",
      title: carPageTitle(car),
      description: carDescription(car),
      url: absoluteUrl(`/car/${car.id}`),
      images: [{ url: carOgImage(car), alt: carDisplayName(car) }],
    },
    twitter: {
      card: "summary_large_image",
      title: carPageTitle(car),
      description: carDescription(car),
      images: [carOgImage(car)],
    },
    keywords: [
      car.brand,
      `${car.brand} ${car.model}`,
      `${car.brand} ${car.model} price`,
      `${car.brand} ${car.model} specifications`,
      car.category,
      badgeLabel(car.powertrain),
    ],
  };
}

export function generateStaticParams() {
  return cars.map((c) => ({ id: c.id }));
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;
  const car = cars.find((c) => c.id === id);
  if (!car) notFound();

  const t = await getTranslations('Detail');
  const tSpec = await getTranslations('CarSpec');
  const tPowertrain = await getTranslations('Powertrain');

  const features = CAR_FEATURES[id];
  const intelligentAssist =
    car.specs.intelligentAssist ?? features?.intelligentAssist;
  const security = car.specs.security ?? features?.security;

  const specRows: Array<{ label: string; value: string }> = [];

  const jsonLdProduct = carProductJsonLd(car);
  const jsonLdBreadcrumb = carBreadcrumbJsonLd(car);

  if ("horsepower" in car.specs) {
    const ice = car.specs;
    specRows.push({ label: tSpec('horsepower'), value: `${ice.horsepower} hp` });
    specRows.push({ label: tSpec('torque'), value: `${ice.torque} Nm` });
    if (ice.topSpeed != null)
      specRows.push({ label: tSpec('topSpeed'), value: `${ice.topSpeed} km/h` });
    if (ice.acceleration.zeroToHundred != null)
      specRows.push({ label: tSpec('acceleration'), value: `${ice.acceleration.zeroToHundred} s` });
    if (ice.fuelEconomy != null)
      specRows.push({ label: tSpec('fuelEconomy'), value: `${ice.fuelEconomy} L/100km` });
    specRows.push({ label: tSpec('transmission'), value: ice.transmission });
    specRows.push({ label: tSpec('engine'), value: ice.engine });
    specRows.push({ label: tSpec('seats'), value: `${ice.seats}` });
    if (ice.weight != null)
      specRows.push({ label: tSpec('weight'), value: `${ice.weight} kg` });
    specRows.push({ label: tSpec('drivetrain'), value: ice.drivetrain });
  } else {
    const ev = car.specs;
    specRows.push({ label: tSpec('power'), value: `${ev.powerKw} kW` });
    specRows.push({ label: tSpec('torque'), value: `${ev.torque} Nm` });
    if (ev.topSpeed != null)
      specRows.push({ label: tSpec('topSpeed'), value: `${ev.topSpeed} km/h` });
    if (ev.acceleration.zeroToHundred != null)
      specRows.push({ label: tSpec('acceleration'), value: `${ev.acceleration.zeroToHundred} s` });
    if (ev.range.wltp != null)
      specRows.push({ label: tSpec('rangeWLTP'), value: `${ev.range.wltp} km` });
    if (ev.range.nedc != null)
      specRows.push({ label: tSpec('rangeNEDC'), value: `${ev.range.nedc} km` });
    specRows.push({
      label: tSpec('battery'),
      value: `${ev.battery.capacity} kWh (${ev.battery.type})`,
    });
    specRows.push({ label: tSpec('motor'), value: ev.motorType });
    specRows.push({ label: tSpec('seats'), value: `${ev.seats}` });
    if (ev.weight != null)
      specRows.push({ label: tSpec('weight'), value: `${ev.weight} kg` });
    specRows.push({ label: tSpec('drivetrain'), value: ev.drivetrain });
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdProduct).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdBreadcrumb).replace(/</g, "\\u003c"),
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
            <CarImage
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              sizes="(min-width:1024px) 40vw, 100vw"
              priority
            />
            <ImageCredit image={car.image} className="absolute right-3 top-3" />
            <div className="absolute left-3 top-3 flex gap-2">
              <PowertrainBadge powertrain={car.powertrain} />
            </div>
          </div>

          <Card className="mt-4 p-5 shadow-md">
            <CardContent className="p-0">
              <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>{car.brand}</span>
                <span aria-hidden="true">•</span>
                <CategoryIcon category={car.category} className="size-7" />
                <span>{car.category}</span>
              </p>
              <h1 className="mt-1 text-2xl font-bold text-foreground">
                {car.model}{" "}
                <span className="font-normal text-muted-foreground/70">{car.year}</span>
              </h1>
              <p className="mt-2 text-xl font-semibold text-foreground tabular-nums">
                {formatPrice(car.price)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t('powertrain')}: {powertrainDescription(car, tPowertrain)}
              </p>
              {car.officialUrl && (
                <Button
                  asChild
                  variant="outline"
                  className="mt-4 w-full cursor-pointer"
                >
                  <a
                    href={car.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {t('specifications')}
              </h2>
              <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between border-b border-border pb-2"
                  >
                    <dt className="text-sm text-muted-foreground">{row.label}</dt>
                    <dd className="text-sm font-medium text-foreground tabular-nums">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <FeatureSections
            intelligentAssist={intelligentAssist}
            security={security}
          />

          <Card className="mt-6 p-5 shadow-md">
            <CardContent className="p-0">
              <h2 className="mb-2 text-lg font-semibold text-foreground">
                {t('performanceVsCategory')}
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                {t('radarDescription')}
              </p>
              <SpecRadar car={car} />
            </CardContent>
          </Card>

          <Card className="mt-6 p-5 shadow-md">
            <CardContent className="p-0">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                {t('specsVsAverage', { category: car.category })}
              </h2>
              <BarChartCard car={car} />
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}

function powertrainDescription(car: (typeof cars)[number], t: Awaited<ReturnType<typeof getTranslations>>) {
  if (car.powertrain.type === "ICE") return t('ICE');
  if (car.powertrain.type === "EV") return t('EV');
  switch (car.powertrain.subtype) {
    case "MHEV":
      return t('MHEV');
    case "PHEV":
      return t('PHEV');
    case "REEV/EREV":
      return t('REEV');
    default:
      return t('HEV');
  }
}
