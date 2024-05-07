-- CreateTable
CREATE TABLE `KNode` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `visual` JSON NULL,
    `activeVersion` INTEGER NULL,
    `version` INTEGER NULL,
    `isPublic` BOOLEAN NOT NULL DEFAULT true,
    `type` VARCHAR(191) NOT NULL,
    `dataContent` JSON NOT NULL,
    `mapId` VARCHAR(191) NULL,
    `iAmId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
