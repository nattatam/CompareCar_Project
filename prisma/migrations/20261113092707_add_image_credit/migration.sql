-- CreateTable
CREATE TABLE "ImageCredit" (
    "id" UUID NOT NULL,
    "image" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "author" VARCHAR(255),
    "sourceUrl" TEXT NOT NULL,
    "license" VARCHAR(100) NOT NULL,
    "licenseUrl" TEXT,
    "note" TEXT,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageCredit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageCredit_image_key" ON "ImageCredit"("image");
