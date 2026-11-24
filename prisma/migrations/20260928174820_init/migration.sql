-- CreateTable
CREATE TABLE "Car" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "brandId" UUID NOT NULL,
    "modelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandCar" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "BrandCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelCar" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "subModelId" UUID,
    "subModelName" VARCHAR(255),

    CONSTRAINT "ModelCar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubModelCar" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "SubModelCar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Car_brandId_idx" ON "Car"("brandId");

-- CreateIndex
CREATE INDEX "Car_modelId_idx" ON "Car"("modelId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandCar_name_key" ON "BrandCar"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModelCar_subModelId_key" ON "ModelCar"("subModelId");

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "BrandCar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "ModelCar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelCar" ADD CONSTRAINT "ModelCar_subModelId_fkey" FOREIGN KEY ("subModelId") REFERENCES "SubModelCar"("id") ON DELETE SET NULL ON UPDATE CASCADE;
