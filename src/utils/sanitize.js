/**
 * Input sanitization utilities.
 * All functions return a safe string — they never throw.
 */

/** Strip HTML tags and dangerous characters from any string. */
function stripHtml(str) {
  return String(str ?? '')
    .replace(/<[^>]*>/g, '')        // remove HTML tags
    .replace(/javascript:/gi, '')   // remove JS protocol
    .replace(/on\w+\s*=/gi, '')     // remove inline event attrs (onclick= etc.)
    .replace(/data:/gi, '');        // remove data URIs
}

/**
 * Sanitize a person's name.
 * Allows: letters (any language), spaces, hyphens, apostrophes, periods.
 * Max 100 characters.
 */
export function sanitizeName(str) {
  return stripHtml(str)
    .replace(/[^a-zA-ZÀ-ÿ\u0100-\u024F\u1E00-\u1EFF\s'\-\.]/g, '')
    .slice(0, 100)
    .trimStart();
}

/**
 * Sanitize a short label (endorsement names, org names, etc.).
 * Allows letters, numbers, spaces, and common punctuation.
 * Max 100 characters.
 */
export function sanitizeShortText(str) {
  return stripHtml(str)
    .replace(/[<>"]/g, '')
    .slice(0, 100)
    .trimStart();
}

/**
 * Sanitize a district/number field.
 * Allows alphanumeric and hyphens only (e.g. "4", "12A", "AT-5").
 * Max 20 characters.
 */
export function sanitizeDistrict(str) {
  return stripHtml(str)
    .replace(/[^a-zA-Z0-9\-]/g, '')
    .slice(0, 20);
}

/**
 * Sanitize free-form text (story, bio, etc.).
 * Strips HTML tags but allows all normal text characters.
 * Max 500 characters.
 */
export function sanitizeFreeText(str) {
  return stripHtml(str)
    .replace(/[<>"]/g, '')
    .slice(0, 500);
}
