import eventsData from "@/local-ai/events.json";
import { getYouTubeThumbnailUrl, isExternalVideoUrl } from "@/lib/external-video";

export const isValidMediaUrl = (url: string): boolean =>
  url.startsWith("/") ||
  url.startsWith("http://") ||
  url.startsWith("https://");

/** @deprecated Use isValidMediaUrl */
export const isValidImageUrl = isValidMediaUrl;

export type EventStatus = "active" | "upcoming" | "completed";

export type TicketTier = {
  price: string;
  label: string;
};

export type EventMediaItem = {
  id: string;
  type: "image" | "video";
  url: string;
  publicId: string;
  label?: string;
};

/** One poster per event — shown in the popup (image OR video, not both). */
export type EventPoster = {
  type: "image" | "video";
  url: string;
  publicId: string;
};

export type EventInfo = {
  id: string;
  name: string;
  subtitle?: string;
  dateLabel: string;
  isoDate: string;
  timeLabel: string;
  venue: string;
  venueAddress?: string;
  city: string;
  mapLink: string;
  ticketTiers: TicketTier[];
  registrationLink: string;
  districtLink?: string;
  gatesOpenLabel?: string;
  status: EventStatus;
  ticketTierName: string;
  ticketTierDescription: string;
  availableTillLabel: string;
  ticketsLeft: number;
  dressCode?: string;
  features?: string[];
  /** Popup poster — exactly one image or video. */
  poster: EventPoster | null;
  /** Gallery items — separate from the poster. */
  media: EventMediaItem[];
};

const EVENT_STATUSES: EventStatus[] = ["active", "upcoming", "completed"];

const REQUIRED_STRING_FIELDS = [
  "id",
  "name",
  "subtitle",
  "dateLabel",
  "isoDate",
  "timeLabel",
  "venue",
  "venueAddress",
  "city",
  "mapLink",
  "registrationLink",
  "districtLink",
  "gatesOpenLabel",
  "ticketTierName",
  "ticketTierDescription",
  "availableTillLabel",
  "dressCode",
] as const satisfies readonly (keyof EventInfo)[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const parseRupeeValue = (value: string) =>
  Number(value.replace(/[^\d]/g, ""));

export const formatTicketTier = (tier: TicketTier) =>
  `${tier.price} (${tier.label})`;

export const formatTicketTiersLine = (tiers: TicketTier[]) =>
  tiers.map(formatTicketTier).join(" · ");

const parseTicketTiers = (value: unknown): TicketTier[] | null => {
  if (!Array.isArray(value) || value.length === 0) return null;

  const tiers: TicketTier[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    const price = typeof item.price === "string" ? item.price.trim() : "";
    const label = typeof item.label === "string" ? item.label.trim() : "";
    if (!price || !label) return null;
    tiers.push({ price, label });
  }
  return tiers;
};

const parseEventMedia = (value: unknown): EventMediaItem[] | null => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;

  const items: EventMediaItem[] = [];
  for (const item of value) {
    if (!isRecord(item)) return null;
    const id = typeof item.id === "string" ? item.id.trim() : "";
    const type = item.type;
    const url = typeof item.url === "string" ? item.url.trim() : "";
    const publicId =
      typeof item.publicId === "string" ? item.publicId.trim() : "";
    const label =
      typeof item.label === "string" && item.label.trim()
        ? item.label.trim()
        : undefined;

    if (!id || (type !== "image" && type !== "video") || !url) return null;
    if (!isValidMediaUrl(url)) return null;
    if (type === "video" && !isExternalVideoUrl(url) && !url.includes("res.cloudinary.com")) {
      return null;
    }

    items.push({
      id,
      type,
      url,
      publicId,
      ...(label ? { label } : {}),
    });
  }
  return items;
};

