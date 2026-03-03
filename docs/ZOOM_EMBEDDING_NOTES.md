# Zoom Embedding Notes for Bootcamp

The bootcamp admin now has a **Zoom Link** field. You can store a Zoom meeting URL (e.g. `https://zoom.us/j/1234567890` or `https://us06web.zoom.us/j/1234567890?pwd=...`).

---

## Where to Get Credentials

**Important:** Your Zoom account email/password is for logging into Zoom. The Meeting SDK uses credentials from a **developer app** you create.

### Steps (General app with Meeting SDK)

1. Go to [marketplace.zoom.us](https://marketplace.zoom.us/) and sign in.
2. Click **Develop** → **Build App** → **General app**.
3. Complete the stepper form and **enable Meeting SDK** when prompted.
4. In **App Credentials**, you'll see **Client ID** and **Client Secret**.
5. Use them in `.env`:
   - **Client ID** → `ZOOM_MEETING_SDK_KEY`
   - **Client Secret** → `ZOOM_MEETING_SDK_SECRET`

```env
ZOOM_MEETING_SDK_KEY=your_client_id_here
ZOOM_MEETING_SDK_SECRET=your_client_secret_here
```

Zoom consolidated app types; Client ID/Secret from a General app with Meeting SDK enabled work as the SDK credentials for JWT signing.

---

## Option 1: Simple Link (No Embedding)

**Easiest.** Show a "Join Zoom" button that opens the link in a new tab.

```tsx
{bootcamp.zoomLink && (
  <a
    href={bootcamp.zoomLink}
    target="_blank"
    rel="noopener noreferrer"
    className="btn-primary"
  >
    Join Zoom Session
  </a>
)}
```

- No SDK or API keys
- Works immediately
- User joins in Zoom app or web client

---

## Option 2: Zoom Meeting SDK (Embed in Your App) — Implemented

**Full embed.** Zoom meeting runs inside a modal on the bootcamp page.

### Requirements

- Meeting SDK app (see "Where to Get SDK Key and Secret" above)
- Env vars: `ZOOM_MEETING_SDK_KEY`, `ZOOM_MEETING_SDK_SECRET`

### Flow

1. User clicks "Join in App" on the bootcamp page.
2. Modal opens; frontend calls `/api/zoom/signature` with meeting number.
3. Backend generates JWT signature using SDK Key + Secret.
4. Zoom Meeting SDK joins the meeting and renders in the modal.

### Files

- `src/app/api/zoom/signature/route.ts` — JWT signature endpoint
- `src/components/ZoomEmbed.tsx` — Embed component
- `src/lib/zoomUtils.ts` — Parse Zoom URL for meeting number/password

---

## Option 3: Zoom Video SDK (Custom UI)

For fully custom video experiences (your own UI, Zoom’s backend). More work, more control.

- [Video SDK](https://developers.zoom.us/docs/video-sdk/)
- Use when you need custom layouts, branding, or flows

---

## Compatibility Notes

### Option 1 (Simple Link)

- **Compatible** with all stacks (Next.js 15, React 19, etc.)
- No dependencies

### Option 2 (Meeting SDK) & Option 3 (Video SDK)

**This app uses Next.js 15 and React 19.** The Zoom Meeting SDK has known compatibility issues:

| Stack              | Status                                                                 |
|--------------------|-----------------------------------------------------------------------|
| React 19           | ❌ Black screens, `TypeError` (e.g. `ReactCurrentBatchConfig` undefined) |
| Next.js 15         | ❌ Compatibility issues reported; no official fix yet                 |
| React 18 + Next.js 14 | ✅ Confirmed to work with Meeting SDK v3.10.0+                     |

**If you see black screens or errors:** Downgrade to React 18 and Next.js 14, then run `npm install` and rebuild.
