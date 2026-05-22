-- AlterTable
ALTER TABLE "PriceSnapshot" ADD COLUMN     "marketCap" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "PriceSnapshot_createdAt_idx" ON "PriceSnapshot"("createdAt");

-- CreateIndex
CREATE INDEX "PriceSnapshot_coinId_createdAt_idx" ON "PriceSnapshot"("coinId", "createdAt");
