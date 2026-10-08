import assert from 'node:assert/strict';
import test from 'node:test';
import { isStayAvailable } from './availability';
const date = (day: string) => new Date(`${day}T00:00:00Z`);
const events = [{ startDate: date('2027-06-10'), endDate: date('2027-06-21'), summary: 'Reserved', uid: 'reservation' }];
test('reservations block arrival nights and enclosed stays', () => {
  assert.equal(isStayAvailable(date('2027-06-10'), date('2027-06-21'), events), false);
  assert.equal(isStayAvailable(date('2027-06-09'), date('2027-06-11'), events), false);
  assert.equal(isStayAvailable(date('2027-06-12'), date('2027-06-15'), events), false);
  assert.equal(isStayAvailable(date('2027-06-01'), date('2027-07-01'), events), false);
});
test('adjacent bookings can share a checkout day', () => {
  assert.equal(isStayAvailable(date('2027-06-01'), date('2027-06-10'), events), true);
  assert.equal(isStayAvailable(date('2027-06-21'), date('2027-07-02'), events), true);
});
test('manual blocks cannot be bypassed by a shared turnover date', () => {
  const manual = [...events, { startDate: date('2027-06-20'), endDate: date('2027-06-25'), summary: 'Owner', uid: 'manual-owner' }];
  assert.equal(isStayAvailable(date('2027-06-21'), date('2027-07-02'), manual), false);
});
test('invalid or reversed ranges are rejected', () => {
  assert.equal(isStayAvailable(date('invalid'), date('2027-06-21'), []), false);
  assert.equal(isStayAvailable(date('2027-06-21'), date('2027-06-10'), []), false);
});
