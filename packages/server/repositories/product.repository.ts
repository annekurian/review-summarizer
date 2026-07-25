import { PrismaClient, type Product } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const url = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.replace('/', ''),
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

export const productRepository = {
  getProduct(productId: number): Promise<Product | null> {
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
