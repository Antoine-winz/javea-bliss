export const STANDARD_MINIMUM_NIGHTS = 11;
export const HIGH_SEASON_MINIMUM_NIGHTS = 11;

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const parseDateOnlyUtc = (value: string) => {
  if (typeof value !== "string") return null;
  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

export const isValidBookingDate = (value: unknown): value is string =>
  typeof value === "string" && parseDateOnlyUtc(value) !== null;

export const addNights = (date: string, nights: number) => {
  const result = parseDateOnlyUtc(date);
  if (!result) return "";
  result.setUTCDate(result.getUTCDate() + nights);
  return result.toISOString().slice(0, 10);
};

export const getStayLengthNights = (checkIn: string, checkOut: string) => {
  const start = parseDateOnlyUtc(checkIn);
  const end = parseDateOnlyUtc(checkOut);
  if (!start || !end) return NaN;
  return Math.round((end.getTime() - start.getTime()) / 86400000);
};

// High season runs from June 1 through September 30 every year.
// Checkout is exclusive: only nights actually stayed are evaluated.
export const stayIncludesHighSeason = (checkIn: string, checkOut: string) => {
  const current = parseDateOnlyUtc(checkIn);
  const end = parseDateOnlyUtc(checkOut);
  if (!current || !end) return false;

  while (current < end) {
    const month = current.getUTCMonth();
    if (month >= 5 && month <= 8) return true;
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return false;
};

export const getMinimumStayNights = (checkIn: string, checkOut?: string) => {
  if (!checkIn) return STANDARD_MINIMUM_NIGHTS;
  const effectiveCheckOut = checkOut || addNights(checkIn, STANDARD_MINIMUM_NIGHTS);
  return stayIncludesHighSeason(checkIn, effectiveCheckOut)
    ? HIGH_SEASON_MINIMUM_NIGHTS
    : STANDARD_MINIMUM_NIGHTS;
};