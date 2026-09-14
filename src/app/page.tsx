import type { Metadata } from "next";
import { cars } from "@/data/cars";
import CatalogClient from "@/components/CatalogClient";
import { catalogItemListJsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Car Catalog — Compare Prices, Specs & Powertrains",
  description:
    "Browse and compare cars — sedans, SUVs, hatchbacks, and sports cars across ICE, hybrid, and EV powertrains. Filter by brand, price, and powertrain to find the right comparison.",
};

export default function CatalogPage() {
  const jsonLd = catalogItemListJsonLd(cars);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CatalogClient />
    </>
  );
}