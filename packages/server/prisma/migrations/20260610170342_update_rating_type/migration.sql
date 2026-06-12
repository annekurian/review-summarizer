/*
  Warnings:

  - You are about to alter the column `rating` on the `products` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `Float`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `rating` FLOAT NOT NULL;
