/*
  Warnings:

  - A unique constraint covering the columns `[brandId]` on the table `ModelCar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandId` to the `ModelCar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModelCar" ADD COLUMN     "brandId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ModelCar_brandId_key" ON "ModelCar"("brandId");

-- AddForeignKey
ALTER TABLE "ModelCar" ADD CONSTRAINT "ModelCar_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandCar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
