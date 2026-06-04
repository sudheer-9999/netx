import eventsData from "@/local-ai/events.json";
import { normalizeEvent, type EventInfo } from "@/lib/events";

const EVENTS_BLOB_PATH = "netx/events.json";
const BLOB_ACCESS = "private" as const;

type LegacyEventRaw = EventInfo & { imageUrl?: string; videoUrl?: string };

const parseEventsJson = (raw: string): EventInfo[] =>
  (JSON.parse(raw) as LegacyEventRaw[]).map(normalizeEvent);

const bundledEvents = (): EventInfo[] =>
  (eventsData as LegacyEventRaw[]).map(normalizeEvent);

const blobToken = (): string | undefined => process.env.BLOB_READ_WRITE_TOKEN;

const loadFromBlob = async (): Promise<EventInfo[] | null> => {
  const token = blobToken();
  if (!token) return null;

  try {
    const { get } = await import("@vercel/blob");
    const result = await get(EVENTS_BLOB_PATH, {
      access: BLOB_ACCESS,
      token,
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;

    const raw = await new Response(result.stream).text();
    return parseEventsJson(raw);
  } catch {
    return null;
  }
};

const saveToBlob = async (events: EventInfo[]): Promise<string | null> => {
  const token = blobToken();
  if (!token) {
    return "Event storage is not configured. Add BLOB_READ_WRITE_TOKEN to your environment (Vercel → Settings → Environment Variables, or run vercel env pull locally).";
  }

  try {
    const { put } = await import("@vercel/blob");
    await put(EVENTS_BLOB_PATH, JSON.stringify(events, null, 2) + "\n", {
      access: BLOB_ACCESS,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      token,
    });
    return null;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save events to Vercel Blob storage.";
    return message.startsWith("Vercel Blob:")
      ? message
      : "Failed to save events to Vercel Blob storage.";
  }
};

/** Load events from Vercel Blob, or bundled JSON when blob is empty or unavailable. */
export const loadEventsFromStorage = async (): Promise<EventInfo[]> => {
  const fromBlob = await loadFromBlob();
  if (fromBlob && fromBlob.length > 0) return fromBlob;

  return bundledEvents();
};

/** Persist events to Vercel Blob only. */
export const persistEvents = async (
  events: EventInfo[],
): Promise<string | null> => saveToBlob(events);

/** Seed blob from current events on first write if blob is empty. */
export const ensureBlobSeeded = async (events: EventInfo[]): Promise<void> => {
  if (!blobToken()) return;
  const existing = await loadFromBlob();
  if (existing && existing.length > 0) return;
  await saveToBlob(events);
};
