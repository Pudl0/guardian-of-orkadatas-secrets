/*
  Warnings:

  - Added the required column `dayOfWeek` to the `DndSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `DndSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `DndSession` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `dayOfWeek` INTEGER NOT NULL,
    ADD COLUMN `time` INTEGER NOT NULL;
