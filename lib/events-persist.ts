import fs from "fs";
import path from "path";
import eventsData from "@/local-ai/events.json";
import { normalizeEvent, type EventInfo } from "@/lib/events";

const EVENTS_FILE = path.join(process.cwd(), "local-ai", "events.json");
const EVENTS_BLOB_PATH = "netx/events.json";

type LegacyEventRaw = EventInfo & { imageUrl?: string; videoUrl?: string };

const parseEventsJson = (raw: string): EventInfo[] =>
  (JSON.parse(raw) as LegacyEventRaw[]).map(normalizeEvent);

const bundledEvents = (): EventInfo[] =>
  (eventsData as LegacyEventRaw[]).map(normalizeEvent);

const loadFromFilesystem = (): EventInfo[] | null => {
  try {
    return parseEventsJson(fs.readFileSync(EVENTS_FILE, "utf8"));
  } catch {
    return null;
  }
};

const saveToFilesystem = (events: EventInfo[]): boolean => {
  try {
    fs.writeFileSync(EVENTS_FILE, `${JSON.stringify(events, null, 2)}\n`, "utf8");
    return true;
  } catch {
    return false;
  }
};

const loadFromBlob = async (): Promise<EventInfo[] | null> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;

  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: EVENTS_BLOB_PATH, limit: 1, token });
    if (blobs.length === 0) return null;

    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return null;
    return parseEventsJson(await res.text());
  } catch {
    return null;
  }
};

const saveToBlob = async (events: EventInfo[]): Promise<string | null> => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return "Production storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel project settings.";
  }

  try {
    const { put } = await import("@vercel/blob");
    await put(EVENTS_BLOB_PATH, JSON.stringify(events, null, 2) + "\n", {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
      token,
    });
    return null;
  } catch {
    return "Failed to save events to Vercel Blob storage.";
  }
};

/** Load events from blob (production) → disk (local) → bundled JSON. */
export const loadEventsFromStorage = async (): Promise<EventInfo[]> => {
  const fromBlob = await loadFromBlob();
  if (fromBlob) return fromBlob;

  const fromDisk = loadFromFilesystem();
  if (fromDisk) return fromDisk;

  return bundledEvents();
};

/** Persist events — disk locally, Vercel Blob in production. */
export const persistEvents = async (
  events: EventInfo[],
): Promise<string | null> => {
  if (saveToFilesystem(events)) return null;
  return saveToBlob(events);
};

/** Seed blob from bundled/disk data on first production write if blob empty. */
export const ensureBlobSeeded = async (events: EventInfo[]): Promise<void> => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  const existing = await loadFromBlob();
  if (existing && existing.length > 0) return;
  await saveToBlob(events);
};
