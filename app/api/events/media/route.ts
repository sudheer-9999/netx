import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import {
  deleteCloudinaryImage,
  isCloudinaryUrl,
  publicIdFromCloudinaryUrl,
  uploadGalleryImage,
} from "@/lib/cloudinary";
import { validateExternalVideoUrl } from "@/lib/external-video";
import type { EventMediaItem } from "@/lib/events";
import {
  appendEventMedia,
  getEventById,
  getLiveEvent,
  reloadEvents,
  removeEventMedia,
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
  const labelField = formData.get("label");

  if (typeof eventId !== "string" || !eventId.trim()) {
    return NextResponse.json({ error: "eventId is required." }, { status: 400 });
  }
  if (kind !== "image" && kind !== "video") {
    return NextResponse.json(
      { error: 'kind must be "image" (Cloudinary) or "video" (YouTube/Instagram link).' },
      { status: 400 },
    );
  }

  const event = getEventById(eventId.trim());
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const label =
    typeof labelField === "string" && labelField.trim()
      ? labelField.trim()
      : undefined;

  let item: EventMediaItem;

  if (kind === "video") {
    const urlField = formData.get("url");
    if (typeof urlField !== "string" || !urlField.trim()) {
      return NextResponse.json(
        { error: "url is required for gallery video (YouTube or Instagram link)." },
        { status: 400 },
      );
    }
    const urlError = validateExternalVideoUrl(urlField);
    if (urlError) {
      return NextResponse.json({ error: urlError }, { status: 400 });
    }

    item = {
      id: `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "video",
      url: urlField.trim(),
      publicId: "",
      ...(label ? { label } : {}),
    };
  } else {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "file is required for gallery image." }, { status: 400 });
    }

    const uploaded = await uploadGalleryImage(eventId.trim(), file);
    if (typeof uploaded === "string") {
      return NextResponse.json({ error: uploaded }, { status: 400 });
    }

    item = {
      id: `image-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "image",
      url: uploaded.url,
      publicId: uploaded.publicId,
      ...(label ? { label } : {}),
    };
  }

  const { event: updated, error: saveError } = await appendEventMedia(eventId.trim(), item);
  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 503 });
  }
  if (!updated) {
    return NextResponse.json({ error: "Failed to save media." }, { status: 500 });
  }

  return NextResponse.json({
    item,
    event: updated,
    liveEvent: getLiveEvent(),
  });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  await reloadEvents();
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");
  const mediaId = searchParams.get("mediaId");

  if (!eventId || !mediaId) {
    return NextResponse.json(
      { error: "eventId and mediaId are required." },
      { status: 400 },
    );
  }

  const { result, error: saveError } = await removeEventMedia(eventId, mediaId);
  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 503 });
  }
  if (!result) {
    return NextResponse.json({ error: "Media not found." }, { status: 404 });
  }

  const { removed } = result;

  if (removed.type === "image") {
    const publicId =
      removed.publicId ||
      (isCloudinaryUrl(removed.url)
        ? publicIdFromCloudinaryUrl(removed.url)
        : null);

    if (publicId) {
      const deleteError = await deleteCloudinaryImage(publicId);
      if (deleteError) {
        return NextResponse.json(
          {
            error: `${deleteError} Media was removed from the event only.`,
            event: result.event,
            partial: true,
          },
          { status: 502 },
        );
      }
    }
  }

  return NextResponse.json({
    ok: true,
    event: result.event,
    liveEvent: getLiveEvent(),
  });
}
