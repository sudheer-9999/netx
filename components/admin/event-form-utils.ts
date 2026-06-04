import type {
  EventInfo,
  EventMediaItem,
  EventPoster,
  EventStatus,
  TicketTier,
} from "@/lib/events";

export type EventFormState = {
  id: string;
  name: string;
  subtitle: string;
  dateLabel: string;
  isoDateLocal: string;
  timeLabel: string;
  venue: string;
  venueAddress: string;
  city: string;
  mapLink: string;
  ticketTiers: TicketTier[];
  registrationLink: string;
  districtLink: string;
  gatesOpenLabel: string;
  status: EventStatus;
  ticketTierName: string;
  ticketTierDescription: string;
  availableTillLabel: string;
  ticketsLeft: string;
  dressCode: string;
  featuresText: string;
  poster: EventPoster | null;
  media: EventMediaItem[];
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const isoToDatetimeLocal = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const datetimeLocalToIso = (local: string): string => {
  if (!local) return new Date().toISOString();
  const date = new Date(local);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

export const emptyForm = (): EventFormState => ({
  id: "",
  name: "",
  subtitle: "",
  dateLabel: "",
  isoDateLocal: "",
  timeLabel: "",
  venue: "",
  venueAddress: "",
  city: "",
  mapLink: "",
  ticketTiers: [{ price: "₹", label: "" }],
  registrationLink: "",
  districtLink: "",
  gatesOpenLabel: "",
  status: "upcoming",
  ticketTierName: "",
  ticketTierDescription: "",
  availableTillLabel: "",
  ticketsLeft: "50",
  dressCode: "",
  featuresText: "",
  poster: null,
  media: [],
});

export const eventToForm = (event: EventInfo): EventFormState => ({
  id: event.id,
  name: event.name,
  subtitle: event.subtitle ?? "",
  dateLabel: event.dateLabel,
  isoDateLocal: isoToDatetimeLocal(event.isoDate),
  timeLabel: event.timeLabel,
  venue: event.venue,
  venueAddress: event.venueAddress ?? "",
  city: event.city,
  mapLink: event.mapLink,
  ticketTiers:
    event.ticketTiers.length > 0
      ? event.ticketTiers.map((t) => ({ ...t }))
      : [{ price: "₹", label: "" }],
  registrationLink: event.registrationLink,
  districtLink: event.districtLink ?? "",
  gatesOpenLabel: event.gatesOpenLabel ?? "",
  status: event.status,
  ticketTierName: event.ticketTierName,
  ticketTierDescription: event.ticketTierDescription,
  availableTillLabel: event.availableTillLabel,
  ticketsLeft: String(event.ticketsLeft),
  dressCode: event.dressCode ?? "",
  featuresText: (event.features ?? []).join("\n"),
  poster: event.poster ? { ...event.poster } : null,
  media: event.media.map((item) => ({ ...item })),
});

export const formToPayload = (form: EventFormState) => ({
  id: form.id.trim(),
  name: form.name.trim(),
  subtitle: form.subtitle.trim(),
  dateLabel: form.dateLabel.trim(),
  isoDate: datetimeLocalToIso(form.isoDateLocal),
  timeLabel: form.timeLabel.trim(),
  venue: form.venue.trim(),
  venueAddress: form.venueAddress.trim(),
  city: form.city.trim(),
  mapLink: form.mapLink.trim(),
  ticketTiers: form.ticketTiers
    .map((t) => ({ price: t.price.trim(), label: t.label.trim() }))
    .filter((t) => t.price && t.label),
  registrationLink: form.registrationLink.trim(),
  districtLink: form.districtLink.trim(),
  gatesOpenLabel: form.gatesOpenLabel.trim(),
  status: form.status,
  ticketTierName: form.ticketTierName.trim(),
  ticketTierDescription: form.ticketTierDescription.trim(),
  availableTillLabel: form.availableTillLabel.trim(),
  ticketsLeft: Number(form.ticketsLeft),
  dressCode: form.dressCode.trim(),
  features: form.featuresText
    .split("\n")
    .map((f) => f.trim())
    .filter(Boolean),
  poster: form.poster,
  media: form.media,
});
