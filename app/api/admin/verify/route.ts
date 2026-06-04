import { NextResponse } from "next/server";
import { verifyAdminKey } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const ok = verifyAdminKey(body.password);
  return NextResponse.json({ ok });
}
