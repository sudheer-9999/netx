"use client";

import { motion } from "framer-motion";
import ExternalVideoEmbed from "@/components/ExternalVideoEmbed";
import { getVideoEmbedLayout } from "@/lib/external-video";
import type { EventMediaItem } from "@/lib/events";

type EventMediaGridProps = {
  items: EventMediaItem[];
  eventName: string;
  className?: string;
};

const sectionFade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PhotoTile = ({
  item,
  eventName,
  tall,
}: {
  item: EventMediaItem;
  eventName: string;
  tall?: boolean;
}) => (
  <figure className="group/photo break-inside-avoid mb-4 overflow-hidden rounded-2xl ring-1 ring-white/[0.08] transition-all duration-300 hover:ring-white/20">
    <div className="relative overflow-hidden">
      <img
        src={item.url}
        alt={item.label ?? `${eventName} photo`}
        className={`w-full object-cover transition-transform duration-700 group-hover/photo:scale-[1.03] ${
          tall ? "aspect-[3/4]" : "aspect-square"
        }`}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100" />
    </div>
    {item.label && (
      <figcaption className="px-3 py-2.5 text-[11px] font-medium tracking-wide text-zinc-500">
        {item.label}
      </figcaption>
    )}
  </figure>
);

const EventMediaGrid = ({ items, eventName, className = "" }: EventMediaGridProps) => {
  if (items.length === 0) return null;

  const videos = items.filter((i) => i.type === "video");
  const photos = items.filter((i) => i.type === "image");

  return (
    <div className={`space-y-12 ${className}`}>
      {videos.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={sectionFade}
        >
          <div className="mb-5 flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-white">
              Reels & video
            </h3>
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            <span className="font-mono text-[10px] text-zinc-600">
              {String(videos.length).padStart(2, "0")}
            </span>
          </div>

          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-12 lg:gap-5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
            {videos.map((item, index) => {
              const layout = getVideoEmbedLayout(item.url);
              const isVertical = layout === "vertical";

              return (
                <div
                  key={item.id}
                  className={`snap-center shrink-0 lg:shrink ${
                    isVertical
                      ? "w-[min(72vw,280px)] lg:col-span-4 lg:w-auto"
                      : "w-[min(85vw,480px)] lg:col-span-6 lg:w-auto"
                  } ${index === 0 && videos.length > 1 ? "lg:col-span-5" : ""}`}
                >
                  <ExternalVideoEmbed
                    url={item.url}
                    title={item.label ?? `${eventName} video`}
                    className={isVertical ? "!mx-0 w-full" : undefined}
                  />
                  {item.label && (
                    <p className="mt-2.5 text-[11px] font-medium tracking-wide text-zinc-500">
                      {item.label}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.section>
      )}

      {photos.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={sectionFade}
        >
          <div className="mb-5 flex items-center gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.28em] text-white">
              Photos
            </h3>
            <span className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            <span className="font-mono text-[10px] text-zinc-600">
              {String(photos.length).padStart(2, "0")}
            </span>
          </div>

          <div className="columns-2 gap-4 md:columns-3 lg:gap-5">
            {photos.map((item, index) => (
              <PhotoTile
                key={item.id}
                item={item}
                eventName={eventName}
                tall={index % 3 === 0}
              />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default EventMediaGrid;
