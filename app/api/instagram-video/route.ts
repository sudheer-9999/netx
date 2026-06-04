import { NextResponse } from "next/server";
import { parseInstagramEmbedPath } from "@/lib/external-video";
import { resolveInstagramVideo } from "@/lib/instagram-video";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url?.trim()) {
    return NextResponse.json({ error: "url is required." }, { status: 400 });
  }

  if (!parseInstagramEmbedPath(url.trim())) {
    return NextResponse.json(
      { error: "Invalid Instagram post or reel URL." },
      { status: 400 },
    );
  }

  const result = await resolveInstagramVideo(url.trim());
  if (!result) {
    return NextResponse.json(
      { error: "Could not resolve Instagram video. Open on Instagram instead." },
      { status: 404 },
    );
  }

  return NextResponse.json(result);
}
