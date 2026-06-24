/// <reference lib="dom" />

import { describe, expect, test } from 'bun:test';
import { render } from '@testing-library/react';

import ReviewSkeleton from './ReviewSkeleton';

/**
 * ReviewSkeleton is a thin wrapper around react-loading-skeleton.
 * Each <Skeleton /> call (width={150}, width={100}, count={2}) renders
 * its own <span className="react-loading-skeleton" />, so a single
 * ReviewSkeleton produces 1 + 1 + 2 = 4 placeholder spans.
 */
describe('ReviewSkeleton', () => {
  test('renders without crashing', () => {
    const { container } = render(<ReviewSkeleton />);
    expect(container).toBeTruthy();
  });

  test('renders four skeleton placeholders', () => {
    const { container } = render(<ReviewSkeleton />);
    const skeletons = container.querySelectorAll('.react-loading-skeleton');
    expect(skeletons).toHaveLength(4);
  });
});
