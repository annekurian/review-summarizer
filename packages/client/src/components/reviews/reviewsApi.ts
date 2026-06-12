import axios from 'axios';

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
      .get<GetReviewResponse>(`/api/products/${productId}/reviews`)
      .then((res) => res.data);
  },

  async summarizeReviews(productId: number) {
    return axios
      .post<SummarizeResponse>(`/api/products/${productId}/reviews/summarize`)
      .then((res) => res.data);
  },
};
