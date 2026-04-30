/**
 * Shared data fetcher for all 25 design variants. Each variant fetches the
 * same content (bouquets, balloons, big roses, reviews) so we can swap
 * layouts without re-querying.
 */
import {
  fetchFeaturedBouquets,
  fetchActiveDiscounts,
  fetchBigRoseBouquets,
  fetchBalloons,
  fetchAuthorBouquets,
  fetchFeaturedReviews,
} from '@/lib/data';

export async function fetchVariantData() {
  const [featured, discounts, bigRoses, balloons, author, reviews] = await Promise.all([
    fetchFeaturedBouquets(8),
    fetchActiveDiscounts(6),
    fetchBigRoseBouquets(6),
    fetchBalloons(6),
    fetchAuthorBouquets(6),
    fetchFeaturedReviews(8),
  ]);
  return { featured, discounts, bigRoses, balloons, author, reviews };
}

export type VariantData = Awaited<ReturnType<typeof fetchVariantData>>;
