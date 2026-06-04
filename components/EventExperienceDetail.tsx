"use client";

import { motion } from "framer-motion";
import EventMediaGrid from "@/components/EventMediaGrid";
import { getEventAllMedia, type EventInfo } from "@/lib/events";

const statusStyles: Record<
  EventInfo["status"],
  { label: string; dot: string }
> = {
  active: { label: "Live now", dot: "bg-green-400" },
  upcoming: { label: "Upcoming", dot: "bg-cyan-400" },
  completed: { label: "Archive", dot: "bg-zinc-500" },
};

type EventExperienceDetailProps = {
  event: EventInfo;
};

const EventExperienceDetail = ({ event }: EventExperienceDetailProps) => {
  const media = getEventAllMedia(event);
  const title = event.subtitle ? `${event.name} – ${event.subtitle}` : event.name;
  const status = statusStyles[event.status];
  const photoCount = media.filter((m) => m.type === "image").length;
  const videoCount = media.filter((m) => m.type === "video").length;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start lg:gap-14 xl:gap-20">
      <motion.aside
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:sticky lg:top-28 lg:pb-12"
      >
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
            {status.label}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h1>

        <dl className="mt-8 space-y-4 border-t border-white/[0.06] pt-8">
          <div>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Date</dt>
            <dd className="mt-1 text-sm text-zinc-300">{event.dateLabel}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Location</dt>
            <dd className="mt-1 text-sm text-zinc-300">{event.city}</dd>
            {event.venue && (
              <dd className="mt-0.5 text-xs text-zinc-500">{event.venue}</dd>
            )}
          </div>
          {media.length > 0 && (
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">Media</dt>
              <dd className="mt-2 flex gap-2">
                {videoCount > 0 && (
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 font-mono text-xs text-zinc-400 ring-1 ring-white/[0.08]">
                    {videoCount}V
                  </span>
                )}
                {photoCount > 0 && (
                  <span className="rounded-full bg-white/[0.04] px-3 py-1 font-mono text-xs text-zinc-400 ring-1 ring-white/[0.08]">
                    {photoCount}P
                  </span>
                )}
              </dd>
            </div>
          )}
        </dl>
      </motion.aside>

      <div className="mt-10 lg:mt-0">
        {media.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-sm text-zinc-500">No media yet.</p>
          </div>
        ) : (
          <EventMediaGrid items={media} eventName={event.name} />
        )}
      </div>
    </div>
  );
};

export default EventExperienceDetail;
