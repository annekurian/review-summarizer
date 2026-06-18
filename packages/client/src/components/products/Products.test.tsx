/// <reference lib="dom" />

import { afterEach, beforeEach, describe, expect, spyOn, test } from 'bun:test';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Products from './Products';
import ProductDetail from './ProductDetail';
import { productsAPI, type Product } from './productsAPI';
import { reviewsApi } from '../reviews/reviewsApi';

/**
 * Renders <Products /> wrapped in the two providers it depends on:
 * - QueryClientProvider, because the component calls useQuery internally
 * - MemoryRouter, because each product card is wrapped in a <Link>
 *
 * A fresh QueryClient is created per render so query cache from one test
 * never leaks into another (especially important since several tests use
 * the same default limit/queryKey).
 */
function renderProducts(limit?: number) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // fail fast instead of retrying in error tests
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Products limit={limit} />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

/**
 * Renders <ProductDetail /> at a route matching /products/:id so
 * useParams() resolves correctly. Note: ProductDetail already renders
 * <ReviewList /> internally once a product loads, so it must NOT be
 * rendered again here as a sibling.
 */
function renderProductDetail(id: number = 5) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }, // fail fast instead of retrying in error tests
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/products/${id}`]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: 'Wireless Earbuds',
    brand: 'Acme',
    price: 49.99,
    rating: 4.5,
    description: 'A great product worth buying.',
    imagePath: 'wireless-earbuds.jpg',
    imageAlt: 'Wireless Earbuds product photo',
    ...overrides,
  } as Product;
}

describe('Products', () => {
  let fetchProductsSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Spy on the real productsAPI.fetchProducts so every test controls
    // exactly what data (or error) the component receives, without
    // touching the network.
    fetchProductsSpy = spyOn(productsAPI, 'fetchProducts');
  });

  afterEach(() => {
    fetchProductsSpy.mockRestore();
  });

  describe('data fetching', () => {
    test('requests products using the limit passed via props', async () => {
      fetchProductsSpy.mockResolvedValue({ products: [makeProduct()] });

      renderProducts(5);

      await waitFor(() => {
        expect(fetchProductsSpy).toHaveBeenCalledWith(5);
      });
    });

    test('falls back to the default limit of 10 when no limit prop is given', async () => {
      fetchProductsSpy.mockResolvedValue({ products: [makeProduct()] });

      renderProducts();

      await waitFor(() => {
        expect(fetchProductsSpy).toHaveBeenCalledWith(10);
      });
    });

    test('calls fetchProducts exactly once per render', async () => {
      fetchProductsSpy.mockResolvedValue({ products: [makeProduct()] });

      renderProducts();

      await waitFor(() => {
        expect(fetchProductsSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('loading state', () => {
    test('shows a loading message while products are being fetched', async () => {
      // A promise that never resolves keeps the query in its loading
      // state for the lifetime of the test, so we can assert on it
      // without racing against the fetch actually completing.
      fetchProductsSpy.mockReturnValue(new Promise(() => {}));

      renderProducts();

      expect(
        await screen.findByText('Loading products...')
      ).toBeInTheDocument();
    });

    test('does not render any product cards while loading', async () => {
      fetchProductsSpy.mockReturnValue(new Promise(() => {}));

      renderProducts();

      await screen.findByText('Loading products...');
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });

    test('does not show the error or empty-state message while loading', async () => {
      fetchProductsSpy.mockReturnValue(new Promise(() => {}));

      renderProducts();

      await screen.findByText('Loading products...');
      expect(
        screen.queryByText('Could not fetch products. Try again!')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('No products available. Try again!')
      ).not.toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    test('shows an error message when fetching products fails', async () => {
      fetchProductsSpy.mockRejectedValue(new Error('Network error'));

      renderProducts();

      expect(
        await screen.findByText('Could not fetch products. Try again!')
      ).toBeInTheDocument();
    });

    test('does not render any product cards when the fetch fails', async () => {
      fetchProductsSpy.mockRejectedValue(new Error('Network error'));

      renderProducts();

      await screen.findByText('Could not fetch products. Try again!');
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
  });

  describe('empty state', () => {
    test('shows a message when no products are returned', async () => {
      fetchProductsSpy.mockResolvedValue({ products: [] });

      renderProducts();

      expect(
        await screen.findByText('No products available. Try again!')
      ).toBeInTheDocument();
    });

    test('does not render any product cards when there are no products', async () => {
      fetchProductsSpy.mockResolvedValue({ products: [] });

      renderProducts();

      await screen.findByText('No products available. Try again!');
      expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
  });

  describe('rendering product cards', () => {
    test('renders a card for each fetched product', async () => {
      const products = [
        makeProduct({ id: 1, name: 'Wireless Earbuds' }),
        makeProduct({ id: 2, name: 'Bluetooth Speaker' }),
        makeProduct({ id: 3, name: 'Smart Watch' }),
      ];
      fetchProductsSpy.mockResolvedValue({ products });

      renderProducts();

      const cards = await screen.findAllByRole('link');
      expect(cards).toHaveLength(products.length);
    });

    test('renders the name of every fetched product', async () => {
      const products = [
        makeProduct({ id: 1, name: 'Wireless Earbuds' }),
        makeProduct({ id: 2, name: 'Bluetooth Speaker' }),
      ];
      fetchProductsSpy.mockResolvedValue({ products });

      renderProducts();

      await screen.findAllByRole('link');

      for (const product of products) {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      }
    });

    test('renders the brand and price of every fetched product', async () => {
      const products = [
        makeProduct({
          id: 1,
          name: 'Wireless Earbuds',
          brand: 'Boss',
          price: 129.99,
        }),
      ];
      fetchProductsSpy.mockResolvedValue({ products });

      renderProducts();

      await screen.findAllByRole('link');

      for (const product of products) {
        expect(screen.getByText(product.brand)).toBeInTheDocument();
        expect(screen.getByText(`$${product.price}`)).toBeInTheDocument();
      }
    });

    // test('renders the rating of every fetched product', async () => {
    //   const products = [
    //     makeProduct({
    //       id: 1,
    //       rating: 4,
    //     }),
    //   ];
    //   fetchProductsSpy.mockResolvedValue({ products });

    //   renderProducts();

    //   const icons = await screen.findAllByRole('FaRegStar');
    //   expect(icons).toHaveLength(4);
    // });

    test('links each product card to its own product detail page', async () => {
      const products = [makeProduct({ id: 42, name: 'Wireless Earbuds' })];
      fetchProductsSpy.mockResolvedValue({ products });

      renderProducts();

      const link = await screen.findByRole('link', {
        name: /wireless earbuds/i,
      });
      expect(link).toHaveAttribute('href', '/products/42');
    });

    test('renders exactly one card per product even with a single product', async () => {
      fetchProductsSpy.mockResolvedValue({
        products: [makeProduct({ id: 1, name: 'Solo Product' })],
      });

      renderProducts();

      const cards = await screen.findAllByRole('link');
      expect(cards).toHaveLength(1);
    });
  });

  describe('rendering product detail', () => {
    let fetchProductSpy: ReturnType<typeof spyOn>;
    let fetchReviewsSpy: ReturnType<typeof spyOn>;

    beforeEach(() => {
      // Spy on the real productsAPI.fetchProducts so every test controls
      // exactly what data (or error) the component receives, without
      // touching the network.
      fetchProductSpy = spyOn(productsAPI, 'fetchProduct');
      fetchReviewsSpy = spyOn(reviewsApi, 'fetchReviews');
      // ProductDetail renders <ReviewList /> internally for any product
      // with a non-zero id, so its fetch needs a default resolved value
      // even in tests that aren't about reviews at all.
      fetchReviewsSpy.mockResolvedValue({ reviews: [] });
    });

    afterEach(() => {
      fetchProductSpy.mockRestore();
      fetchReviewsSpy.mockRestore();
    });

    test('requests the product using the id from the URL parameter', async () => {
      fetchProductSpy.mockResolvedValue({ product: makeProduct({ id: 1 }) });

      renderProductDetail(1);

      await waitFor(() => {
        expect(fetchProductSpy).toHaveBeenCalledWith(1);
      });
    });

    test('renders the description of the product', async () => {
      const product = makeProduct({
        id: 3,
        description: '27-inch 4K UHD monitor with IPS panel and HDR support',
      });
      fetchProductSpy.mockResolvedValue({ product });

      renderProductDetail(3);

      // "h2" is not a valid ARIA role — the role for an <h2> is
      // "heading" with level: 2.
      await screen.findByRole('heading', { level: 2 });
      // findByText returns a Promise and must be awaited before
      // asserting on the resolved element.
      expect(await screen.findByText(/UHD monitor/i)).toBeInTheDocument();
    });
  });
});
