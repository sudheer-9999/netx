"use client";

import EventMediaGrid from "@/components/EventMediaGrid";
import type { EventInfo } from "@/lib/events";

type EventMediaGalleryProps = {
  event: EventInfo;
  className?: string;
};

const EventMediaGallery = ({ event, className = "" }: EventMediaGalleryProps) => {
  if (event.media.length === 0) return null;

  return (
    <div className={`mt-8 ${className}`}>
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
        Gallery
      </h4>
      <EventMediaGrid items={event.media} eventName={event.name} />
    </div>
  );
};

export default EventMediaGallery;
