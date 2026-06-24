/// <reference lib="dom" />

import { describe, expect, test } from 'bun:test';
import { render } from '@testing-library/react';

import StarRating from './StarRating';

/**
 * StarRating renders 5 stars. Each star is an outline icon (FaRegStar)
 * with a clipped, absolutely-positioned filled icon (FaStar) layered on
 * top via `.text-amber-400` whose `style.width` controls how much of the
 * star appears "filled". There are no accessible roles/text to query by,
 * so these tests read the DOM directly via the container.
 */
describe('StarRating', () => {
  function getOverlayWidths(container: HTMLElement) {
    return Array.from(container.querySelectorAll('.text-amber-400')).map(
      (el) => (el as HTMLElement).style.width
    );
  }

  test('always renders five star placeholders regardless of the rating value', () => {
    const { container } = render(<StarRating value={3} />);
    const stars = container.querySelectorAll('.relative.text-l');
    expect(stars).toHaveLength(5);
  });

  test('fills no stars when the rating is 0', () => {
    const { container } = render(<StarRating value={0} />);
    expect(getOverlayWidths(container)).toEqual([
      '0%',
      '0%',
      '0%',
      '0%',
      '0%',
    ]);
  });

  test('fills exactly the whole-number stars for an integer rating', () => {
    const { container } = render(<StarRating value={3} />);
    expect(getOverlayWidths(container)).toEqual([
      '100%',
      '100%',
      '100%',
      '0%',
      '0%',
    ]);
  });

  test('partially fills the next star for a decimal rating', () => {
    const { container } = render(<StarRating value={3.5} />);
    expect(getOverlayWidths(container)).toEqual([
      '100%',
      '100%',
      '100%',
      '50%',
      '0%',
    ]);
  });

  test('partially fills the first star for a rating below 1', () => {
    const { container } = render(<StarRating value={0.5} />);
    expect(getOverlayWidths(container)).toEqual([
      '50%',
      '0%',
      '0%',
      '0%',
      '0%',
    ]);
  });

  test('fills all five stars for the maximum rating', () => {
    const { container } = render(<StarRating value={5} />);
    expect(getOverlayWidths(container)).toEqual([
      '100%',
      '100%',
      '100%',
      '100%',
      '100%',
    ]);
  });
});
