export type PowertrainType = "ICE" | "HEV" | "EV";

export type HevSubtype = "MHEV" | "HEV" | "PHEV" | "REEV/EREV";
export type EvSubtype = "BEV";

export interface Powertrain {
  type: PowertrainType;
  subtype?: HevSubtype | EvSubtype;
}

export type Category = "Sedan" | "SUV" | "Sports" | "Hatchback";

export interface ImageCredit {
  author: string;
  sourceUrl: string; // Wikimedia Commons file page (or original source)
  license: string; // e.g. "CC BY 3.0"
  licenseUrl?: string; // e.g. https://creativecommons.org/licenses/by/3.0/
  note?: string; // optional extra attribution
  videoUrl?: string; // optional source video link (e.g. YouTube)
}

export interface Battery {
  type: string;
  capacity: number;
}

export interface Dimension {
  length: number; // mm
  width: number; // mm
  height: number; // mm
  wheelbase: number; // mm
}

interface CarBase {
  id: string;
  brand: string;
  model: string;
  subModel?: string;
  year: number;
  price: number;
  image: string;
  category: Category;
  officialUrl?: string; // official manufacturer website
}

export interface CarSpecs {
  torque: number; // Nm
  topSpeed?: number; // km/h
  acceleration: {
    zeroToHundred?: number; // sec
  };
  seats: number;
  drivetrain: "FWD" | "RWD" | "AWD" | "4WD";
  weight?: number; // kg
  groundClearance: number; // mm
  groundClearanceLoaded?: number; // mm
  turningRadius?: number; // m
  dimension: Dimension;
  trunkCapacity?: number; // L
  trunkCapacityMax?: number; // L
  intelligentAssist?: string[]; // ADAS / driver-assistance features
  security?: string[]; // safety equipment
}

// ICE
export interface CarSpecsIce extends CarSpecs {
  horsepower: number; // hp

  fuelEconomy?: number;

  transmission: string;
  engine: string;
}

// EV
export interface CarSpecsEv extends CarSpecs {
  powerKw: number;
  battery: Battery;
  range: {
    wltp?: number;
    nedc?: number;
  };
  charging: {
    ac?: number;
    dc?: number;
    time: number;
  };
  motorType: string;
  driveModes?: string[];
  dimension: {
    length: number;
    width: number;
    height: number;
    wheelbase: number;
  };
  frunkCapacity?: number;
  trunkCapacity?: number;
  trunkCapacityMax?: number;
}

export interface IceCar extends CarBase {
  powertrain: Powertrain;
  specs: CarSpecsIce;
}

export interface HevCar extends CarBase {
  powertrain: Powertrain;
  specs: CarSpecsEv;
}

export interface EvCar extends CarBase {
  powertrain: Powertrain;
  specs: CarSpecsEv;
}

export type Car = EvCar | HevCar | IceCar;

export const POWERTRAIN_LABELS: Record<string, string> = {
  MHEV: "MHEV",
  HEV: "HEV",
  PHEV: "PHEV",
  "REEV/EREV": "REEV/EREV",
  BEV: "EV",
  ICE: "ICE",
};

export function badgeLabel(powertrain: Powertrain): string {
  if (powertrain.type === "ICE") return "ICE";
  if (powertrain.type === "EV") return "EV";
  return POWERTRAIN_LABELS[powertrain.subtype ?? "HEV"];
}

export function formatPrice(price: number): string {
  return `฿${price.toLocaleString("en-US")}`;
}
