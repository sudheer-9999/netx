"use client";

import { useCallback, useEffect, useState } from "react";
import { getPopupMedia, type EventInfo } from "@/lib/events";
import ExternalVideoEmbed from "@/components/ExternalVideoEmbed";
import { getVideoEmbedLayout } from "@/lib/external-video";
import {
  WHATSAPP_CHANNEL_LABEL,
  WHATSAPP_CHANNEL_URL,
} from "@/lib/site-links";

const popupStorageKey = (eventId: string) => `netx-event-popup-seen-${eventId}`;

const EventImagePopup = () => {
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { liveEvent: EventInfo | null };
        const live = data.liveEvent;
        if (
          cancelled ||
          !live ||
          live.status === "completed" ||
          !getPopupMedia(live)
        ) {
          return;
        }

        const seen = sessionStorage.getItem(popupStorageKey(live.id));
        if (seen) return;

        setEvent(live);
        setOpen(true);
      } catch {
        // no popup on error
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const closePopup = useCallback(() => {
    if (event) {
      sessionStorage.setItem(popupStorageKey(event.id), "1");
    }
    setOpen(false);
  }, [event]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closePopup]);

  if (!open || !event) return null;

  const popupMedia = getPopupMedia(event);
  if (!popupMedia) return null;

  const title = event.subtitle ? `${event.name} – ${event.subtitle}` : event.name;
  const videoLayout =
    popupMedia.type === "video" ? getVideoEmbedLayout(popupMedia.url) : null;
  const modalMaxWidth =
    videoLayout === "vertical"
      ? "max-w-[min(100%,380px)]"
      : videoLayout === "square"
        ? "max-w-md"
        : "max-w-lg";

  return (
    <div
      className="fixed inset-0 z-[10000001] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-popup-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Close event poster"
        onClick={closePopup}
      />
      <div className={`relative z-10 w-full ${modalMaxWidth} scale-100 opacity-100 transition-all duration-300`}>
        <div className="overflow-hidden rounded-2xl border border-cyan-300/30 bg-zinc-950 shadow-2xl shadow-cyan-500/10">
          {popupMedia.type === "video" ? (
            <div className="p-1">
              <ExternalVideoEmbed
                url={popupMedia.url}
                title={title}
                autoplay
                muted
                loop
                className="!mx-0 !w-full !max-w-none rounded-xl"
              />
            </div>
          ) : (
            <img
              src={popupMedia.url}
              alt={title}
              className="max-h-[70vh] w-full object-cover"
            />
          )}
          <div className="border-t border-white/10 bg-zinc-950/95 px-5 py-4">
            <p id="event-popup-title" className="text-lg font-semibold text-white">
              {title}
            </p>
            <p className="mt-1 text-sm text-zinc-400">{event.dateLabel}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Book on Konfhub
              </a>
              {event.districtLink && (
                <a
                  href={event.districtLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-orange-400/40 bg-orange-500/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-500/20"
                >
                  Book on District
                </a>
              )}
            </div>
            <a
              href={WHATSAPP_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-green-500/40 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500/20"
            >
              {WHATSAPP_CHANNEL_LABEL}
            </a>
            <button
              type="button"
              onClick={closePopup}
              className="mt-3 w-full text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Continue browsing
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={closePopup}
          className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-zinc-900 text-lg text-white shadow-lg hover:bg-zinc-800"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default EventImagePopup;
