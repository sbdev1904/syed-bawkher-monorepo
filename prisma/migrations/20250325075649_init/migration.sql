-- CreateTable
CREATE TABLE `Customer` (
    `customer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `add1` VARCHAR(191) NULL,
    `add2` VARCHAR(191) NULL,
    `add3` VARCHAR(191) NULL,
    `add4` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `mobile` VARCHAR(191) NULL,
    `office_phone` VARCHAR(191) NULL,
    `residential_phone` VARCHAR(191) NULL,
    `last_ordered_date` DATETIME(3) NULL,

    PRIMARY KEY (`customer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fabric` (
    `fabric_id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NULL,
    `available_length` DECIMAL(65, 30) NULL,
    `fabric_code` VARCHAR(191) NULL,
    `fabric_brand` VARCHAR(191) NULL,
    `stock_location` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `barcode` VARCHAR(191) NULL,

    PRIMARY KEY (`fabric_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FabricOrderList` (
    `order_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fabric_id` INTEGER NULL,
    `description` VARCHAR(191) NULL,
    `supplier_name` VARCHAR(191) NULL,
    `meters` DECIMAL(65, 30) NULL,
    `ordered_date` DATETIME(3) NULL,
    `ordered_for` VARCHAR(191) NULL,
    `supplier_id` INTEGER NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FinalJacketMeasurement` (
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
CREATE TABLE `Orders` (
    `orderNo` VARCHAR(191) NOT NULL,
    `customer_id` INTEGER NULL,
    `date` DATETIME(3) NULL,
    `onote` VARCHAR(191) NULL,

    PRIMARY KEY (`orderNo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Items` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNo` VARCHAR(191) NULL,
    `item_name` VARCHAR(191) NULL,
    `item_type` ENUM('SHIRT', 'JACKET', 'PANT') NULL,
    `fabric_id` INTEGER NULL,
    `lining_fabric_id` INTEGER NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `supplier_id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplier_name` VARCHAR(191) NOT NULL,
    `add1` VARCHAR(191) NULL,
    `add2` VARCHAR(191) NULL,
    `add3` VARCHAR(191) NULL,
    `phone_number1` VARCHAR(191) NULL,
    `phone_number2` VARCHAR(191) NULL,
    `phone_number3` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `primary_contact_name1` VARCHAR(191) NULL,
    `primary_contact_name2` VARCHAR(191) NULL,
    `primary_contact_name3` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,

    PRIMARY KEY (`supplier_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'FLOOR_MANAGER', 'INVENTORY_MANAGER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FabricOrderList` ADD CONSTRAINT `FabricOrderList_fabric_id_fkey` FOREIGN KEY (`fabric_id`) REFERENCES `Fabric`(`fabric_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FabricOrderList` ADD CONSTRAINT `FabricOrderList_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `Supplier`(`supplier_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalJacketMeasurement` ADD CONSTRAINT `FinalJacketMeasurement_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FinalJacketMeasurement` ADD CONSTRAINT `FinalJacketMeasurement_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customer`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_orderNo_fkey` FOREIGN KEY (`orderNo`) REFERENCES `Orders`(`orderNo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_fabric_id_fkey` FOREIGN KEY (`fabric_id`) REFERENCES `Fabric`(`fabric_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_lining_fabric_id_fkey` FOREIGN KEY (`lining_fabric_id`) REFERENCES `Fabric`(`fabric_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogEntry` ADD CONSTRAINT `LogEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
