/// <reference lib="dom" />

import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ReviewList from './ReviewList';
import { reviewsApi, type Review } from './reviewsApi';

/**
 * Renders <ReviewList /> wrapped in a QueryClientProvider, since the
 * component depends on useQuery/useMutation internally. A fresh
 * QueryClient is created per render so cached data from one test never
 * leaks into another.
 */
function renderReviewList(productId: number = 1) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // fail fast instead of retrying in error tests
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReviewList productId={productId} />
    </QueryClientProvider>
  );
}

function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    id: 1,
    author: 'Jane Doe',
    rating: 4,
    content: 'Great product, highly recommend!',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('ReviewList', () => {
  let fetchReviewsSpy: ReturnType<typeof spyOn>;
  let summarizeReviewsSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Spy on the real reviewsApi methods so every test controls exactly
    // what data (or error) the component receives, without touching the
    // network.
    fetchReviewsSpy = spyOn(reviewsApi, 'fetchReviews');
    summarizeReviewsSpy = spyOn(reviewsApi, 'summarizeReviews');
  });

  afterEach(() => {
    fetchReviewsSpy.mockRestore();
    summarizeReviewsSpy.mockRestore();
  });

  describe('data fetching', () => {
    test('requests reviews using the productId passed via props', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });

      renderReviewList(7);

      await waitFor(() => {
        expect(fetchReviewsSpy).toHaveBeenCalledWith(7);
      });
    });

    test('calls fetchReviews exactly once per render', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });

      renderReviewList();

      await waitFor(() => {
        expect(fetchReviewsSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('loading state', () => {
    test('shows skeleton placeholders while reviews are being fetched', async () => {
      // A promise that never resolves keeps the query in its loading
      // state for the lifetime of the test, so we can assert on it
      // without racing against the fetch actually completing.
      fetchReviewsSpy.mockReturnValue(new Promise(() => {}));

      const { container } = renderReviewList();

      // ReviewList renders 3 <ReviewSkeleton />, each made up of 4
      // react-loading-skeleton placeholder spans, while loading.
      await waitFor(() => {
        expect(
          container.querySelectorAll('.react-loading-skeleton')
        ).toHaveLength(12);
      });
    });

    test('does not show the error or empty-state message while loading', async () => {
      fetchReviewsSpy.mockReturnValue(new Promise(() => {}));

      renderReviewList();

      expect(
        screen.queryByText('Could not fetch reviews. Try again!')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('No reviews available for the product. Try again!')
      ).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    test('shows an error message when fetching reviews fails', async () => {
      fetchReviewsSpy.mockRejectedValue(new Error('Network error'));

      renderReviewList();

      expect(
        await screen.findByText('Could not fetch reviews. Try again!')
      ).toBeInTheDocument();
    });

    test('does not render any reviews when the fetch fails', async () => {
      fetchReviewsSpy.mockRejectedValue(new Error('Network error'));

      renderReviewList();

      await screen.findByText('Could not fetch reviews. Try again!');
      expect(screen.queryByText(makeReview().content)).not.toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    test('shows a message when no reviews are returned', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [] });

      renderReviewList();

      expect(
        await screen.findByText('No reviews available for the product. Try again!')
      ).toBeInTheDocument();
    });
  });

  describe('rendering reviews', () => {
    test('renders the author and content of every fetched review', async () => {
      const reviews = [
        makeReview({ id: 1, author: 'Jane Doe', content: 'Loved it!' }),
        makeReview({ id: 2, author: 'John Smith', content: 'Not bad.' }),
      ];
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews });

      renderReviewList();

      await screen.findByText('Jane Doe');

      for (const review of reviews) {
        expect(screen.getByText(review.author)).toBeInTheDocument();
        expect(screen.getByText(review.content)).toBeInTheDocument();
      }
    });

    test('renders a star rating for every fetched review', async () => {
      const reviews = [
        makeReview({ id: 1, author: 'Jane Doe', rating: 4 }),
        makeReview({ id: 2, author: 'John Smith', rating: 2 }),
      ];
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews });

      const { container } = renderReviewList();

      await screen.findByText('Jane Doe');
      const starWrappers = container.querySelectorAll('.relative.text-l');
      expect(starWrappers).toHaveLength(5 * reviews.length);
    });

    test('renders exactly one entry per review even with a single review', async () => {
      fetchReviewsSpy.mockResolvedValue({
        summary: null,
        reviews: [makeReview({ id: 1, author: 'Solo Reviewer' })],
      });

      renderReviewList();

      await screen.findByText('Solo Reviewer');
      expect(screen.getAllByText('Solo Reviewer')).toHaveLength(1);
    });
  });

  describe('summarization', () => {
    test('shows a Summarize button when no summary exists yet', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });

      renderReviewList();

      expect(
        await screen.findByRole('button', { name: /summarize/i })
      ).toBeInTheDocument();
    });

    test('shows the existing summary instead of the Summarize button when one is already returned', async () => {
      fetchReviewsSpy.mockResolvedValue({
        summary: 'Customers love the build quality.',
        reviews: [makeReview()],
      });

      renderReviewList();

      expect(
        await screen.findByText('Customers love the build quality.')
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /summarize/i })
      ).not.toBeInTheDocument();
    });

    test('requests a summary for the current productId when the Summarize button is clicked', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });
      summarizeReviewsSpy.mockResolvedValue({
        summary: 'Great battery life overall.',
        productId: 9,
      });
      const user = userEvent.setup();

      renderReviewList(9);

      const button = await screen.findByRole('button', { name: /summarize/i });
      await user.click(button);

      await waitFor(() => {
        expect(summarizeReviewsSpy).toHaveBeenCalledWith(9);
      });
    });

    test('displays the generated summary after summarization succeeds', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });
      summarizeReviewsSpy.mockResolvedValue({
        summary: 'Great battery life overall.',
        productId: 9,
      });
      const user = userEvent.setup();

      renderReviewList(9);

      const button = await screen.findByRole('button', { name: /summarize/i });
      await user.click(button);

      expect(
        await screen.findByText('Great battery life overall.')
      ).toBeInTheDocument();
    });

    test('shows a skeleton placeholder while the summary is being generated', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });
      summarizeReviewsSpy.mockReturnValue(new Promise(() => {})); // never resolves
      const user = userEvent.setup();

      const { container } = renderReviewList();

      const button = await screen.findByRole('button', { name: /summarize/i });
      await user.click(button);

      await waitFor(() => {
        expect(
          container.querySelectorAll('.react-loading-skeleton').length
        ).toBeGreaterThan(0);
      });
    });

    test('disables the Summarize button while a summary request is pending', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });
      summarizeReviewsSpy.mockReturnValue(new Promise(() => {})); // never resolves
      const user = userEvent.setup();

      renderReviewList();

      const button = await screen.findByRole('button', { name: /summarize/i });
      await user.click(button);

      await waitFor(() => {
        expect(button).toBeDisabled();
      });
    });

    test('shows an error message when summarization fails', async () => {
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });
      summarizeReviewsSpy.mockRejectedValue(new Error('Summary failed'));
      const user = userEvent.setup();

      renderReviewList();

      const button = await screen.findByRole('button', { name: /summarize/i });
      await user.click(button);

      expect(
        await screen.findByText('Could not summarize reviews. Try again!')
      ).toBeInTheDocument();
    });

    test('does not show a stale summary generated for a different productId', async () => {
      // Covers the `summaryMutation.data?.productId == productId` guard
      // in ReviewList, which exists so a summary from a previously
      // viewed product is never shown against the current one.
      fetchReviewsSpy.mockResolvedValue({ summary: null, reviews: [makeReview()] });
      summarizeReviewsSpy.mockResolvedValue({
        summary: 'Summary for another product.',
        productId: 999,
      });
      const user = userEvent.setup();

      renderReviewList(1);

      const button = await screen.findByRole('button', { name: /summarize/i });
      await user.click(button);

      await waitFor(() => {
        expect(summarizeReviewsSpy).toHaveBeenCalled();
      });

      expect(
        screen.queryByText('Summary for another product.')
      ).not.toBeInTheDocument();
      // No summary applies to this productId, so the button should
      // still be available rather than being replaced by a summary.
      expect(
        await screen.findByRole('button', { name: /summarize/i })
      ).toBeInTheDocument();
    });
  });
});
