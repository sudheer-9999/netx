"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { getEventThumbnailUrl, type EventInfo } from "@/lib/events";

const statusLabel: Record<EventInfo["status"], string> = {
  active: "Live",
  upcoming: "Soon",
  completed: "Archive",
};

const statusDot: Record<EventInfo["status"], string> = {
  active: "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]",
  upcoming: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
  completed: "bg-zinc-500",
};

const mediaCount = (event: EventInfo) =>
  (event.poster ? 1 : 0) + event.media.length;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: "easeOut" as const },
  }),
};

const FeaturedCard = ({ event }: { event: EventInfo }) => {
  const thumb = getEventThumbnailUrl(event);
  const title = event.subtitle ? `${event.name} – ${event.subtitle}` : event.name;
  const isReel = event.poster?.type === "video";

  return (
    <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
      <Link
        href={`/experiences/${event.id}`}
        className="group relative block overflow-hidden rounded-[1.75rem] bg-zinc-950 ring-1 ring-white/[0.08] transition-all duration-500 hover:ring-cyan-400/30"
      >
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
          {thumb ? (
            <img
              src={thumb}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
              <Play className="h-12 w-12 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white backdrop-blur-xl ring-1 ring-white/15">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[event.status]}`} />
                {statusLabel[event.status]}
              </span>
              <span className="hidden rounded-full bg-white/10 p-2.5 text-white backdrop-blur-xl ring-1 ring-white/15 transition-transform duration-300 group-hover:rotate-45 sm:block">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </div>

            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-cyan-300/80">
                Featured experience
              </p>
              <h2 className="mt-2 text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              <p className="mt-3 text-sm text-zinc-300 sm:text-base">
                {event.dateLabel} · {event.city}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {isReel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-md">
                    <Play className="h-3 w-3 fill-white" /> Reel
                  </span>
                )}
                {mediaCount(event) > 0 && (
                  <span className="text-xs text-zinc-400">
                    {mediaCount(event)} items
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const EventCard = ({
  event,
  index,
}: {
  event: EventInfo;
  index: number;
}) => {
  const thumb = getEventThumbnailUrl(event);
  const title = event.subtitle ? `${event.name} – ${event.subtitle}` : event.name;
  const isReel = event.poster?.type === "video";
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      initial="hidden"
      animate="show"
      custom={index}
      variants={fadeUp}
      className={index % 3 === 1 ? "sm:mt-8" : ""}
    >
      <Link
        href={`/experiences/${event.id}`}
        className="group block overflow-hidden rounded-3xl bg-zinc-950 ring-1 ring-white/[0.08] transition-all duration-400 hover:-translate-y-1 hover:ring-white/20 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)]"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {thumb ? (
            <img
              src={thumb}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-900">
              <Play className="h-8 w-8 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

          <span className="absolute left-4 top-4 font-mono text-[10px] tracking-widest text-white/40">
            {num}
          </span>
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/90 backdrop-blur-md">
            <span className={`h-1 w-1 rounded-full ${statusDot[event.status]}`} />
            {statusLabel[event.status]}
          </span>

          {isReel && (
            <div className="absolute bottom-20 right-4 rounded-full bg-white/15 p-2 backdrop-blur-md ring-1 ring-white/20">
              <Play className="h-3.5 w-3.5 fill-white text-white" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="text-lg font-semibold leading-snug text-white">{title}</h3>
            <p className="mt-1 text-xs text-zinc-400">{event.city}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

type ExperiencesSectionProps = {
  showStats?: boolean;
  /** Home teaser — featured event only, no "More experiences" grid */
  featuredOnly?: boolean;
};

const ExperiencesSection = ({
  showStats = false,
  featuredOnly = false,
}: ExperiencesSectionProps) => {
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load events");
        const data = (await res.json()) as { events: EventInfo[] };
        if (!cancelled) {
          const sorted = [...(data.events ?? [])].sort(
            (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
          );
          setEvents(sorted);
        }
      } catch {
        if (!cancelled) setEvents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="aspect-[16/10] animate-pulse rounded-[1.75rem] bg-zinc-900/80" />
        {!featuredOnly && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-zinc-900/60" />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-white/10 py-20 text-center text-sm text-zinc-500">
        No experiences yet.
      </p>
    );
  }

  const [featured, ...rest] = events;
  const liveCount = events.filter((e) => e.status === "active").length;

  return (
    <div className="space-y-8 lg:space-y-12">
      {showStats && (
        <div className="flex flex-wrap gap-6 border-b border-white/[0.06] pb-8">
          <div>
            <p className="font-mono text-3xl font-light text-white">{events.length}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">Events</p>
          </div>
          {liveCount > 0 && (
            <div>
              <p className="font-mono text-3xl font-light text-cyan-300">{liveCount}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-zinc-500">Live</p>
            </div>
          )}
        </div>
      )}

      <FeaturedCard event={featured} />

      {!featuredOnly && rest.length > 0 && (
        <div>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
              More experiences
            </h2>
            <span className="font-mono text-xs text-zinc-600">{rest.length} total</span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-5">
            {rest.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperiencesSection;
