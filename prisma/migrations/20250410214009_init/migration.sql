-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('SHIRT', 'JACKET', 'PANT');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'FLOOR_MANAGER', 'INVENTORY_MANAGER');

-- CreateTable
CREATE TABLE "Customer" (
    "customer_id" SERIAL NOT NULL,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "add1" TEXT,
    "add2" TEXT,
    "add3" TEXT,
    "add4" TEXT,
    "email" TEXT,
    "mobile" TEXT,
    "office_phone" TEXT,
    "residential_phone" TEXT,
    "last_ordered_date" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Fabric" (
    "fabric_id" SERIAL NOT NULL,
    "description" TEXT,
    "available_length" DECIMAL(65,30),
    "fabric_code" TEXT,
    "fabric_brand" TEXT,
    "stock_location" TEXT,
    "image" TEXT,
    "barcode" TEXT,

    CONSTRAINT "Fabric_pkey" PRIMARY KEY ("fabric_id")
);

-- CreateTable
CREATE TABLE "FabricOrderList" (
    "order_id" SERIAL NOT NULL,
    "fabric_id" INTEGER,
    "description" TEXT,
    "supplier_name" TEXT,
    "meters" DECIMAL(65,30),
    "ordered_date" TIMESTAMP(3),
    "ordered_for" TEXT,
    "supplier_id" INTEGER,

    CONSTRAINT "FabricOrderList_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "FinalJacketMeasurement" (
    "measurement_id" TEXT NOT NULL,
    "customer_id" INTEGER,
    "orderNo" TEXT,
    "date" TIMESTAMP(3),
    "jacket_length" TEXT,
    "natural_length" TEXT,
    "back_length" TEXT,
    "x_back" TEXT,
    "half_shoulder" TEXT,
    "to_sleeve" TEXT,
    "chest" TEXT,
    "waist" TEXT,
    "collar" TEXT,
    "waist_coat_length" TEXT,
    "sherwani_length" TEXT,
    "other_notes" TEXT,

    CONSTRAINT "FinalJacketMeasurement_pkey" PRIMARY KEY ("measurement_id")
);

-- CreateTable
CREATE TABLE "JacketMeasurement" (
    "measurement_id" TEXT NOT NULL,
    "customer_id" INTEGER,
    "orderNo" TEXT,
    "date" TIMESTAMP(3),
    "jacket_length" TEXT,
    "natural_length" TEXT,
    "back_length" TEXT,
    "x_back" TEXT,
    "half_shoulder" TEXT,
    "to_sleeve" TEXT,
    "chest" TEXT,
    "waist" TEXT,
    "collar" TEXT,
    "waist_coat_length" TEXT,
    "sherwani_length" TEXT,
    "other_notes" TEXT,

    CONSTRAINT "JacketMeasurement_pkey" PRIMARY KEY ("measurement_id")
);

-- CreateTable
CREATE TABLE "FinalPantMeasurement" (
    "measurement_id" TEXT NOT NULL,
    "customer_id" INTEGER,
    "orderNo" TEXT,
    "date" TIMESTAMP(3),
    "length" TEXT,
    "inseem" TEXT,
    "waist" TEXT,
    "hips" TEXT,
    "bottom" TEXT,
    "knee" TEXT,
    "other_notes" TEXT,

    CONSTRAINT "FinalPantMeasurement_pkey" PRIMARY KEY ("measurement_id")
);

-- CreateTable
CREATE TABLE "PantMeasurement" (
    "measurement_id" TEXT NOT NULL,
    "customer_id" INTEGER,
    "orderNo" TEXT,
    "date" TIMESTAMP(3),
    "length" TEXT,
    "inseem" TEXT,
    "waist" TEXT,
    "hips" TEXT,
    "bottom" TEXT,
    "knee" TEXT,
    "other_notes" TEXT,

    CONSTRAINT "PantMeasurement_pkey" PRIMARY KEY ("measurement_id")
);

-- CreateTable
CREATE TABLE "FinalShirtMeasurement" (
    "measurement_id" TEXT NOT NULL,
    "customer_id" INTEGER,
    "orderNo" TEXT,
    "date" TIMESTAMP(3),
    "length" TEXT,
    "half_shoulder" TEXT,
    "to_sleeve" TEXT,
    "chest" TEXT,
    "waist" TEXT,
    "collar" TEXT,
    "other_notes" TEXT,

    CONSTRAINT "FinalShirtMeasurement_pkey" PRIMARY KEY ("measurement_id")
);

-- CreateTable
CREATE TABLE "ShirtMeasurement" (
    "measurement_id" TEXT NOT NULL,
    "customer_id" INTEGER,
    "orderNo" TEXT,
    "date" TIMESTAMP(3),
    "length" TEXT,
    "half_shoulder" TEXT,
    "to_sleeve" TEXT,
    "chest" TEXT,
    "waist" TEXT,
    "collar" TEXT,
    "other_notes" TEXT,

    CONSTRAINT "ShirtMeasurement_pkey" PRIMARY KEY ("measurement_id")
);

