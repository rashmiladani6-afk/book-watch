const GARBA_PROXY_BASE = "/garba-auth";

/**
 * Resolves Garba Town asset paths (images, files) through the app proxy.
 * Relative paths from the API are served via /garba-auth in dev and Vercel rewrites in prod.
 */
export const resolveGarbaAssetUrl = (
  assetPath: string | null | undefined,
  fallback?: string | null,
): string | null => {
  if (!assetPath?.trim()) return fallback ?? null;

  const normalized = assetPath.trim();
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }

  return `${GARBA_PROXY_BASE}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
};

export const GARBA_PROXY_PATH = GARBA_PROXY_BASE;
