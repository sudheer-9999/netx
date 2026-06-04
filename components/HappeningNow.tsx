"use client";

import React, { useEffect, useState } from "react";
import ElectricBorder from "./UI/ElectricBorder";
import { formatTicketTiersLine, type EventInfo } from "@/lib/events";
import { WHATSAPP_CHANNEL_LABEL, WHATSAPP_CHANNEL_URL } from "@/lib/site-links";

const HappeningNow = () => {
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadEvent = async () => {
      try {
        const response = await fetch("/api/events", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to load event");
        const data = (await response.json()) as { liveEvent: EventInfo | null };
        if (!cancelled) setEvent(data.liveEvent ?? null);
      } catch {
        if (!cancelled) setEvent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEvent();

    const onFocus = () => {
      void loadEvent();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const title = event
    ? event.subtitle
      ? `${event.name} – ${event.subtitle}`
      : event.name
    : "Madhuram Chapter 3 – Let's jammify";

  const locationLine = event
    ? event.venueAddress
      ? `${event.venue}, ${event.venueAddress}`
      : `${event.venue}, ${event.city}`
    : "Hotel K Fortune, Kurnool";

  const ticketLine = event
    ? event.ticketTiers.length > 0
      ? formatTicketTiersLine(event.ticketTiers)
      : "Entry details coming soon"
    : "Entry from ₹269";

  if (!loading && !event) {
    return (
      <div className="my-4rect w-full md:w-1/2 container">
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-zinc-400">
          <p className="text-lg text-zinc-200">No upcoming events right now</p>
          <p className="mt-2 text-sm">
            Check back soon or follow us for the next NetX experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4rect w-full container">
      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.12}
        style={{ borderRadius: 16 }}
      >
        <div>
          <div className="grid grid-cols-1 items-start">
            <div className="md:col-span-3 rounded-lg border border-white/10 p-6 bg-white/5">
              <h3 className="text-2xl font-semibold">
                {loading ? "Loading event…" : title}
              </h3>
              <ul className="mt-4 space-y-2 text-zinc-300">
                <li>📍 {loading ? "…" : locationLine}</li>
                <li>📅 {loading ? "…" : event?.dateLabel}</li>
                <li>
                  🕖{" "}
                  {loading
                    ? "…"
                    : event?.gatesOpenLabel
                      ? `Gates ${event.gatesOpenLabel} · Event ${event.timeLabel}`
                      : event?.timeLabel}
                </li>
                <li>🎟 {loading ? "…" : ticketLine}</li>
                {!loading && event?.dressCode && (
                  <li>👗 Dress code: {event.dressCode}</li>
                )}
                {!loading && event?.features && event.features.length > 0 && (
                  <li>✨ {event.features.join(" · ")}</li>
                )}
              </ul>
              <div className="mt-4 inline-flex items-center gap-2 text-orange-400">
                🔥 Limited Spots Available
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={
                    event?.registrationLink ??
                    "https://konfhub.com/madhuram-chapter-3"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-white hover:bg-white/10 transition-colors"
                >
                  Book on Konfhub
                </a>
                <a
                  href={
                    event?.districtLink ??
                    "https://www.district.in/events/madhuram-chapter-3-jun13-2026-buy-tickets"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-orange-400/40 bg-orange-500/10 px-5 py-2.5 text-white hover:bg-orange-500/20 transition-colors"
                >
                  Book on District
                </a>
                <a
                  href={WHATSAPP_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md border border-green-500/40 bg-green-500/10 px-5 py-2.5 text-white hover:bg-green-500/20 transition-colors"
                >
                  {WHATSAPP_CHANNEL_LABEL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
};

export default HappeningNow;
