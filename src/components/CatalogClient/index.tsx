"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cars } from "@/data/cars";
import type { PowertrainType, Category } from "@/lib/types";
import { badgeLabel } from "@/lib/types";
import { scrollToTop } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/Pagination";
import CarCard from "@/components/CarCard";
import CompareBar from "@/components/CompareBar";
import FilterBar from "@/components/FilterBar";
import { DEFAULT_PRICE_RANGE, PAGE_SIZE } from "@/constants/constants";
import type { Brand, Subtype } from "@/constants/constants";
import DisclaimerBox from "@/components/DisclaimerBox";

export default function CatalogClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [powertrain, setPowertrain] = useState<"All" | PowertrainType>("All");
  const [subtype, setSubtype] = useState<Subtype>("All");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [brand, setBrand] = useState<Brand>("All");
  const [priceRange, setPriceRange] =
    useState<[number, number]>(DEFAULT_PRICE_RANGE);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    scrollToTop();
  }

  function resetPage(updateFilter: () => void) {
    setPage(1);
    updateFilter();
    requestAnimationFrame(() => {
      scrollToTop();
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const [min, max] = priceRange;
    const priceActive =
      min > DEFAULT_PRICE_RANGE[0] || max < DEFAULT_PRICE_RANGE[1];
    return cars.filter((car) => {
      if (
        q &&
        !`${car.brand} ${car.model}`.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (powertrain !== "All" && car.powertrain.type !== powertrain) {
        return false;
      }
      if (subtype !== "All" && badgeLabel(car.powertrain) !== subtype) {
        return false;
      }
      if (category !== "All" && car.category !== category) {
        return false;
      }
      if (brand !== "All" && car.brand !== brand) {
        return false;
      }
      if (priceActive) {
        if (car.price <= 0) return false;
        if (car.price < min) return false;
        if (car.price > max) return false;
      }
      return true;
    });
  }, [query, powertrain, subtype, category, brand, priceRange]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(page, pageCount);
  const pageStart = (activePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function goCompare() {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    router.push(`/compare?ids=${ids.join(",")}`);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-32">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Car Catalog</h1>
        <p className="mt-1 text-muted-foreground">
          Browse cars, filter by powertrain, and select up to 5 to compare.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="sticky top-20 hidden w-64 shrink-0 self-start lg:block">
          <FilterBar
            query={query}
            powertrain={powertrain}
            subtype={subtype}
            category={category}
            brand={brand}
            priceRange={priceRange}
            onQueryChange={(v) => resetPage(() => setQuery(v))}
            onPowertrainChange={(v) => resetPage(() => setPowertrain(v))}
            onSubtypeChange={(v) => resetPage(() => setSubtype(v))}
            onCategoryChange={(v) => resetPage(() => setCategory(v))}
            onBrandChange={(v) => resetPage(() => setBrand(v))}
            onPriceRangeChange={(v) => resetPage(() => setPriceRange(v))}
            onClearPrice={() => setPriceRange(DEFAULT_PRICE_RANGE)}
          />
        </aside>

        {/* Grid */}
        <div className="min-w-0 flex-1">
          {/* Mobile filter bar */}
          <div className="mb-4 lg:hidden">
            <FilterBar
              query={query}
              powertrain={powertrain}
              subtype={subtype}
              category={category}
              brand={brand}
              priceRange={priceRange}
              onQueryChange={(v) => resetPage(() => setQuery(v))}
              onPowertrainChange={(v) => resetPage(() => setPowertrain(v))}
              onSubtypeChange={(v) => resetPage(() => setSubtype(v))}
              onCategoryChange={(v) => resetPage(() => setCategory(v))}
              onBrandChange={(v) => resetPage(() => setBrand(v))}
              onPriceRangeChange={(v) => resetPage(() => setPriceRange(v))}
              onClearPrice={() => setPriceRange(DEFAULT_PRICE_RANGE)}
            />
          </div>

          {filtered.length === 0 ? (
            <Card className="py-16 text-center">
              <p className="text-muted-foreground">No cars match your filters.</p>
            </Card>
          ) : (
            <div className="scroll-mt-16 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  selected={selected.has(car.id)}
                  onToggle={toggle}
                />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <Pagination
              page={activePage}
              pageCount={pageCount}
              total={filtered.length}
              onChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* Compare footer bar */}
      <CompareBar
        count={selected.size}
        onCompare={goCompare}
        onClear={() => setSelected(new Set())}
      />

      <DisclaimerBox className="mt-10" />
    </div>
  );
}