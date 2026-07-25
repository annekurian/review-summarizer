import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: string;
};

export type GetReviewResponse = {
  summary: string | null;
  reviews: Review[];
};

export type SummarizeResponse = {
  summary: string;
  productId: number;
};

export const reviewsApi = {
  async fetchReviews(productId: number) {
    return axios
      .get<GetReviewResponse>(`${BASE_URL}/api/products/${productId}/reviews`)
      .then((res) => res.data);
  },

  async summarizeReviews(productId: number) {
    return axios
      .post<SummarizeResponse>(
        `${BASE_URL}/api/products/${productId}/reviews/summarize`
      )
      .then((res) => res.data);
  },
};
