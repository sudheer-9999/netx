import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export const runtime = "nodejs";

/** @deprecated Use POST /api/events/media instead. */
export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  return NextResponse.json(
    { error: "Use POST /api/events/media with eventId, kind, and file." },
    { status: 410 },
  );
}
