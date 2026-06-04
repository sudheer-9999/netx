"use client";

import InstagramVideoPlayer from "@/components/InstagramVideoPlayer";
import ModernVideoPlayer from "@/components/ModernVideoPlayer";
import {
  getExternalVideoProvider,
  getVideoEmbedLayout,
  getVideoFrameShellClass,
  getYouTubeEmbedUrl,
  isDirectVideoFileUrl,
} from "@/lib/external-video";

type ExternalVideoEmbedProps = {
  url: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
};

const ExternalVideoEmbed = ({
  url,
  title = "Event video",
  className = "",
  autoplay = false,
  muted = true,
  loop = false,
  controls = true,
}: ExternalVideoEmbedProps) => {
  const provider = getExternalVideoProvider(url);
  const layout = isDirectVideoFileUrl(url)
    ? "vertical"
    : getVideoEmbedLayout(url);
  const shellClass = getVideoFrameShellClass(layout, className);

  if (provider === "instagram") {
    return (
      <InstagramVideoPlayer
        url={url}
        title={title}
        className={className}
        autoplay
        muted
        loop
      />
    );
  }

  const youtubeEmbed = getYouTubeEmbedUrl(url, { autoplay, muted, loop });
  if (youtubeEmbed) {
    return (
      <div className={shellClass}>
        <iframe
          src={youtubeEmbed}
          title={title}
          className="h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md ring-1 ring-white/10">
          YouTube
        </span>
      </div>
    );
  }

  if (isDirectVideoFileUrl(url)) {
    return (
      <ModernVideoPlayer
        src={url}
        title={title}
        layout={layout}
        className={className}
        autoplay={autoplay}
        muted={muted}
        loop={loop}
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${shellClass} flex items-center justify-center px-4 text-sm text-cyan-300 hover:underline`}
    >
      Watch video
    </a>
  );
};

export default ExternalVideoEmbed;
