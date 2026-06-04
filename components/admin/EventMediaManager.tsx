"use client";

import { useState } from "react";
import ExternalVideoEmbed from "@/components/ExternalVideoEmbed";
import { ADMIN_HEADER } from "@/lib/admin-auth";
import type { EventInfo, EventMediaItem } from "@/lib/events";

type EventMediaManagerProps = {
  eventId: string | null;
  isNew: boolean;
  media: EventMediaItem[];
  adminKey: string;
  onMediaChange: (media: EventMediaItem[], event?: EventInfo) => void;
};

const EventMediaManager = ({
  eventId,
  isNew,
  media,
  adminKey,
  onMediaChange,
}: EventMediaManagerProps) => {
  const [uploading, setUploading] = useState(false);
  const [addingVideo, setAddingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoLabel, setVideoLabel] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (isNew || !eventId) {
    return (
      <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        Save the event first, then add gallery photos (Cloudinary) and videos (YouTube/Instagram).
      </p>
    );
  }

  const uploadImage = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("kind", "image");
      formData.append("file", file);

      const res = await fetch("/api/events/media", {
        method: "POST",
        headers: { [ADMIN_HEADER]: adminKey },
        body: formData,
      });
      const data = (await res.json()) as {
        error?: string;
        item?: EventMediaItem;
        event?: EventInfo;
      };
      if (!res.ok || !data.item || !data.event) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      onMediaChange(data.event.media, data.event);
    } catch {
      setError("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const addVideoLink = async () => {
    setError("");
    setAddingVideo(true);
    try {
      const formData = new FormData();
      formData.append("eventId", eventId);
      formData.append("kind", "video");
      formData.append("url", videoUrl.trim());
      if (videoLabel.trim()) {
        formData.append("label", videoLabel.trim());
      }

      const res = await fetch("/api/events/media", {
        method: "POST",
        headers: { [ADMIN_HEADER]: adminKey },
        body: formData,
      });
      const data = (await res.json()) as {
        error?: string;
        item?: EventMediaItem;
        event?: EventInfo;
      };
      if (!res.ok || !data.item || !data.event) {
        setError(data.error ?? "Failed to add video link.");
        return;
      }
      setVideoUrl("");
      setVideoLabel("");
      onMediaChange(data.event.media, data.event);
    } catch {
      setError("Network error while adding video.");
    } finally {
      setAddingVideo(false);
    }
  };

  const deleteMedia = async (mediaId: string) => {
    if (!confirm("Remove this item from the gallery?")) return;
    setError("");
    setDeletingId(mediaId);
    try {
      const res = await fetch(
        `/api/events/media?eventId=${encodeURIComponent(eventId)}&mediaId=${encodeURIComponent(mediaId)}`,
        {
          method: "DELETE",
          headers: { [ADMIN_HEADER]: adminKey },
        },
      );
      const data = (await res.json()) as {
        error?: string;
        event?: EventInfo;
        partial?: boolean;
      };
      if (!res.ok && !data.event) {
        setError(data.error ?? "Delete failed.");
        return;
      }
      if (data.event) {
        onMediaChange(data.event.media, data.event);
      }
      if (data.partial && data.error) {
        setError(data.error);
      }
    } catch {
      setError("Network error during delete.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-zinc-500">
        Images upload to Cloudinary. Videos use YouTube or Instagram links — no Cloudinary storage.
      </p>
      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500">
          {uploading ? "Uploading…" : "+ Upload image"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={uploading || addingVideo}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadImage(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      <div className="space-y-2 rounded-lg border border-white/10 bg-zinc-950/40 p-3">
        <p className="text-xs font-medium text-zinc-400">Add gallery video (link)</p>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="YouTube or Instagram URL"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
          disabled={uploading || addingVideo}
        />
        <input
          type="text"
          value={videoLabel}
          onChange={(e) => setVideoLabel(e.target.value)}
          placeholder="Optional label"
          className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
          disabled={uploading || addingVideo}
        />
        <button
          type="button"
          disabled={!videoUrl.trim() || uploading || addingVideo}
          onClick={() => void addVideoLink()}
          className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500 disabled:opacity-50"
        >
          {addingVideo ? "Adding…" : "+ Add video link"}
        </button>
      </div>

      {error && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {media.length === 0 ? (
        <p className="text-sm text-zinc-500">No gallery items yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {media.map((item) => (
            <li
              key={item.id}
              className="overflow-hidden rounded-lg border border-white/10 bg-zinc-950/50"
            >
              {item.type === "video" ? (
                <ExternalVideoEmbed
                  url={item.url}
                  title={item.label ?? "Gallery video"}
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.label ?? "Event media"}
                  className="aspect-video w-full object-cover"
                />
              )}
              <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2">
                <span className="text-xs uppercase text-zinc-400">
                  {item.type}
                  {item.type === "video" && (
                    <span className="ml-1 normal-case text-zinc-500">· link</span>
                  )}
                </span>
                <button
                  type="button"
                  disabled={deletingId === item.id}
                  onClick={() => void deleteMedia(item.id)}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  {deletingId === item.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventMediaManager;
