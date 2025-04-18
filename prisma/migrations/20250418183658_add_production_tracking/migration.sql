-- CreateEnum
CREATE TYPE "ProductionStatus" AS ENUM ('PATTERN_CUTTING_PENDING', 'TAILOR_ASSIGNMENT_PENDING', 'BASE_SUIT_PRODUCTION', 'TRIAL_PENDING', 'FINAL_PRODUCTION', 'FINAL_FITTING_PENDING', 'DELIVERY_PENDING', 'DELIVERED');

-- CreateTable
CREATE TABLE "OrderProduction" (
    "id" SERIAL NOT NULL,
    "orderNo" TEXT NOT NULL,
    "status" "ProductionStatus" NOT NULL DEFAULT 'PATTERN_CUTTING_PENDING',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,

    CONSTRAINT "OrderProduction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderProduction_orderNo_key" ON "OrderProduction"("orderNo");

-- CreateIndex
CREATE INDEX "OrderProduction_orderNo_idx" ON "OrderProduction"("orderNo");

-- AddForeignKey
ALTER TABLE "OrderProduction" ADD CONSTRAINT "OrderProduction_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE RESTRICT ON UPDATE CASCADE;
