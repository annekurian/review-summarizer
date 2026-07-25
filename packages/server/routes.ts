import express from 'express';
import type { Request, Response } from 'express';
import { reviewController } from './controllers/review.controller';
import { productController } from './controllers/product.controller';

const router = express.Router();
router.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!!' });
});

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProduct);
router.get('/products/:id/reviews', reviewController.getReviews);
router.post(
  '/products/:id/reviews/summarize',
  reviewController.summarizeReviews
);

export default router;
