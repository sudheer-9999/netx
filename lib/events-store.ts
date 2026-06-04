import {
  ensureBlobSeeded,
  loadEventsFromStorage,
  persistEvents,
} from "@/lib/events-persist";
import {
  type EventInfo,
  type EventMediaItem,
  type EventPoster,
  normalizeEvent,
  pickLiveEvent,
} from "@/lib/events";

let eventsCache: EventInfo[] = [];

const updateCache = (events: EventInfo[]): EventInfo[] => {
  eventsCache = events;
  return eventsCache;
};

export const reloadEvents = async (): Promise<EventInfo[]> => {
  eventsCache = await loadEventsFromStorage();
  return eventsCache;
};

const saveCache = async (): Promise<string | null> => {
  await ensureBlobSeeded(eventsCache);
  return persistEvents(eventsCache);
};

export const replaceEventById = async (
  event: EventInfo,
): Promise<{ event: EventInfo | null; error: string | null }> => {
  const index = eventsCache.findIndex((item) => item.id === event.id);
  if (index === -1) return { event: null, error: null };

  const normalized = normalizeEvent(event);
  updateCache([
    ...eventsCache.slice(0, index),
    normalized,
    ...eventsCache.slice(index + 1),
  ]);

  const error = await saveCache();
  if (error) return { event: null, error };
  return { event: normalized, error: null };
};

export const createEvent = async (
  event: EventInfo,
): Promise<{ event: EventInfo | null; error: string | null; exists?: boolean }> => {
  if (eventsCache.some((item) => item.id === event.id)) {
    return { event: null, error: null, exists: true };
  }
  const normalized = normalizeEvent(event);
  updateCache([...eventsCache, normalized]);

  const error = await saveCache();
  if (error) return { event: null, error };
  return { event: normalized, error: null };
};

export const deleteEventById = async (
  id: string,
): Promise<{ ok: boolean; error: string | null }> => {
  const next = eventsCache.filter((item) => item.id !== id);
  if (next.length === eventsCache.length) return { ok: false, error: null };

  updateCache(next);
  const error = await saveCache();
  if (error) return { ok: false, error };
  return { ok: true, error: null };
};

export const setEventPoster = async (
  eventId: string,
  poster: EventPoster | null,
): Promise<{ event: EventInfo | null; error: string | null }> => {
  const index = eventsCache.findIndex((event) => event.id === eventId);
  if (index === -1) return { event: null, error: null };

  const updated: EventInfo = { ...eventsCache[index], poster };
  updateCache([
    ...eventsCache.slice(0, index),
    updated,
    ...eventsCache.slice(index + 1),
  ]);

  const error = await saveCache();
  if (error) return { event: null, error };
  return { event: updated, error: null };
};

export const appendEventMedia = async (
  eventId: string,
  item: EventMediaItem,
): Promise<{ event: EventInfo | null; error: string | null }> => {
  const index = eventsCache.findIndex((event) => event.id === eventId);
  if (index === -1) return { event: null, error: null };

  const current = eventsCache[index];
  const updated: EventInfo = {
    ...current,
    media: [...current.media, item],
  };

  updateCache([
    ...eventsCache.slice(0, index),
    updated,
    ...eventsCache.slice(index + 1),
  ]);

  const error = await saveCache();
  if (error) return { event: null, error };
  return { event: updated, error: null };
};

export const removeEventMedia = async (
  eventId: string,
  mediaId: string,
): Promise<{ result: { event: EventInfo; removed: EventMediaItem } | null; error: string | null }> => {
  const index = eventsCache.findIndex((event) => event.id === eventId);
  if (index === -1) return { result: null, error: null };

  const current = eventsCache[index];
  const removed = current.media.find((item) => item.id === mediaId);
  if (!removed) return { result: null, error: null };

  const updated: EventInfo = {
    ...current,
    media: current.media.filter((item) => item.id !== mediaId),
  };

  updateCache([
    ...eventsCache.slice(0, index),
    updated,
    ...eventsCache.slice(index + 1),
  ]);

  const error = await saveCache();
  if (error) return { result: null, error };
  return { result: { event: updated, removed }, error: null };
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

/** Call once at server startup / first API hit if cache is empty. */
export const initEventsCache = async (): Promise<EventInfo[]> => {
  if (eventsCache.length === 0) {
    await reloadEvents();
  }
  return eventsCache;
};
