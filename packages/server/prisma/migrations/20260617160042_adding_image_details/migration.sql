-- AlterTable
ALTER TABLE `products` ADD COLUMN `imageAlt` VARCHAR(255) NOT NULL DEFAULT 'Photo by xxx on Unsplash',
    ADD COLUMN `imagePath` VARCHAR(255) NOT NULL DEFAULT '/src/assets/headphones.jpg';
