/**
 * Resolves hero video URL to a production-safe path.
 * - Replaces any localhost/development URLs (e.g. http://localhost:3000/videos/bridal-hero.webm) with relative production path /videos/bridal-hero.webm
 * - Preserves Sanity CDN asset URLs
 * - Defaults to /videos/bridal-hero.mp4 if empty or invalid
 */
export function resolveHeroVideoUrl(url?: any): string {
  if (!url) return "/videos/bridal-hero.mp4";

  // If Sanity asset object format
  if (typeof url === "object" && url !== null) {
    if (url.asset?.url) return url.asset.url;
    if (url.url) return url.url;
  }

  if (typeof url === "string") {
    const trimmed = url.trim();
    if (!trimmed) return "/videos/bridal-hero.mp4";

    // Handle any localhost or 127.0.0.1 hardcoded development URLs
    if (trimmed.includes("localhost") || trimmed.includes("127.0.0.1")) {
      try {
        const parsed = new URL(trimmed);
        if (parsed.pathname && parsed.pathname !== "/") {
          return parsed.pathname;
        }
      } catch {
        const relative = trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, "");
        return relative.startsWith("/") ? relative : `/${relative}`;
      }
      return "/videos/bridal-hero.mp4";
    }

    return trimmed;
  }

  return "/videos/bridal-hero.mp4";
}
