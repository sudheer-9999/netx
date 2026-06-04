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
  await reloadEvents();
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

const persistNewEvent = async (body: unknown) => {
  const parsed = parseEventPayload(body);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const { event: created, error: saveError, exists } = await createEvent(parsed);
  if (exists) {
    return NextResponse.json(
      { error: `Event id "${parsed.id}" already exists.` },
      { status: 409 },
    );
  }
  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 503 });
  }
  if (!created) {
    return NextResponse.json({ error: "Failed to create event." }, { status: 500 });
  }

  return NextResponse.json(
    { event: created, liveEvent: getLiveEvent() },
    { status: 201 },
  );
};

const persistEvent = async (id: string, body: unknown) => {
  const parsed = parseEventPayload(body, id);
  if (typeof parsed === "string") {
    return NextResponse.json({ error: parsed }, { status: 400 });
  }

  const { event: updated, error: saveError } = await replaceEventById(parsed);
  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 503 });
  }
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

  await reloadEvents();
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

  await reloadEvents();
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

  await reloadEvents();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Event id is required." }, { status: 400 });
  }

  const { ok, error: saveError } = await deleteEventById(id);
  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 503 });
  }
  if (!ok) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, liveEvent: getLiveEvent() });
}
