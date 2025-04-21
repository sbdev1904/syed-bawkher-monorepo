/*
  Warnings:

  - You are about to drop the column `itemId` on the `InventoryMovement` table. All the data in the column will be lost.
  - You are about to drop the column `movedAt` on the `InventoryMovement` table. All the data in the column will be lost.
  - You are about to drop the column `addedOn` on the `ItemSupplier` table. All the data in the column will be lost.
  - You are about to drop the column `itemId` on the `ItemSupplier` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `ItemSupplier` table. All the data in the column will be lost.
  - You are about to drop the column `bunchId` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Items` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `Items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_id,supplier_id]` on the table `ItemSupplier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `item_id` to the `InventoryMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `ItemSupplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_id` to the `ItemSupplier` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InventoryItemType" AS ENUM ('FABRIC', 'RAW_MATERIAL', 'PACKAGING_MATERIAL');

-- DropForeignKey
ALTER TABLE "InventoryMovement" DROP CONSTRAINT "InventoryMovement_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSupplier" DROP CONSTRAINT "ItemSupplier_itemId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSupplier" DROP CONSTRAINT "ItemSupplier_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_bunchId_fkey";

-- DropForeignKey
ALTER TABLE "Items" DROP CONSTRAINT "Items_unitId_fkey";

-- DropIndex
DROP INDEX "ItemSupplier_itemId_supplierId_key";

-- AlterTable
ALTER TABLE "InventoryMovement" DROP COLUMN "itemId",
DROP COLUMN "movedAt",
ADD COLUMN     "item_id" TEXT NOT NULL,
ADD COLUMN     "moved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ItemSupplier" DROP COLUMN "addedOn",
DROP COLUMN "itemId",
DROP COLUMN "supplierId",
ADD COLUMN     "added_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "item_id" TEXT NOT NULL,
ADD COLUMN     "supplier_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Items" DROP COLUMN "bunchId",
DROP COLUMN "quantity",
DROP COLUMN "unitId";

-- CreateTable
CREATE TABLE "InventoryItem" (
    "item_id" TEXT NOT NULL,
    "inventory_item_type" "InventoryItemType" NOT NULL,
    "bunch_id" INTEGER,
    "unit_id" INTEGER,
    "quantity" DOUBLE PRECISION,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemSupplier_item_id_supplier_id_key" ON "ItemSupplier"("item_id", "supplier_id");

-- AddForeignKey
ALTER TABLE "Rack" ADD CONSTRAINT "Rack_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bunch" ADD CONSTRAINT "Bunch_rack_id_fkey" FOREIGN KEY ("rack_id") REFERENCES "Rack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "InventoryItem"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSupplier" ADD CONSTRAINT "ItemSupplier_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "InventoryItem"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSupplier" ADD CONSTRAINT "ItemSupplier_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_bunch_id_fkey" FOREIGN KEY ("bunch_id") REFERENCES "Bunch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "Unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
