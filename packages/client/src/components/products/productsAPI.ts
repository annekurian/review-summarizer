import axios from 'axios';

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
      .get<Product>(`/api/products/${productId}`)
      .then((res) => res.data);
  },
  async fetchProducts(limit: number) {
    return axios
      .get<ProductResponse>('/api/products', { params: { limit } })
      .then((res) => res.data);
  },
};
