'use client'

import type { PowertrainType, Category } from '@/lib/types'
import type { Brand, Subtype } from '@/constants/constants'
import { useTranslations } from 'next-intl'
import { BRANDS, CATEGORIES, DEFAULT_PRICE_RANGE, POWERTRAIN_TYPES, SUBTYPES } from '@/constants/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { CategoryIcon } from '@/components/icons/carIcons'
import { FilterGroup } from '@/components/filters/FilterGroup'
import { FilterChip } from '@/components/filters/FilterChip'
import { formatPriceCompact } from '@/lib/utils'

export interface FilterBarProps {
  query: string
  powertrain: 'All' | PowertrainType
  subtype: Subtype
  category: 'All' | Category
  brand: Brand
  priceRange: [number, number]
  onQueryChange: (value: string) => void
  onPowertrainChange: (value: 'All' | PowertrainType) => void
  onSubtypeChange: (value: Subtype) => void
  onCategoryChange: (value: 'All' | Category) => void
  onBrandChange: (value: Brand) => void
  onPriceRangeChange: (value: [number, number]) => void
  onClearPrice: () => void
}

export default function FilterBar({
  query,
  powertrain,
  subtype,
  category,
  brand,
  priceRange,
  onQueryChange,
  onPowertrainChange,
  onSubtypeChange,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onClearPrice,
}: FilterBarProps) {
  const t = useTranslations('Filter')
  const tCommon = useTranslations('Common')

  return (
    <Card className="h-fit w-full shadow-sm">
      <CardContent className="space-y-5 p-y-4">
        <div>
          <p className="mb-1.5">{t('search')}</p>
          <Input type="text" value={query} onChange={(e) => onQueryChange(e.target.value)} placeholder={t('searchPlaceholder')} />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t('priceRange')}</p>
            {(priceRange[0] > 0 || priceRange[1] < DEFAULT_PRICE_RANGE[1]) && (
              <Button type="button" variant="ghost" size="xs" onClick={onClearPrice} className="cursor-pointer">
                {tCommon('clear')}
              </Button>
            )}
          </div>
          <Slider
            min={0}
            max={DEFAULT_PRICE_RANGE[1]}
            step={50000}
            minStepsBetweenThumbs={1}
            value={priceRange}
            onValueChange={(v: number[]) => onPriceRangeChange([v[0], v[1]])}
            aria-label="Price range in Thai Baht"
          />
          <div className="mt-1.5 flex items-center justify-between gap-2 text-sm font-medium text-foreground tabular-nums">
            <span>{formatPriceCompact(priceRange[0])}</span>
            <span>{formatPriceCompact(priceRange[1])}</span>
          </div>
        </div>

        <FilterGroup label={t('brand')}>
          {BRANDS.map((b) => (
            <FilterChip key={b} active={brand === b} onClick={() => onBrandChange(b)}>
              {b}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label={t('powertrainType')}>
          {POWERTRAIN_TYPES.map((t) => (
            <FilterChip key={t} active={powertrain === t} onClick={() => onPowertrainChange(t)}>
              {t}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label={t('subtype')}>
          {SUBTYPES.map((s) => (
            <FilterChip key={s} active={subtype === s} onClick={() => onSubtypeChange(s)}>
              {s}
            </FilterChip>
          ))}
        </FilterGroup>

        <FilterGroup label={t('category')}>
          {CATEGORIES.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => onCategoryChange(c)}>
              {c === 'All' ? <></> : <CategoryIcon category={c} className="size-7" />}
              {c}
            </FilterChip>
          ))}
        </FilterGroup>
      </CardContent>
    </Card>
  )
}
