"use client";

import { useState } from "react";
import ExternalVideoEmbed from "@/components/ExternalVideoEmbed";
import { ADMIN_HEADER } from "@/lib/admin-auth";
import type { EventInfo, EventPoster } from "@/lib/events";
import { parseApiJson } from "@/lib/parse-api-response";

type EventPosterManagerProps = {
  eventId: string | null;
  isNew: boolean;
  poster: EventPoster | null;
  adminKey: string;
  onPosterChange: (poster: EventPoster | null, event?: EventInfo) => void;
};

const EventPosterManager = ({
  eventId,
  isNew,
  poster,
  adminKey,
  onPosterChange,
}: EventPosterManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  if (isNew || !eventId) {
    return (
      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        Save the event first, then set one poster (Cloudinary image or YouTube/Instagram video).
      </p>
    );
  }

  const uploadPosterImage = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("kind", "image");
      formData.append("file", file);

      const res = await fetch("/api/events/poster", {
        method: "POST",
        headers: { [ADMIN_HEADER]: adminKey },
        body: formData,
      });
      const { data, error: apiError } = await parseApiJson<{
        error?: string;
        poster?: EventPoster;
        event?: EventInfo;
      }>(res);
      if (apiError || !data?.poster || !data.event) {
        setError(apiError || data?.error || "Poster upload failed.");
        return;
      }
      onPosterChange(data.poster, data.event);
    } catch {
      setError("Network error during poster upload.");
    } finally {
      setUploading(false);
    }
  };

  const savePosterVideo = async () => {
    setError("");
    setSavingVideo(true);
    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("kind", "video");
      formData.append("url", videoUrl.trim());

      const res = await fetch("/api/events/poster", {
        method: "POST",
        headers: { [ADMIN_HEADER]: adminKey },
        body: formData,
      });
      const { data, error: apiError } = await parseApiJson<{
        error?: string;
        poster?: EventPoster;
        event?: EventInfo;
      }>(res);
      if (apiError || !data?.poster || !data.event) {
        setError(apiError || data?.error || "Failed to save video link.");
        return;
      }
      setVideoUrl("");
      onPosterChange(data.poster, data.event);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setSavingVideo(false);
    }
  };

  const removePoster = async () => {
    if (!confirm("Remove the event poster from the site popup?")) {
      return;
    }
    setError("");
    setRemoving(true);
    try {
      const res = await fetch(
        `/api/events/poster?eventId=${encodeURIComponent(eventId)}`,
        { method: "DELETE", headers: { [ADMIN_HEADER]: adminKey } },
      );
      const { data, error: apiError } = await parseApiJson<{
        error?: string;
        event?: EventInfo;
      }>(res);
      if (apiError) {
        setError(apiError);
        return;
      }
      onPosterChange(null, data?.event);
    } catch {
      setError("Network error while removing poster.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">
        One poster only — upload an image to Cloudinary <strong>or</strong> paste a
        YouTube / Instagram link for video. Shown in the site popup.
      </p>

      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
          {uploading ? "Uploading…" : "Set poster image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading || savingVideo || removing}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadPosterImage(file);
              e.target.value = "";
            }}
          />
        </label>
        {poster && (
          <button
            type="button"
            disabled={removing || uploading || savingVideo}
            onClick={() => void removePoster()}
            className="rounded-md border border-red-500/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            {removing ? "Removing…" : "Remove poster"}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube or Instagram link for video poster"
          className="min-w-0 flex-1 rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
          disabled={uploading || savingVideo || removing}
        />
        <button
          type="button"
          disabled={!videoUrl.trim() || uploading || savingVideo || removing}
          onClick={() => void savePosterVideo()}
          className="rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-500 disabled:opacity-50"
        >
          {savingVideo ? "Saving…" : "Set poster video"}
        </button>
      </div>

      {error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {poster ? (
        <div className="overflow-hidden rounded-lg border border-violet-500/30 bg-zinc-950/50">
          {poster.type === "video" ? (
            <ExternalVideoEmbed url={poster.url} title="Event poster video" />
          ) : (
            <img
              src={poster.url}
              alt="Event poster"
              className="aspect-video w-full max-w-md object-cover"
            />
          )}
          <p className="border-t border-white/10 px-3 py-2 text-xs uppercase text-zinc-400">
            Current poster · {poster.type}
            {poster.type === "video" && (
              <span className="ml-2 normal-case text-zinc-500">(external link)</span>
            )}
          </p>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No poster set — popup will not show.</p>
      )}
    </div>
  );
};

export default EventPosterManager;
