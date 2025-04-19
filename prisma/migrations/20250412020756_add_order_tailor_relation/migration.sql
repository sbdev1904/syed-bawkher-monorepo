-- CreateTable
CREATE TABLE "OrderTailor" (
    "id" SERIAL NOT NULL,
    "orderNo" TEXT NOT NULL,
    "tailor_id" INTEGER NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "due_date" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "OrderTailor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderTailor_orderNo_idx" ON "OrderTailor"("orderNo");

-- CreateIndex
CREATE INDEX "OrderTailor_tailor_id_idx" ON "OrderTailor"("tailor_id");

-- CreateIndex
CREATE UNIQUE INDEX "OrderTailor_orderNo_tailor_id_key" ON "OrderTailor"("orderNo", "tailor_id");

-- AddForeignKey
ALTER TABLE "OrderTailor" ADD CONSTRAINT "OrderTailor_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderTailor" ADD CONSTRAINT "OrderTailor_tailor_id_fkey" FOREIGN KEY ("tailor_id") REFERENCES "Tailor"("tailor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
