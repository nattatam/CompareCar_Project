import { cars } from "@/data/cars";
import type { PowertrainType, Category } from "@/lib/types";

export const POWERTRAIN_TYPES: Array<"All" | PowertrainType> = [
  "All",
  "ICE",
  "HEV",
  "EV",
];
export const SUBTYPES = [
  "All",
  "EV",
  "MHEV",
  "HEV",
  "PHEV",
  "REEV/EREV",
  "ICE",
] as const;
export const CATEGORIES: Array<"All" | Category> = [
  "All",
  "Sedan",
  "SUV",
  "Sports",
  "Hatchback",
];
export const BRANDS = [
  "All",
  ...Array.from(new Set(cars.map((c) => c.brand))).sort(),
];

export const PRICE_LIMIT =
  Math.ceil(Math.max(...cars.map((c) => c.price)) / 100000) * 100000;
export const DEFAULT_PRICE_RANGE: [number, number] = [0, PRICE_LIMIT];

export const PAGE_SIZE = 15;

export type Subtype = (typeof SUBTYPES)[number];
export type Brand = (typeof BRANDS)[number];