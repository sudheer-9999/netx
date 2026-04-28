import { NextRequest, NextResponse } from "next/server";
import {
  ChatTurn,
  generateAssistantReply,
  IntentKey,
} from "@/lib/netx-assistant";

export const runtime = "nodejs";

type ChatRequestBody = {
  message?: string;
  history?: ChatTurn[];
  lastIntent?: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = body.message?.trim();
    const history = Array.isArray(body.history) ? body.history : [];
    const lastIntent = (body.lastIntent ?? null) as IntentKey | null;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const result = await generateAssistantReply(message, history, lastIntent);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Unable to process chat request." },
      { status: 500 },
    );
  }
}
