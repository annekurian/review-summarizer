import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type ProductInfo = {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  imagePath: string;
  imageAlt: string;
  description: string;
};

export type Product = {
  product: ProductInfo;
};

export type ProductResponse = {
  products: ProductInfo[];
};

export const productsAPI = {
  async fetchProduct(productId: number) {
    return axios
      .get<Product>(`${BASE_URL}/api/products/${productId}`)
      .then((res) => res.data);
  },
  async fetchProducts(limit: number) {
    return axios
      .get<ProductResponse>(`${BASE_URL}/api/products`, { params: { limit } })
      .then((res) => res.data);
  },
};
