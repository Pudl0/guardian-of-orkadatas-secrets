-- CreateTable
CREATE TABLE `DndSession` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `dmId` VARCHAR(191) NOT NULL,

    INDEX `dmId`(`dmId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DndCharacter` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `userId` VARCHAR(255) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,

    INDEX `sessionId`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DndCharacter` ADD CONSTRAINT `DndCharacter_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `DndSession`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

