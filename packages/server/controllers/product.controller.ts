import type { Request, Response } from "express";
import { productRepository } from "../repositories/product.repository";

export const productController = {
  async getProducts(req: Request, res: Response) {
    const products = await productRepository.getProducts(10);
    res.json({ products });
  },

  async getProduct(req: Request, res: Response) {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    const product = await productRepository.getProduct(productId);
    if (!product) return res.status(400).json("Product ID does not exist");

    res.json({ product });
  },
};
