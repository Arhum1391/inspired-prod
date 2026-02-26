/** ISO date string pattern (e.g. 2025-02-25T14:30:00Z) */
function isIsoDateString(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v);
}

/** Only these keys mean "when the meeting is scheduled"; do not use created_at, updated_at, etc. */
const START_TIME_KEYS = ['start_time', 'scheduled_event_start_time', 'scheduled_start_time'];

/** Recursively find a value for a start_time-like key (never created_at / updated_at). */
function findStartTime(obj: unknown, depth = 0): string | null {
  if (depth > 5 || !obj || typeof obj !== 'object') return null;
  const o = obj as Record<string, unknown>;
  for (const key of START_TIME_KEYS) {
    if (isIsoDateString(o[key])) return o[key] as string;
  }
  for (const key of ['invitee', 'event', 'payload', 'data', 'resource']) {
    const found = findStartTime(o[key], depth + 1);
    if (found) return found;
  }
  return null;
}

/** Recursively find a value for "uri" under invitee-like object that looks like Calendly API URL */
function findInviteeUri(obj: unknown, depth = 0): string | null {
  if (depth > 5 || !obj || typeof obj !== 'object') return null;
  const o = obj as Record<string, unknown>;
  if (typeof o.uri === 'string' && o.uri.includes('calendly.com') && o.uri.includes('invitees')) return o.uri;
  for (const key of ['invitee', 'payload', 'data']) {
    const found = findInviteeUri(o[key], depth + 1);
    if (found) return found;
  }
  return null;
}

/**
 * Calendly embed postMessage can send different payload shapes.
 * Extract start_time (ISO string) and invitee URI from whatever we get.
 */
export function getCalendlySlotFromPayload(data: unknown): { startTimeIso: string | null; inviteeUri: string | null } {
  if (!data || typeof data !== 'object') return { startTimeIso: null, inviteeUri: null };
  const o = data as Record<string, unknown>;
  const payload = (o.payload as Record<string, unknown>) || o;
  const invitee = payload.invitee as Record<string, unknown> | undefined;
  const event = payload.event as Record<string, unknown> | undefined;

  const startTimeIso =
    (invitee?.start_time as string) ??
    (event?.start_time as string) ??
    (payload.start_time as string) ??
    (o.start_time as string) ??
    findStartTime(data);

  const inviteeUri =
    (invitee?.uri as string) ??
    (payload.invitee_uri as string) ??
    (o.invitee_uri as string) ??
    findInviteeUri(data);

  return {
    startTimeIso: typeof startTimeIso === 'string' ? startTimeIso : null,
    inviteeUri: typeof inviteeUri === 'string' ? inviteeUri : null,
  };
}
