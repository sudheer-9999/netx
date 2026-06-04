"use client";

import { useEffect, useState } from "react";
import ModernVideoPlayer from "@/components/ModernVideoPlayer";
import {
  getVideoEmbedLayout,
  getVideoFrameShellClass,
  type VideoEmbedLayout,
} from "@/lib/external-video";

type InstagramVideoPlayerProps = {
  url: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
};

const InstagramVideoPlayer = ({
  url,
  title = "Instagram video",
  className = "",
  autoplay = true,
  muted = true,
  loop = true,
}: InstagramVideoPlayerProps) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  const layout = getVideoEmbedLayout(url);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch(
          `/api/instagram-video?url=${encodeURIComponent(url)}`,
          { cache: "no-store" },
        );
        const data = (await res.json()) as {
          videoUrl?: string;
          thumbnailUrl?: string | null;
        };
        if (cancelled) return;
        if (!res.ok || !data.videoUrl) {
          setFailed(true);
          return;
        }
        setVideoUrl(data.videoUrl);
        setPosterUrl(data.thumbnailUrl ?? null);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (loading) {
    return (
      <LoadingFrame layout={layout} className={className} poster={posterUrl} />
    );
  }

  if (videoUrl) {
    return (
      <ModernVideoPlayer
        src={videoUrl}
        poster={posterUrl}
        title={title}
        layout={layout}
        className={className}
        autoplay={autoplay}
        muted={muted}
        loop={loop}
      />
    );
  }

  if (failed) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${getVideoFrameShellClass(layout, className)} relative flex items-end justify-center`}
      >
        {posterUrl && (
          <img
            src={posterUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <span className="relative mb-8 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/15">
          Open on Instagram →
        </span>
      </a>
    );
  }

  return null;
};

const LoadingFrame = ({
  layout,
  className,
  poster,
}: {
  layout: VideoEmbedLayout;
  className?: string;
  poster?: string | null;
}) => (
  <div className={getVideoFrameShellClass(layout, className)}>
    {poster ? (
      <img
        src={poster}
        alt=""
        className="absolute inset-0 h-full w-full object-cover blur-sm brightness-75"
      />
    ) : null}
    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-cyan-500/10 via-zinc-900 to-violet-500/10" />
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
      <span className="text-xs text-zinc-400">Loading reel…</span>
    </div>
  </div>
);

export default InstagramVideoPlayer;
