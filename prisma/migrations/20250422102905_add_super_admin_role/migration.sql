/*
  Warnings:

  - You are about to drop the column `inventory_item_type` on the `InventoryItem` table. All the data in the column will be lost.
  - Added the required column `item_name` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_type` to the `InventoryItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';

-- AlterTable
ALTER TABLE "InventoryItem" DROP COLUMN "inventory_item_type",
ADD COLUMN     "item_name" TEXT NOT NULL,
ADD COLUMN     "item_type" "InventoryItemType" NOT NULL;
