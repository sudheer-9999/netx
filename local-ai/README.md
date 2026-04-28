# NetX AI (Next.js In-App LLM + Node Backend)

This project uses **Next.js Node API routes only**:
- `POST /chat` (main endpoint)
- `POST /chat/stream` (SSE streaming endpoint)

## Model runtime

The app now runs an in-process model with `@xenova/transformers`:
- Default model: `Xenova/TinyLlama-1.1B-Chat-v1.0`
- Loaded directly inside your Next.js app (no extra server, no env needed)
- First run downloads model weights, then cache is reused

## Run

```bash
npm run dev
```

Chat flow:
- UI -> `POST /chat`
- `/chat` runs in-app LLM first with event-grounded prompt + last 10 turns
- If model is unavailable/unsure -> fallback intent engine from `lib/netx-assistant.ts`

## Vercel free notes

In-app models can work for light traffic, but cold starts and inference speed depend on plan/runtime limits.
Your fallback intent system is still active for reliability.

## Ground truth event data

Update `local-ai/events.json` only.  
The backend prompt is built dynamically from this file.
