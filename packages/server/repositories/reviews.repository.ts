import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma/client';
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

export const reviewRepository = {
  getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  storeReviewSummary(productId: number, summary: string) {
    const now = new Date();
    const expiresAt = dayjs().add(7, 'days').toDate();
    const data = {
      content: summary,
      expiresAt,
      generatedAt: now,
      productId,
    };
    return prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },

  async getReviewSummary(productId: number): Promise<string | null> {
    const summary = await prisma.summary.findFirst({
      where: {
        AND: [{ productId }, { expiresAt: { gt: new Date() } }],
      },
    });

    return summary ? summary.content : null;
  },
};
