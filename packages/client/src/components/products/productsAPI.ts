import axios from 'axios';

export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
};

export type ProductResponse = {
  products: Product[];
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
