import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import {
  deleteCloudinaryImage,
  deleteEventPosterAssets,
  isCloudinaryUrl,
  publicIdFromCloudinaryUrl,
  uploadEventPosterImage,
} from "@/lib/cloudinary";
import { validateExternalVideoUrl } from "@/lib/external-video";
import type { EventPoster } from "@/lib/events";
import {
  getEventById,
  getLiveEvent,
  reloadEvents,
  setEventPoster,
} from "@/lib/events-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  await reloadEvents();
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart body." }, { status: 400 });
  }

  const eventId = formData.get("eventId");
  const kind = formData.get("kind");

  if (typeof eventId !== "string" || !eventId.trim()) {
    return NextResponse.json({ error: "eventId is required." }, { status: 400 });
  }
  if (kind !== "image" && kind !== "video") {
    return NextResponse.json(
      { error: 'Poster must be "image" (Cloudinary upload) or "video" (YouTube/Instagram link).' },
      { status: 400 },
    );
  }

  const event = getEventById(eventId.trim());
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  let poster: EventPoster;

  if (kind === "video") {
    const urlField = formData.get("url");
    if (typeof urlField !== "string" || !urlField.trim()) {
      return NextResponse.json(
        { error: "url is required for video poster (YouTube or Instagram link)." },
        { status: 400 },
      );
    }
    const urlError = validateExternalVideoUrl(urlField);
    if (urlError) {
      return NextResponse.json({ error: urlError }, { status: 400 });
    }

    if (event.poster?.type === "image") {
      if (event.poster.publicId) {
        await deleteCloudinaryImage(event.poster.publicId);
      } else if (isCloudinaryUrl(event.poster.url)) {
        const publicId = publicIdFromCloudinaryUrl(event.poster.url);
        if (publicId) await deleteCloudinaryImage(publicId);
      } else {
        await deleteEventPosterAssets(eventId.trim());
      }
    }

    poster = { type: "video", url: urlField.trim(), publicId: "" };
  } else {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "file is required for image poster." }, { status: 400 });
    }

    const uploaded = await uploadEventPosterImage(eventId.trim(), file);
    if (typeof uploaded === "string") {
      return NextResponse.json({ error: uploaded }, { status: 400 });
    }

    poster = {
      type: "image",
      url: uploaded.url,
      publicId: uploaded.publicId,
    };
  }

  const { event: updated, error: saveError } = await setEventPoster(eventId.trim(), poster);
  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 503 });
  }
  if (!updated) {
    return NextResponse.json({ error: "Failed to save poster." }, { status: 500 });
  }

  return NextResponse.json({
    poster,
    event: updated,
    liveEvent: getLiveEvent(),
  });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  await reloadEvents();
  const eventId = new URL(request.url).searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "eventId is required." }, { status: 400 });
  }

  const event = getEventById(eventId);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  if (event.poster?.type === "image") {
    if (event.poster.publicId) {
      const err = await deleteCloudinaryImage(event.poster.publicId);
      if (err) {
        return NextResponse.json({ error: err }, { status: 502 });
      }
    } else if (isCloudinaryUrl(event.poster.url)) {
      const publicId = publicIdFromCloudinaryUrl(event.poster.url);
      if (publicId) {
        await deleteCloudinaryImage(publicId);
      }
    } else {
      await deleteEventPosterAssets(eventId);
    }
  }

  const { event: updated, error: saveError } = await setEventPoster(eventId, null);
  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    event: updated,
    liveEvent: getLiveEvent(),
  });
}
