-- CreateEnum
CREATE TYPE "FeatureCategory" AS ENUM ('INTELLIGENT_ASSIST', 'SECURITY');

-- CreateTable
CREATE TABLE "Feature" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "category" "FeatureCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarFeature" (
    "carId" UUID NOT NULL,
    "featureId" UUID NOT NULL,

    CONSTRAINT "CarFeature_pkey" PRIMARY KEY ("carId","featureId")
);

-- CreateIndex
CREATE INDEX "Feature_category_idx" ON "Feature"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Feature_name_category_key" ON "Feature"("name", "category");

-- CreateIndex
CREATE INDEX "CarFeature_featureId_idx" ON "CarFeature"("featureId");

-- AddForeignKey
ALTER TABLE "CarFeature" ADD CONSTRAINT "CarFeature_carId_fkey" FOREIGN KEY ("carId") REFERENCES "Car"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarFeature" ADD CONSTRAINT "CarFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
