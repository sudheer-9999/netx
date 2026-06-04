/** YouTube & Instagram links for video — no Cloudinary storage. */

export type ExternalVideoProvider = "youtube" | "instagram";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const INSTAGRAM_HOSTS = new Set([
  "instagram.com",
  "www.instagram.com",
]);

const parseUrl = (raw: string): URL | null => {
  try {
    return new URL(raw.trim());
  } catch {
    return null;
  }
};

export const parseYouTubeVideoId = (url: string): string | null => {
  const parsed = parseUrl(url);
  if (!parsed || !YOUTUBE_HOSTS.has(parsed.hostname)) return null;

  if (parsed.hostname.includes("youtu.be")) {
    const id = parsed.pathname.slice(1).split("/")[0];
    return id || null;
  }

  if (parsed.pathname.startsWith("/embed/")) {
    const id = parsed.pathname.slice(7).split("/")[0];
    return id || null;
  }

  const watchId = parsed.searchParams.get("v");
  if (watchId) return watchId;

  const shortMatch = parsed.pathname.match(/^\/(shorts|live)\/([^/?]+)/);
  if (shortMatch?.[2]) return shortMatch[2];

  return null;
};

export const parseInstagramEmbedPath = (url: string): string | null => {
  const parsed = parseUrl(url);
  if (!parsed || !INSTAGRAM_HOSTS.has(parsed.hostname)) return null;

  const match = parsed.pathname.match(/^\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;

  return `/${match[1]}/${match[2]}/`;
};

export const getExternalVideoProvider = (
  url: string,
): ExternalVideoProvider | null => {
  if (parseYouTubeVideoId(url)) return "youtube";
  if (parseInstagramEmbedPath(url)) return "instagram";
  return null;
};

/** Layout hint for embed containers — reels/shorts are vertical. */
export type VideoEmbedLayout = "vertical" | "square" | "horizontal";

export const getVideoEmbedLayout = (url: string): VideoEmbedLayout => {
  const parsed = parseUrl(url);
  if (!parsed) return "horizontal";

  const path = parsed.pathname;
  if (path.includes("/reel/") || path.includes("/shorts/")) {
    return "vertical";
  }
  if (INSTAGRAM_HOSTS.has(parsed.hostname) && path.match(/^\/(p|tv)\//)) {
    return "square";
  }
  return "horizontal";
};

export const isVerticalVideoUrl = (url: string): boolean =>
  getVideoEmbedLayout(url) === "vertical";

/** Size/aspect classes for video frames (reels, square, landscape). */
export const getVideoFrameSizeClass = (layout: VideoEmbedLayout): string => {
  switch (layout) {
    case "vertical":
      return "mx-auto aspect-[9/16] w-[min(100%,360px,calc(72vh*9/16))]";
    case "square":
      return "mx-auto aspect-square w-full max-w-md";
    default:
      return "aspect-video w-full";
  }
};

export const getVideoFrameShellClass = (
  layout: VideoEmbedLayout,
  className = "",
): string =>
  [
    "group relative overflow-hidden rounded-3xl bg-zinc-950",
    "shadow-[0_8px_40px_rgba(0,0,0,0.45)]",
    "ring-1 ring-white/10",
    "transition-shadow duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_0_32px_-8px_rgba(34,211,238,0.2)]",
    getVideoFrameSizeClass(layout),
    className,
  ]
    .filter(Boolean)
    .join(" ");

export const isExternalVideoUrl = (url: string): boolean =>
  getExternalVideoProvider(url) !== null;

export const validateExternalVideoUrl = (url: string): string | null => {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return "Video link must start with https://";
  }
  if (!isExternalVideoUrl(trimmed)) {
    return "Use a YouTube or Instagram link (post, reel, or short).";
  }
  return null;
};

export const getYouTubeEmbedUrl = (
  url: string,
  options?: { autoplay?: boolean; muted?: boolean; loop?: boolean },
): string | null => {
  const id = parseYouTubeVideoId(url);
  if (!id) return null;

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  if (options?.autoplay) {
    params.set("autoplay", "1");
    params.set("mute", options.muted !== false ? "1" : "0");
    if (options.loop) {
      params.set("loop", "1");
      params.set("playlist", id);
    }
  }

  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
};

export const getInstagramEmbedUrl = (url: string): string | null => {
  const path = parseInstagramEmbedPath(url);
  if (!path) return null;
  return `https://www.instagram.com${path}embed`;
};

export const getYouTubeThumbnailUrl = (url: string): string | null => {
  const id = parseYouTubeVideoId(url);
  if (!id) return null;
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

/** Direct file URL (legacy Cloudinary uploads) — not YouTube/Instagram. */
export const isDirectVideoFileUrl = (url: string): boolean => {
  if (isExternalVideoUrl(url)) return false;
  return /\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("res.cloudinary.com");
};