-- CreateTable
CREATE TABLE "OrderPhotos" (
    "photo_id" SERIAL NOT NULL,
    "orderNo" TEXT,
    "s3_key" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderPhotos_pkey" PRIMARY KEY ("photo_id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "orderNo" TEXT NOT NULL,
    "customer_id" INTEGER,
    "date" TIMESTAMP(3),
    "onote" TEXT,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderNo")
);

-- CreateTable
CREATE TABLE "Items" (
    "item_id" SERIAL NOT NULL,
    "orderNo" TEXT,
    "item_name" TEXT,
    "item_type" "ItemType",
    "fabric_id" INTEGER,
    "lining_fabric_id" INTEGER,
    "jacket_measurement_id" TEXT,
    "shirt_measurement_id" TEXT,
    "pant_measurement_id" TEXT,
    "final_jacket_measurement_id" TEXT,
    "final_shirt_measurement_id" TEXT,
    "final_pant_measurement_id" TEXT,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "supplier_id" SERIAL NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "add1" TEXT,
    "add2" TEXT,
    "add3" TEXT,
    "phone_number1" TEXT,
    "phone_number2" TEXT,
    "phone_number3" TEXT,
    "email" TEXT,
    "primary_contact_name1" TEXT,
    "primary_contact_name2" TEXT,
    "primary_contact_name3" TEXT,
    "notes" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "RawMaterialsOrderList" (
    "order_id" SERIAL NOT NULL,
    "product_name" TEXT,
    "description" TEXT,
    "raw_material_code" TEXT,
    "color" TEXT,
    "supplier_name" TEXT,
    "quantity" DECIMAL(65,30),
    "ordered_date" TIMESTAMP(3),
    "supplier_id" INTEGER,

    CONSTRAINT "RawMaterialsOrderList_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogEntry" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrderPhotos_orderNo_idx" ON "OrderPhotos"("orderNo");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "FabricOrderList" ADD CONSTRAINT "FabricOrderList_fabric_id_fkey" FOREIGN KEY ("fabric_id") REFERENCES "Fabric"("fabric_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FabricOrderList" ADD CONSTRAINT "FabricOrderList_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalJacketMeasurement" ADD CONSTRAINT "FinalJacketMeasurement_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalJacketMeasurement" ADD CONSTRAINT "FinalJacketMeasurement_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JacketMeasurement" ADD CONSTRAINT "JacketMeasurement_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JacketMeasurement" ADD CONSTRAINT "JacketMeasurement_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalPantMeasurement" ADD CONSTRAINT "FinalPantMeasurement_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalPantMeasurement" ADD CONSTRAINT "FinalPantMeasurement_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantMeasurement" ADD CONSTRAINT "PantMeasurement_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PantMeasurement" ADD CONSTRAINT "PantMeasurement_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalShirtMeasurement" ADD CONSTRAINT "FinalShirtMeasurement_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinalShirtMeasurement" ADD CONSTRAINT "FinalShirtMeasurement_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShirtMeasurement" ADD CONSTRAINT "ShirtMeasurement_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShirtMeasurement" ADD CONSTRAINT "ShirtMeasurement_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderPhotos" ADD CONSTRAINT "OrderPhotos_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_orderNo_fkey" FOREIGN KEY ("orderNo") REFERENCES "Orders"("orderNo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_fabric_id_fkey" FOREIGN KEY ("fabric_id") REFERENCES "Fabric"("fabric_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_lining_fabric_id_fkey" FOREIGN KEY ("lining_fabric_id") REFERENCES "Fabric"("fabric_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_jacket_measurement_id_fkey" FOREIGN KEY ("jacket_measurement_id") REFERENCES "JacketMeasurement"("measurement_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_shirt_measurement_id_fkey" FOREIGN KEY ("shirt_measurement_id") REFERENCES "ShirtMeasurement"("measurement_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_pant_measurement_id_fkey" FOREIGN KEY ("pant_measurement_id") REFERENCES "PantMeasurement"("measurement_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_final_jacket_measurement_id_fkey" FOREIGN KEY ("final_jacket_measurement_id") REFERENCES "FinalJacketMeasurement"("measurement_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_final_shirt_measurement_id_fkey" FOREIGN KEY ("final_shirt_measurement_id") REFERENCES "FinalShirtMeasurement"("measurement_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_final_pant_measurement_id_fkey" FOREIGN KEY ("final_pant_measurement_id") REFERENCES "FinalPantMeasurement"("measurement_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RawMaterialsOrderList" ADD CONSTRAINT "RawMaterialsOrderList_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogEntry" ADD CONSTRAINT "LogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
