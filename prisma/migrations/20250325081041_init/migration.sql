-- AlterTable
ALTER TABLE `items` ADD COLUMN `final_jacket_measurement_id` VARCHAR(191) NULL,
    ADD COLUMN `final_pant_measurement_id` VARCHAR(191) NULL,
    ADD COLUMN `final_shirt_measurement_id` VARCHAR(191) NULL,
    ADD COLUMN `jacket_measurement_id` VARCHAR(191) NULL,
    ADD COLUMN `pant_measurement_id` VARCHAR(191) NULL,
    ADD COLUMN `shirt_measurement_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `JacketMeasurement` (
    `measurement_id` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NULL,
    `orderNo` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `jacket_length` VARCHAR(191) NULL,
    `natural_length` VARCHAR(191) NULL,
    `back_length` VARCHAR(191) NULL,
    `x_back` VARCHAR(191) NULL,
    `half_shoulder` VARCHAR(191) NULL,
    `to_sleeve` VARCHAR(191) NULL,
    `chest` VARCHAR(191) NULL,
    `waist` VARCHAR(191) NULL,
    `collar` VARCHAR(191) NULL,
    `waist_coat_length` VARCHAR(191) NULL,
    `sherwani_length` VARCHAR(191) NULL,
    `other_notes` VARCHAR(191) NULL,

    PRIMARY KEY (`measurement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinalPantMeasurement` (
    `measurement_id` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NULL,
    `orderNo` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `length` VARCHAR(191) NULL,
    `inseem` VARCHAR(191) NULL,
    `waist` VARCHAR(191) NULL,
    `hips` VARCHAR(191) NULL,
    `bottom` VARCHAR(191) NULL,
    `knee` VARCHAR(191) NULL,
    `other_notes` VARCHAR(191) NULL,

    PRIMARY KEY (`measurement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PantMeasurement` (
    `measurement_id` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NULL,
    `orderNo` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `length` VARCHAR(191) NULL,
    `inseem` VARCHAR(191) NULL,
    `waist` VARCHAR(191) NULL,
    `hips` VARCHAR(191) NULL,
    `bottom` VARCHAR(191) NULL,
    `knee` VARCHAR(191) NULL,
    `other_notes` VARCHAR(191) NULL,

    PRIMARY KEY (`measurement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinalShirtMeasurement` (
    `measurement_id` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NULL,
    `orderNo` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `length` VARCHAR(191) NULL,
    `half_shoulder` VARCHAR(191) NULL,
    `to_sleeve` VARCHAR(191) NULL,
    `chest` VARCHAR(191) NULL,
    `waist` VARCHAR(191) NULL,
    `collar` VARCHAR(191) NULL,
    `other_notes` VARCHAR(191) NULL,

    PRIMARY KEY (`measurement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShirtMeasurement` (
    `measurement_id` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NULL,
    `orderNo` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `length` VARCHAR(191) NULL,
    `half_shoulder` VARCHAR(191) NULL,
    `to_sleeve` VARCHAR(191) NULL,
    `chest` VARCHAR(191) NULL,
    `waist` VARCHAR(191) NULL,
    `collar` VARCHAR(191) NULL,
    `other_notes` VARCHAR(191) NULL,

    PRIMARY KEY (`measurement_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderPhotos` (
    `photo_id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNo` VARCHAR(191) NULL,
    `s3_key` VARCHAR(191) NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `OrderPhotos_orderNo_idx`(`orderNo`),
    PRIMARY KEY (`photo_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RawMaterialsOrderList` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `raw_material_code` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `supplier_name` VARCHAR(191) NULL,
    `quantity` DECIMAL(65, 30) NULL,
    `ordered_date` DATETIME(3) NULL,
    `supplier_id` INTEGER NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JacketMeasurement` ADD CONSTRAINT `JacketMeasurement_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JacketMeasurement` ADD CONSTRAINT `JacketMeasurement_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalPantMeasurement` ADD CONSTRAINT `FinalPantMeasurement_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalPantMeasurement` ADD CONSTRAINT `FinalPantMeasurement_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PantMeasurement` ADD CONSTRAINT `PantMeasurement_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PantMeasurement` ADD CONSTRAINT `PantMeasurement_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalShirtMeasurement` ADD CONSTRAINT `FinalShirtMeasurement_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalShirtMeasurement` ADD CONSTRAINT `FinalShirtMeasurement_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShirtMeasurement` ADD CONSTRAINT `ShirtMeasurement_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ShirtMeasurement` ADD CONSTRAINT `ShirtMeasurement_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderPhotos` ADD CONSTRAINT `OrderPhotos_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_jacket_measurement_id_fkey` FOREIGN KEY (`jacket_measurement_id`) REFERENCES `JacketMeasurement`(`measurement_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_shirt_measurement_id_fkey` FOREIGN KEY (`shirt_measurement_id`) REFERENCES `ShirtMeasurement`(`measurement_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_pant_measurement_id_fkey` FOREIGN KEY (`pant_measurement_id`) REFERENCES `PantMeasurement`(`measurement_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_final_jacket_measurement_id_fkey` FOREIGN KEY (`final_jacket_measurement_id`) REFERENCES `FinalJacketMeasurement`(`measurement_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_final_shirt_measurement_id_fkey` FOREIGN KEY (`final_shirt_measurement_id`) REFERENCES `FinalShirtMeasurement`(`measurement_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_final_pant_measurement_id_fkey` FOREIGN KEY (`final_pant_measurement_id`) REFERENCES `FinalPantMeasurement`(`measurement_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RawMaterialsOrderList` ADD CONSTRAINT `RawMaterialsOrderList_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `Supplier`(`supplier_id`) ON DELETE SET NULL ON UPDATE CASCADE;
