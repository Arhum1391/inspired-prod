/**
 * Parse Zoom meeting URL or meeting number to extract meeting number and password.
 *
 * Supports common patterns:
 * - https://zoom.us/j/1234567890
 * - https://us06web.zoom.us/j/1234567890?pwd=xxx
 * - Plain meeting number: 1234567890
 * - Any URL containing a numeric meeting id segment.
 */
export function parseZoomUrl(
  url: string
): { meetingNumber: string; password: string } | null {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  // Extract the first 9–12 digit sequence anywhere in the string.
  // This is robust even if the URL structure changes or the password contains digits.
  const idMatch = trimmed.match(/(\d{9,12})/);
  if (!idMatch) return null;

  const meetingNumber = idMatch[1];
  let password = '';

  const pwdMatch = trimmed.match(/[?&]pwd=([^&]+)/);
  if (pwdMatch) {
    password = decodeURIComponent(pwdMatch[1]);
  }

  return { meetingNumber, password };
}
