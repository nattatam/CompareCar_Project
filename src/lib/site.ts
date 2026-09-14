import type { Car } from "@/lib/types";
import { badgeLabel, formatPrice } from "@/lib/types";

export const SITE_NAME = "CompareCar";

export const SITE_DESCRIPTION =
  "Compare car specifications side-by-side across ICE, hybrid, and electric (EV) powertrains. Browse prices, performance, range, and features from Thailand's car market.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function carDisplayName(car: Car): string {
  return `${car.brand} ${car.model}${car.subModel ? ` ${car.subModel}` : ""}`;
}

export function carPageTitle(car: Car): string {
  return `${carDisplayName(car)} ${car.year} Specs & Price`;
}

export function carDescription(car: Car): string {
  const specs = car.specs;

  const power =
    "horsepower" in specs
      ? `${specs.horsepower} hp`
      : `${specs.powerKw} kW`;

  const energy =
    "range" in specs
      ? specs.range.wltp != null
        ? `range ${specs.range.wltp} km`
        : specs.range.nedc != null
          ? `range ${specs.range.nedc} km`
          : null
      : specs.fuelEconomy != null
        ? `economy ${specs.fuelEconomy} km/L`
        : null;

  const performance =
    specs.acceleration.zeroToHundred != null
      ? `0-100 in ${specs.acceleration.zeroToHundred} s`
      : null;

  const details = [
    `${carDisplayName(car)} ${car.year}:`,
    formatPrice(car.price),
    badgeLabel(car.powertrain),
    power,
    performance,
    energy,
    `${specs.seats} seats`,
    specs.drivetrain,
  ].filter(Boolean);

  return `${details.join(", ")}. Full specs & side-by-side comparison on ${SITE_NAME}.`;
}

export function carOgImage(car: Car): string {
  return absoluteUrl(car.image);
}

export function carProductJsonLd(car: Car) {
  const specs = car.specs;
  const properties: Array<{ "@type": "PropertyValue"; name: string; value: string | number }> = [
    { "@type": "PropertyValue", name: "Powertrain", value: badgeLabel(car.powertrain) },
    {
      "@type": "PropertyValue",
      name: "Power",
      value: "horsepower" in specs ? `${specs.horsepower} hp` : `${specs.powerKw} kW`,
    },
    { "@type": "PropertyValue", name: "Torque", value: `${specs.torque} Nm` },
    { "@type": "PropertyValue", name: "Seats", value: specs.seats },
    { "@type": "PropertyValue", name: "Drivetrain", value: specs.drivetrain },
    { "@type": "PropertyValue", name: "Category", value: car.category },
  ];

  if ("range" in specs) {
    if (specs.range.wltp != null)
      properties.push({ "@type": "PropertyValue", name: "Range (WLTP)", value: `${specs.range.wltp} km` });
    if (specs.range.nedc != null)
      properties.push({ "@type": "PropertyValue", name: "Range (NEDC)", value: `${specs.range.nedc} km` });
    properties.push({
      "@type": "PropertyValue",
      name: "Battery",
      value: `${specs.battery.capacity} kWh ${specs.battery.type}`,
    });
  } else if (specs.fuelEconomy != null) {
    properties.push({ "@type": "PropertyValue", name: "Fuel Economy", value: `${specs.fuelEconomy} km/L` });
  }

  if (specs.acceleration.zeroToHundred != null)
    properties.push({
      "@type": "PropertyValue",
      name: "0-100 km/h",
      value: `${specs.acceleration.zeroToHundred} s`,
    });
  if (specs.topSpeed != null)
    properties.push({ "@type": "PropertyValue", name: "Top Speed", value: `${specs.topSpeed} km/h` });

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${carDisplayName(car)} ${car.year}`,
    image: carOgImage(car),
    description: carDescription(car),
    brand: { "@type": "Brand", name: car.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "THB",
      price: car.price,
      url: absoluteUrl(`/car/${car.id}`),
    },
    additionalProperty: properties,
  };
}

export function carBreadcrumbJsonLd(car: Car) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Car Catalog",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: carDisplayName(car),
        item: absoluteUrl(`/car/${car.id}`),
      },
    ],
  };
}

export function catalogItemListJsonLd(cars: Car[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cars.map((car, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${carDisplayName(car)} ${car.year}`,
      url: absoluteUrl(`/car/${car.id}`),
      image: absoluteUrl(car.image),
    })),
  };
}