/**
 * Shared formatting utilities used across course cards, detail pages, and player.
 */

/**
 * Convert total seconds → human-readable string.
 * e.g. 4520 → "1h 15m" | 90 → "1m 30s" | 0 → "—"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds === 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return m > 0 ? `${h}h ${m}m` : `${h}h`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

/**
 * Format price in INR.
 * e.g. 0 → "Free" | 149 → "₹149"
 */
export function formatPrice(price) {
  if (price === 0 || price === "0") return "Free";
  return `₹${price}`;
}

/**
 * Format rating to 1 decimal place.
 * e.g. 4.866 → "4.9" | null → "—"
 */
export function formatRating(rating) {
  if (rating == null) return "—";
  return Number(rating).toFixed(1);
}

/**
 * Fallback avatar from DiceBear when Cloudinary avatar is null.
 */
export function avatarUrl(seed) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed || "user")}`;
}

/**
 * Fallback thumbnail when Cloudinary thumbnail is null.
 */
export const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1541462608141-ad4d1f995502?q=80&w=800&auto=format&fit=crop";
