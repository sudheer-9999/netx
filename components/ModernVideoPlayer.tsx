"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import {
  getVideoFrameShellClass,
  type VideoEmbedLayout,
} from "@/lib/external-video";

type ModernVideoPlayerProps = {
  src: string;
  poster?: string | null;
  title?: string;
  layout?: VideoEmbedLayout;
  className?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
};

const ModernVideoPlayer = ({
  src,
  poster,
  title = "Video",
  layout = "horizontal",
  className = "",
  autoplay = true,
  muted: mutedDefault = true,
  loop = true,
}: ModernVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(autoplay);
  const [muted, setMuted] = useState(mutedDefault);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showUi, setShowUi] = useState(true);

  const shellClass = getVideoFrameShellClass(layout, className);

  const revealUi = useCallback(() => {
    setShowUi(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowUi(false);
      }
    }, 2600);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, []);

  const toggleMute = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    revealUi();
  }, [revealUi]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      setPlaying(true);
      revealUi();
    };
    const onPause = () => {
      setPlaying(false);
      setShowUi(true);
    };
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
      }
    };
    const onLoadedData = () => setLoading(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [src, revealUi]);

  useEffect(
    () => () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    [],
  );

  return (
    <div
      className={shellClass}
      onMouseMove={revealUi}
      onTouchStart={revealUi}
      onClick={togglePlay}
      role="button"
      tabIndex={0}
      aria-label={playing ? `Pause ${title}` : `Play ${title}`}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          togglePlay();
        }
      }}
    >
      {loading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-zinc-900">
          {poster ? (
            <img
              src={poster}
              alt=""
              className="h-full w-full scale-105 object-cover blur-sm brightness-75"
            />
          ) : null}
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        title={title}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
      />

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 transition-opacity duration-300 ${
          showUi || !playing ? "opacity-100" : "opacity-0"
        }`}
      />

      {!playing && !loading && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-white/10 shadow-lg ring-1 ring-white/25 backdrop-blur-md transition-transform duration-200 group-hover:scale-105">
            <Play className="ml-1 h-8 w-8 fill-white text-white" />
          </div>
        </div>
      )}

      <div
        className={`absolute inset-x-0 top-0 flex items-start justify-between p-3 transition-opacity duration-300 ${
          showUi || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-md ring-1 ring-white/10">
          {layout === "vertical" ? "Reel" : "Video"}
        </span>
        <button
          type="button"
          onClick={toggleMute}
          className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md ring-1 ring-white/10 transition-colors hover:bg-black/55"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-6">
        <div className="h-1 overflow-hidden rounded-full bg-white/15 backdrop-blur-sm">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-[width] duration-150 ease-linear"
            style={{ width: `${Math.min(progress * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModernVideoPlayer;