const parseEventPoster = (value: unknown): EventPoster | null | "invalid" => {
  if (value === null || value === undefined) return null;
  if (!isRecord(value)) return "invalid";
  const type = value.type;
  const url = typeof value.url === "string" ? value.url.trim() : "";
  const publicId =
    typeof value.publicId === "string" ? value.publicId.trim() : "";
  if ((type !== "image" && type !== "video") || !url || !isValidMediaUrl(url)) {
    return "invalid";
  }
  if (type === "video" && !isExternalVideoUrl(url) && !url.includes("res.cloudinary.com")) {
    return "invalid";
  }
  return { type, url, publicId };
};

type LegacyEventRaw = EventInfo & {
  imageUrl?: string;
  videoUrl?: string;
};

export const normalizeEvent = (raw: LegacyEventRaw): EventInfo => {
  let poster = raw.poster ?? null;
  let media = [...(raw.media ?? [])].filter(
    (item) => !item.id.includes("legacy-poster"),
  );

  if (!poster) {
    const videoUrl = raw.videoUrl?.trim();
    const imageUrl = raw.imageUrl?.trim();
    if (videoUrl && isValidMediaUrl(videoUrl) && videoUrl.includes("res.cloudinary.com")) {
      poster = {
        type: "video",
        url: videoUrl,
        publicId: "",
      };
    } else if (imageUrl && isValidMediaUrl(imageUrl)) {
      poster = {
        type: "image",
        url: imageUrl,
        publicId: "",
      };
    }
  }

  if (poster) {
    media = media.filter((item) => item.url !== poster!.url);
  }

  const rest = { ...raw };
  delete rest.imageUrl;
  delete rest.videoUrl;
  return { ...rest, poster, media };
};

export const getPopupMedia = (
  event: EventInfo,
): { type: "video" | "image"; url: string; poster?: string } | null => {
  if (!event.poster) return null;
  if (event.poster.type === "video") {
    const galleryThumb = event.media.find((m) => m.type === "image");
    const youtubeThumb = getYouTubeThumbnailUrl(event.poster.url);
    return {
      type: "video",
      url: event.poster.url,
      poster: galleryThumb?.url ?? youtubeThumb ?? undefined,
    };
  }
  return { type: "image", url: event.poster.url };
};

/** Thumbnail for event cards — prefers poster image. */
export const getEventThumbnailUrl = (event: EventInfo): string | null => {
  if (event.poster?.type === "image") return event.poster.url;
  const galleryImage = event.media.find((m) => m.type === "image");
  if (galleryImage) return galleryImage.url;
  if (event.poster?.type === "video") {
    return getYouTubeThumbnailUrl(event.poster.url);
  }
  return null;
};

/** Poster + gallery items for the experience detail view. */
export const getEventAllMedia = (event: EventInfo): EventMediaItem[] => {
  const items: EventMediaItem[] = [];
  if (event.poster) {
    items.push({
      id: `poster-${event.id}`,
      type: event.poster.type,
      url: event.poster.url,
      publicId: event.poster.publicId,
      label: event.poster.type === "video" ? "Poster video" : "Poster",
    });
  }
  for (const item of event.media) {
    if (event.poster && item.url === event.poster.url) continue;
    items.push(item);
  }
  return items;
};

const requireNonEmptyString = (
  body: Record<string, unknown>,
  field: (typeof REQUIRED_STRING_FIELDS)[number],
): string | null => {
  const value = body[field];
  if (typeof value !== "string" || value.trim() === "") {
    return field;
  }
  return null;
};

