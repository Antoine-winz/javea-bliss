import assert from 'node:assert/strict';
import test from 'node:test';
import { bookingInquirySchema, insertDailyRateSchema, insertGuestReviewSchema } from './schema';
test('booking data rejects malformed contact details and fractional guests', () => {
  const booking = { name: 'Test Guest', email: 'guest@example.com', phone: '+34123456789', checkIn: '2027-06-01', checkOut: '2027-06-12', guests: '2', message: '' };
  assert.equal(bookingInquirySchema.safeParse(booking).success, true);
  for (const invalid of [{ email: 'invalid' }, { guests: '2junk' }, { guests: '1.5' }, { checkIn: '2027-02-30' }, { message: 'x'.repeat(5001) }]) assert.equal(bookingInquirySchema.safeParse({ ...booking, ...invalid }).success, false);
});
test('daily rates and review ratings are bounded and validate real dates', () => {
  assert.equal(insertDailyRateSchema.safeParse({ date: '2027-02-30', rate: 130 }).success, false);
  assert.equal(insertDailyRateSchema.safeParse({ date: '2027-06-01', rate: -1 }).success, false);
  assert.equal(insertDailyRateSchema.safeParse({ date: '2027-06-01', rate: 130 }).success, true);
  assert.equal(insertGuestReviewSchema.safeParse({ guestName: 'Guest', rating: 6, reviewText: 'Review', language: 'en' }).success, false);
});
