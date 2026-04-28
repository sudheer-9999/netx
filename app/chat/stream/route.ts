import { NextRequest } from "next/server";
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
      return new Response("Message is required.", { status: 400 });
    }

    const result = await generateAssistantReply(message, history, lastIntent);
    const words = result.reply.split(" ");

    const stream = new ReadableStream({
      start(controller) {
        for (const word of words) {
          controller.enqueue(`data: ${word}\n\n`);
        }
        controller.enqueue(`data: [DONE]\n\n`);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Chat-Source": result.source,
      },
    });
  } catch {
    return new Response("Unable to stream chat response.", { status: 500 });
  }
}