/** Validates a PUT body contains every event field (full replace, not partial). */
export const parseEventPayload = (
  body: unknown,
  expectedId?: string,
): EventInfo | string => {
  if (!isRecord(body)) return "Request body must be a JSON object with all event fields.";

  const missing: string[] = [];
  for (const field of REQUIRED_STRING_FIELDS) {
    const invalid = requireNonEmptyString(body, field);
    if (invalid) missing.push(invalid);
  }

  if (typeof body.status !== "string" || !EVENT_STATUSES.includes(body.status as EventStatus)) {
    missing.push(`status (use: ${EVENT_STATUSES.join(", ")})`);
  }

  if (
    typeof body.ticketsLeft !== "number" ||
    !Number.isFinite(body.ticketsLeft) ||
    body.ticketsLeft < 0
  ) {
    missing.push("ticketsLeft (non-negative number)");
  }

  const ticketTiers = parseTicketTiers(body.ticketTiers);
  if (!ticketTiers) {
    missing.push(
      'ticketTiers (non-empty array of { "price": "₹269", "label": "JAM PASS" })',
    );
  }

  if (
    !Array.isArray(body.features) ||
    body.features.length === 0 ||
    !body.features.every((item) => typeof item === "string" && item.trim() !== "")
  ) {
    missing.push("features (non-empty array of strings)");
  }

  const parsedMedia = parseEventMedia(body.media);
  if (parsedMedia === null) {
    missing.push(
      'media (array of gallery items: { "id", "type", "url", "publicId" })',
    );
  }

  const parsedPoster = parseEventPoster(body.poster);
  if (parsedPoster === "invalid") {
    missing.push('poster (null or { "type": "image"|"video", "url", "publicId" })');
  }

  const media = parsedMedia ?? [];

  if (missing.length > 0) {
    return `Missing or invalid fields: ${missing.join(", ")}.`;
  }

  const id = (body.id as string).trim();
  if (expectedId && id !== expectedId) {
    return `Body id "${id}" does not match URL id "${expectedId}".`;
  }

  return {
    id,
    name: (body.name as string).trim(),
    subtitle: (body.subtitle as string).trim(),
    dateLabel: (body.dateLabel as string).trim(),
    isoDate: (body.isoDate as string).trim(),
    timeLabel: (body.timeLabel as string).trim(),
    venue: (body.venue as string).trim(),
    venueAddress: (body.venueAddress as string).trim(),
    city: (body.city as string).trim(),
    mapLink: (body.mapLink as string).trim(),
    ticketTiers: ticketTiers!,
    registrationLink: (body.registrationLink as string).trim(),
    districtLink: (body.districtLink as string).trim(),
    gatesOpenLabel: (body.gatesOpenLabel as string).trim(),
    status: body.status as EventStatus,
    ticketTierName: (body.ticketTierName as string).trim(),
    ticketTierDescription: (body.ticketTierDescription as string).trim(),
    availableTillLabel: (body.availableTillLabel as string).trim(),
    ticketsLeft: body.ticketsLeft as number,
    dressCode: (body.dressCode as string).trim(),
    features: (body.features as string[]).map((f) => f.trim()),
    poster: parsedPoster === "invalid" ? null : parsedPoster,
    media,
  };
};

const EVENTS = (eventsData as LegacyEventRaw[]).map(normalizeEvent);

export const getAllEvents = (): EventInfo[] => EVENTS;

export const getEventById = (id: string): EventInfo | undefined =>
  EVENTS.find((event) => event.id === id);

export const formatBookingLinks = (event: EventInfo): string => {
  const lines = [`Konfhub: ${event.registrationLink}`];
  if (event.districtLink) {
    lines.push(`District: ${event.districtLink}`);
  }
  return lines.join("\n");
};

export const isPromotableEvent = (event: EventInfo): boolean =>
  event.status === "active" || event.status === "upcoming";

/** Active or upcoming event only; completed events are never returned. */
export const pickLiveEvent = (events: EventInfo[]): EventInfo | null => {
  const eligible = events.filter(isPromotableEvent);
  if (eligible.length === 0) return null;

  const active = eligible.find((event) => event.status === "active");
  if (active) return active;

  const now = Date.now();
  const bySoonest = [...eligible].sort(
    (a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime(),
  );
  const nextByDate = bySoonest.find(
    (event) => new Date(event.isoDate).getTime() >= now,
  );
  if (nextByDate) return nextByDate;

  const upcoming = eligible.filter((event) => event.status === "upcoming");
  if (upcoming.length > 0) {
    return [...upcoming].sort(
      (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
    )[0];
  }

  return null;
};

export const getLiveEvent = (): EventInfo | null => pickLiveEvent(EVENTS);
