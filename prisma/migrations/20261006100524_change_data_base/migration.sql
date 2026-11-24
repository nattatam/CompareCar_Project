/*
  Warnings:

  - You are about to drop the column `subModelId` on the `ModelCar` table. All the data in the column will be lost.
  - You are about to drop the column `subModelName` on the `ModelCar` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[brandId,name]` on the table `ModelCar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[modelId,name]` on the table `SubModelCar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modelId` to the `SubModelCar` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ModelCar" DROP CONSTRAINT "ModelCar_subModelId_fkey";

-- DropIndex
DROP INDEX "ModelCar_brandId_key";

-- DropIndex
DROP INDEX "ModelCar_subModelId_key";

-- AlterTable
ALTER TABLE "Car" ADD COLUMN     "subModelId" UUID;

-- AlterTable
ALTER TABLE "ModelCar" DROP COLUMN "subModelId",
DROP COLUMN "subModelName";

-- AlterTable
ALTER TABLE "SubModelCar" ADD COLUMN     "modelId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "Car_subModelId_idx" ON "Car"("subModelId");

-- CreateIndex
CREATE INDEX "ModelCar_brandId_idx" ON "ModelCar"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelCar_brandId_name_key" ON "ModelCar"("brandId", "name");

-- CreateIndex
CREATE INDEX "SubModelCar_modelId_idx" ON "SubModelCar"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "SubModelCar_modelId_name_key" ON "SubModelCar"("modelId", "name");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_subModelId_fkey" FOREIGN KEY ("subModelId") REFERENCES "SubModelCar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubModelCar" ADD CONSTRAINT "SubModelCar_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ModelCar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
