/*
  Warnings:

  - The primary key for the `KNode` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `KNode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `KNode` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`_id`);
