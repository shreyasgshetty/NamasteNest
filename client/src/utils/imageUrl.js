/**
 * Resolves a stored image entry to a displayable URL.
 *
 * Handles three formats:
 *  1. Cloudinary JSON object  → '{"url":"https://...","public_id":"namastenest/..."}'
 *  2. Full URL already        → 'https://res.cloudinary.com/...'
 *  3. Legacy local filename   → '1779623901185-669362.jpeg'
 */
const UPLOADS = import.meta.env.VITE_UPLOADS_URL;

export function resolveImageUrl(img) {
  if (!img) return null;

  // Try to parse as JSON (new Cloudinary format)
  try {
    const parsed = JSON.parse(img);
    if (parsed?.url) return parsed.url;
  } catch {
    // Not JSON — fall through
  }

  // Already a full URL
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  // Legacy local filename — prefix with uploads URL
  return `${UPLOADS}/${img}`;
}

/**
 * Resolves an array of stored image entries to displayable URLs.
 */
export function resolveImages(images) {
  if (!images?.length) return [];
  return images.map(resolveImageUrl).filter(Boolean);
}
