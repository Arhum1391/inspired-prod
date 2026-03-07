/**
 * Returns true if today (local date) is within the registration window [start, end] (inclusive).
 * Compares at date-only level to avoid timezone issues.
 */
export function isRegistrationOpen(
  registrationStartDate: Date | string,
  registrationEndDate: Date | string
): boolean {
  const toYmd = (d: Date | string) => {
    const x = new Date(d);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  };
  const today = toYmd(new Date());
  const start = toYmd(registrationStartDate);
  const end = toYmd(registrationEndDate);
  return today >= start && today <= end;
}
