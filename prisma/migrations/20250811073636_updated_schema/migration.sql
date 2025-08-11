-- DropForeignKey
ALTER TABLE `positions` DROP FOREIGN KEY `positions_designationId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_officeId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_positionId_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_schoolId_fkey`;

-- DropIndex
DROP INDEX `positions_designationId_fkey` ON `positions`;

-- DropIndex
DROP INDEX `users_officeId_fkey` ON `users`;

-- DropIndex
DROP INDEX `users_positionId_fkey` ON `users`;

-- DropIndex
DROP INDEX `users_schoolId_fkey` ON `users`;

-- AlterTable
ALTER TABLE `offices` ADD COLUMN `designationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `positions` ADD COLUMN `schoolsId` INTEGER NULL,
    MODIFY `designationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `schools` ADD COLUMN `designationId` INTEGER NULL,
    MODIFY `address` VARCHAR(191) NULL,
    MODIFY `schoolId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `schoolId` INTEGER NULL,
    MODIFY `officeId` INTEGER NULL,
    MODIFY `role` VARCHAR(191) NULL,
    MODIFY `designation` VARCHAR(191) NULL,
    MODIFY `positionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_officeId_fkey` FOREIGN KEY (`officeId`) REFERENCES `offices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_designationId_fkey` FOREIGN KEY (`designationId`) REFERENCES `designations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `offices` ADD CONSTRAINT `offices_designationId_fkey` FOREIGN KEY (`designationId`) REFERENCES `designations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_designationId_fkey` FOREIGN KEY (`designationId`) REFERENCES `designations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `positions` ADD CONSTRAINT `positions_schoolsId_fkey` FOREIGN KEY (`schoolsId`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
