import fs from "fs";
import path from "path";
import eventsData from "@/local-ai/events.json";
import {
  type EventInfo,
  type EventMediaItem,
  type EventPoster,
  normalizeEvent,
  pickLiveEvent,
} from "@/lib/events";

const EVENTS_FILE = path.join(process.cwd(), "local-ai", "events.json");

type LegacyEventRaw = EventInfo & { imageUrl?: string; videoUrl?: string };

let eventsCache: EventInfo[] = (eventsData as LegacyEventRaw[]).map(
  normalizeEvent,
);

const readEventsFromDisk = (): EventInfo[] => {
  try {
    const raw = fs.readFileSync(EVENTS_FILE, "utf8");
    return (JSON.parse(raw) as LegacyEventRaw[]).map(normalizeEvent);
  } catch {
    return eventsCache;
  }
};

const writeEventsToDisk = (events: EventInfo[]): void => {
  fs.writeFileSync(EVENTS_FILE, `${JSON.stringify(events, null, 2)}\n`, "utf8");
};

export const reloadEvents = (): EventInfo[] => {
  eventsCache = readEventsFromDisk();
  return eventsCache;
};

export const replaceEventById = (event: EventInfo): EventInfo | null => {
  const index = eventsCache.findIndex((item) => item.id === event.id);
  if (index === -1) return null;

  const normalized = normalizeEvent(event);
  eventsCache = [
    ...eventsCache.slice(0, index),
    normalized,
    ...eventsCache.slice(index + 1),
  ];
  writeEventsToDisk(eventsCache);
  return normalized;
};

export const createEvent = (event: EventInfo): EventInfo | "exists" => {
  if (eventsCache.some((item) => item.id === event.id)) return "exists";
  const normalized = normalizeEvent(event);
  eventsCache = [...eventsCache, normalized];
  writeEventsToDisk(eventsCache);
  return normalized;
};

export const deleteEventById = (id: string): boolean => {
  const next = eventsCache.filter((item) => item.id !== id);
  if (next.length === eventsCache.length) return false;
  eventsCache = next;
  writeEventsToDisk(eventsCache);
  return true;
};

export const setEventPoster = (
  eventId: string,
  poster: EventPoster | null,
): EventInfo | null => {
  const index = eventsCache.findIndex((event) => event.id === eventId);
  if (index === -1) return null;

  const updated: EventInfo = { ...eventsCache[index], poster };
  eventsCache = [
    ...eventsCache.slice(0, index),
    updated,
    ...eventsCache.slice(index + 1),
  ];
  writeEventsToDisk(eventsCache);
  return updated;
};

export const appendEventMedia = (
  eventId: string,
  item: EventMediaItem,
): EventInfo | null => {
  const index = eventsCache.findIndex((event) => event.id === eventId);
  if (index === -1) return null;

  const current = eventsCache[index];
  const updated: EventInfo = {
    ...current,
    media: [...current.media, item],
  };

  eventsCache = [
    ...eventsCache.slice(0, index),
    updated,
    ...eventsCache.slice(index + 1),
  ];
  writeEventsToDisk(eventsCache);
  return updated;
};

export const removeEventMedia = (
  eventId: string,
  mediaId: string,
): { event: EventInfo; removed: EventMediaItem } | null => {
  const index = eventsCache.findIndex((event) => event.id === eventId);
  if (index === -1) return null;

  const current = eventsCache[index];
  const removed = current.media.find((item) => item.id === mediaId);
  if (!removed) return null;

  const updated: EventInfo = {
    ...current,
    media: current.media.filter((item) => item.id !== mediaId),
  };

  eventsCache = [
    ...eventsCache.slice(0, index),
    updated,
    ...eventsCache.slice(index + 1),
  ];
  writeEventsToDisk(eventsCache);
  return { event: updated, removed };
};

export const getAllEvents = (): EventInfo[] =>
  eventsCache.map((event) => normalizeEvent(event));

export const getEventById = (id: string): EventInfo | undefined => {
  const event = eventsCache.find((item) => item.id === id);
  return event ? normalizeEvent(event) : undefined;
};

export const getLiveEvent = (): EventInfo | null => {
  const live = pickLiveEvent(eventsCache);
  return live ? normalizeEvent(live) : null;
};
