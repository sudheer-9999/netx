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

## Event admin panel (recommended)

Manage events in the browser at **`/admin`**:

1. Set the password in `lib/admin-auth.ts` (`ADMIN_PASSWORD`)
2. Run `npm run dev` and open [http://localhost:3000/admin](http://localhost:3000/admin)
3. Create, edit, upload posters, set status (`active` / `upcoming` / `completed`), and delete events

Changes are saved to `local-ai/events.json` and appear on the site immediately (popup + Happening Now only for `active` / `upcoming`).

## Cloudinary (images only)

Add to `.env.local` (see `.env.example`):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Images** upload to Cloudinary. **Videos** use YouTube or Instagram links — nothing is stored on Cloudinary for video, which saves storage and bandwidth.

In **/admin**, after saving an event:

1. **Event poster (popup)** — upload an image to Cloudinary, or paste a YouTube / Instagram link for video
2. **Media gallery** — upload images to Cloudinary; add YouTube / Instagram links for videos

Poster API (admin header):

- `POST /api/events/poster` — image: multipart `eventId`, `kind=image`, `file` · video: `eventId`, `kind=video`, `url`
- `DELETE /api/events/poster?eventId=...`

Gallery API (admin header):

- `POST /api/events/media` — image: multipart `eventId`, `kind=image`, `file` · video: `eventId`, `kind=video`, `url`, optional `label`
- `DELETE /api/events/media?eventId=...&mediaId=...` — Cloudinary delete runs for images only

The **popup** uses `poster`. **Happening Now** shows the `media` gallery.

## API (optional)

Public read:

- `GET /api/events` — `{ liveEvent, events }`
- `GET /api/events?id=...` — single event

Admin writes (header `x-admin-key: <password from lib/admin-auth.ts>`):

- `POST /api/events` — create event
- `PUT /api/events?id=...` — update event
- `DELETE /api/events?id=...` — delete event

**Poster & gallery (API):** use `POST /api/events/poster` or `POST /api/events/media` after creating the event. Event JSON includes `"poster": null | { "type", "url", "publicId" }` and `"media": []`.

Example `PUT` (all fields required):

```bash
curl -X PUT "http://localhost:3000/api/events?id=madhuram-chapter-3" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: YOUR_ADMIN_PASSWORD" \
  -d '{
    "id": "madhuram-chapter-3",
    "name": "Madhuram Chapter 3",
    "subtitle": "Let'\''s jammify",
    "dateLabel": "13th June (Saturday)",
    "isoDate": "2026-06-13T18:30:00+05:30",
    "timeLabel": "6:30 PM onwards",
    "venue": "Hotel K Fortune",
    "venueAddress": "Near G Pullareddy Engineering College, Nandyal Road, Kurnool",
    "city": "Kurnool",
    "mapLink": "https://www.google.com/maps/search/?api=1&query=Hotel+K+Fortune+Nandyal+Road+Kurnool",
    "ticketTiers": [
      { "price": "₹269", "label": "JAM PASS" },
      { "price": "₹369", "label": "JAM + BITE PASS" }
    ],
    "registrationLink": "https://konfhub.com/madhuram-chapter-3",
    "districtLink": "https://www.district.in/events/madhuram-chapter-3-jun13-2026-buy-tickets",
    "gatesOpenLabel": "6:15 PM",
    "status": "active",
    "ticketTierName": "JAM PASS",
    "ticketTierDescription": "Your entry to Madhuram Chapter 3 — an evening with songs, laughter, and memories.",
    "availableTillLabel": "13th June 2026, 06:30 PM (GMT+05:30)",
    "ticketsLeft": 50,
    "dressCode": "Shades of Red",
    "poster": null,
    "media": [],
    "features": ["360° Camera", "Photo Booth", "Free Fall Game"]
  }'
```

Upload poster image after save:

```bash
curl -X POST "http://localhost:3000/api/events/poster" \
  -H "x-admin-key: YOUR_ADMIN_PASSWORD" \
  -F "eventId=madhuram-chapter-3" \
  -F "kind=image" \
  -F "file=@poster.jpg"
```

Set poster video (YouTube / Instagram — no Cloudinary):

```bash
curl -X POST "http://localhost:3000/api/events/poster" \
  -H "x-admin-key: YOUR_ADMIN_PASSWORD" \
  -F "eventId=madhuram-chapter-3" \
  -F "kind=video" \
  -F "url=https://www.youtube.com/watch?v=VIDEO_ID"
```
