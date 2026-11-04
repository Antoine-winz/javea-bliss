import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function normalizeSalesPhone(input: string, callingCode: string): string | null {
  const value = input.trim();
  const international = value.startsWith('+') ? value : value.startsWith('00') ? `+${value.slice(2)}` : `${callingCode}${value.replace(/\D/g, '')}`;
  const number = parsePhoneNumberFromString(international);
  return number?.isValid() ? number.number : null;
}
