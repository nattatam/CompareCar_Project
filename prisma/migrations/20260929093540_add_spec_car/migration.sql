/*
  Warnings:

  - A unique constraint covering the columns `[specId]` on the table `Car` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryCarId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officialUrl` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `powerTrainId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Drivetrain" AS ENUM ('FWD', 'RWD', 'AWD');

-- CreateEnum
CREATE TYPE "MotorType" AS ENUM ('PMSM', 'INDUCTION', 'SYNCHRONOUS_RELUctANCE', 'DC_BRUSHED', 'WOUND_ROTOR', 'UNKNOWN');

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "categoryCarId" UUID NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "officialUrl" TEXT NOT NULL,
ADD COLUMN     "powerTrainId" UUID NOT NULL,
ADD COLUMN     "price" DECIMAL(16,2) NOT NULL DEFAULT 0,
ADD COLUMN     "specId" UUID NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PowerTrain" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "subType" TEXT NOT NULL,

    CONSTRAINT "PowerTrain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryCar" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CategoryCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DimensionCar" (
    "id" UUID NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "wheelbase" INTEGER NOT NULL,

    CONSTRAINT "DimensionCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecCar" (
    "id" UUID NOT NULL,
    "powerKw" INTEGER NOT NULL,
    "torque" INTEGER NOT NULL,
    "topSpeed" INTEGER NOT NULL,
    "acceleration" DECIMAL(16,1) NOT NULL DEFAULT 0,
    "batteryId" UUID NOT NULL,
    "rangeId" UUID NOT NULL,
    "chargingId" UUID NOT NULL,
    "drivetrain" "Drivetrain" NOT NULL,
    "motorType" "MotorType" NOT NULL,
    "driveModes" TEXT[],
    "dimensionId" UUID NOT NULL,
    "groundClearance" INTEGER NOT NULL,
    "turningRadius" DECIMAL(16,1) NOT NULL DEFAULT 0,
    "weight" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "trunkCapacity" INTEGER NOT NULL,
    "trunkCapacityMax" INTEGER NOT NULL,

    CONSTRAINT "SpecCar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_specId_key" ON "Car"("specId");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_specId_fkey" FOREIGN KEY ("specId") REFERENCES "SpecCar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_powerTrainId_fkey" FOREIGN KEY ("powerTrainId") REFERENCES "PowerTrain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_categoryCarId_fkey" FOREIGN KEY ("categoryCarId") REFERENCES "CategoryCar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecCar" ADD CONSTRAINT "SpecCar_dimensionId_fkey" FOREIGN KEY ("dimensionId") REFERENCES "DimensionCar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
