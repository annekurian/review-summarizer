import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Wireless Earbuds',
      brand: 'Sony',
      price: 129.99,
      rating: 4.5,
      imagePath: 'wireless-earbuds.jpg',
      imageAlt: 'Sony Wireless Earbuds',
      description: 'Premium wireless earbuds with noise cancellation.',
    },
    {
      name: 'Bluetooth Speaker',
      brand: 'JBL',
      price: 89.99,
      rating: 4.3,
      imagePath: 'bluetooth-speaker.jpg',
      imageAlt: 'JBL Bluetooth Speaker',
      description: 'Portable waterproof speaker with 12-hour battery.',
    },
    {
      name: 'Smart Watch',
      brand: 'Samsung',
      price: 249.99,
      rating: 4.6,
      imagePath: 'smart-watch.jpg',
      imageAlt: 'Samsung Smart Watch',
      description: 'Feature-rich smartwatch with health tracking.',
    },
    {
      name: '4K Monitor',
      brand: 'LG',
      price: 399.99,
      rating: 4.7,
      imagePath: '4k-monitor.jpg',
      imageAlt: 'LG 4K Monitor',
      description: '27-inch 4K UHD IPS monitor with HDR support.',
    },
    {
      name: 'Mechanical Keyboard',
      brand: 'Logitech',
      price: 159.99,
      rating: 4.4,
      imagePath: 'mechanical-keyboard.jpg',
      imageAlt: 'Logitech Mechanical Keyboard',
      description: 'Wireless mechanical keyboard with RGB backlight.',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: product,
    });
  }

  console.log('Seeded 5 products successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
