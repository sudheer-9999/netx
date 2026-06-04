import { parseInstagramEmbedPath } from "@/lib/external-video";

export type InstagramVideoResult = {
  videoUrl: string;
  thumbnailUrl: string | null;
};

const cache = new Map<string, { at: number; data: InstagramVideoResult | null }>();
const CACHE_MS = 30 * 60 * 1000;

const canonicalInstagramUrl = (pageUrl: string): string | null => {
  const path = parseInstagramEmbedPath(pageUrl);
  if (!path) return null;
  return `https://www.instagram.com${path}`;
};

const resolveViaPackage = async (
  canonical: string,
): Promise<InstagramVideoResult | null> => {
  const { instagramGetUrl } = await import("instagram-url-direct");
  const data = await instagramGetUrl(canonical);

  const videoItem = data.media_details?.find((item) => item.type === "video");
  const videoUrl = videoItem?.url ?? data.url_list?.[0] ?? null;
  if (!videoUrl?.startsWith("http")) return null;

  return {
    videoUrl,
    thumbnailUrl: videoItem?.thumbnail ?? null,
  };
};

export const resolveInstagramVideo = async (
  pageUrl: string,
): Promise<InstagramVideoResult | null> => {
  const canonical = canonicalInstagramUrl(pageUrl);
  if (!canonical) return null;

  const cached = cache.get(canonical);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return cached.data;
  }

  try {
    const result = await resolveViaPackage(canonical);
    cache.set(canonical, { at: Date.now(), data: result });
    return result;
  } catch {
    cache.set(canonical, { at: Date.now(), data: null });
    return null;
  }
};
