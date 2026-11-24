/*
  Warnings:

  - You are about to alter the column `acceleration` on the `SpecCar` table. The data in that column could be lost. The data in that column will be cast from `Decimal(16,1)` to `Decimal(16,2)`.
  - You are about to alter the column `turningRadius` on the `SpecCar` table. The data in that column could be lost. The data in that column will be cast from `Decimal(16,1)` to `Decimal(16,2)`.

*/
-- CreateEnum
CREATE TYPE "BatteryType" AS ENUM ('LFP', 'NMC', 'NCA', 'LTO');

-- AlterTable
ALTER TABLE "SpecCar" ALTER COLUMN "powerKw" SET DEFAULT 0,
ALTER COLUMN "powerKw" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "torque" SET DEFAULT 0,
ALTER COLUMN "torque" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "topSpeed" SET DEFAULT 0,
ALTER COLUMN "topSpeed" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "acceleration" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "groundClearance" SET DEFAULT 0,
ALTER COLUMN "groundClearance" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "turningRadius" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "weight" SET DEFAULT 0,
ALTER COLUMN "weight" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "trunkCapacity" SET DEFAULT 0,
ALTER COLUMN "trunkCapacity" SET DATA TYPE DECIMAL(16,2),
ALTER COLUMN "trunkCapacityMax" SET DEFAULT 0,
ALTER COLUMN "trunkCapacityMax" SET DATA TYPE DECIMAL(16,2);

-- CreateTable
CREATE TABLE "Battery" (
    "id" UUID NOT NULL,
    "type" "BatteryType" NOT NULL,
    "capacity" DECIMAL(16,2) NOT NULL DEFAULT 0,

    CONSTRAINT "Battery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Range" (
    "id" UUID NOT NULL,
    "nedc" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "wltp" DECIMAL(16,2) DEFAULT 0,
    "epa" DECIMAL(16,2) DEFAULT 0,
    "cltc" DECIMAL(16,2) DEFAULT 0,

    CONSTRAINT "Range_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charging" (
    "id" UUID NOT NULL,
    "ac" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "dc" DECIMAL(16,2) NOT NULL DEFAULT 0,
    "time" DECIMAL(16,2) NOT NULL DEFAULT 0,

    CONSTRAINT "Charging_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SpecCar" ADD CONSTRAINT "SpecCar_batteryId_fkey" FOREIGN KEY ("batteryId") REFERENCES "Battery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecCar" ADD CONSTRAINT "SpecCar_rangeId_fkey" FOREIGN KEY ("rangeId") REFERENCES "Range"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecCar" ADD CONSTRAINT "SpecCar_chargingId_fkey" FOREIGN KEY ("chargingId") REFERENCES "Charging"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
