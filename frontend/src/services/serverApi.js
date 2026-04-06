/**
 * Server-side API fetch utility.
 *
 * Used exclusively in async Server Components (no access to browser APIs,
 * cookies, or in-memory tokens). Public endpoints only.
 *
 * Uses Next.js fetch with ISR revalidation so pages aren't re-fetched on
 * every request in production.
 */

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * @param {string} endpoint  - e.g. "/courses" or "/courses/abc123"
 * @param {{ revalidate?: number }} opts
 * @returns {Promise<any | null>} Parsed JSON `data` field, or null on error
 */
export async function serverFetch(endpoint, { revalidate = 60 } = {}) {
  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      next: { revalidate },
    });
    if (!res.ok) return null;
    const json = await res.json();
    // Backend shape: { success, message, data }
    return json.data ?? null;
  } catch {
    return null;
  }
}
