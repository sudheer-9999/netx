import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import { parseEventPayload } from "@/lib/events";
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  getLiveEvent,
  reloadEvents,
  replaceEventById,
} from "@/lib/events-store";

export const runtime = "nodejs";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export async function GET(request: Request) {
  reloadEvents();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const event = getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }
    return NextResponse.json({ event });
  }

  return NextResponse.json({
    liveEvent: getLiveEvent(),
    events: getAllEvents(),
  });
}

const resolveEventId = (
  searchParams: URLSearchParams,
  body: unknown,
): string | null => {
  let id = searchParams.get("id");
  if (!id && isRecord(body) && typeof body.id === "string") {
    id = body.id;
  }
  return id;
};

const persistNewEvent = (body: unknown) => {
  const parsed = parseEventPayload(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const created = createEvent(parsed);
  if (created === "exists") {
    return NextResponse.json(
      { error: `Event id "${parsed.id}" already exists.` },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { event: created, liveEvent: getLiveEvent() },
    { status: 201 },
  );
};

const persistEvent = (id: string, body: unknown) => {
  const parsed = parseEventPayload(body, id);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const updated = replaceEventById(parsed);
  if (!updated) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({
    event: updated,
    liveEvent: getLiveEvent(),
  });
};

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  reloadEvents();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  return persistNewEvent(body);
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  reloadEvents();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const resolvedId = id ?? resolveEventId(searchParams, body);
  if (!resolvedId) {
    return NextResponse.json(
      { error: "Event id is required (?id=... or body.id)." },
      { status: 400 },
    );
  }

  return persistEvent(resolvedId, body);
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  reloadEvents();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Event id is required." }, { status: 400 });
  }

  const removed = deleteEventById(id);
  if (!removed) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, liveEvent: getLiveEvent() });
}
