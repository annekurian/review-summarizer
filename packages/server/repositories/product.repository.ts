import { PrismaClient, type Product } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export const productRepository = {
  getProduct(productId: number) {
    return prisma.product.findUnique({
      where: { id: productId },
    });
  },

  getProducts(limit?: number): Promise<Product[]> {
    return prisma.product.findMany({
      take: limit,
    });
  },
};
