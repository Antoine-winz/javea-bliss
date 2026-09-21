import assert from "node:assert/strict";
import test from "node:test";
import {
  addNights,
  getMinimumStayNights,
  getStayLengthNights,
  isValidBookingDate,
  stayIncludesHighSeason,
} from "./booking-rules";

test("date-only arithmetic is independent of the local timezone", () => {
  assert.equal(addNights("2027-06-01", 11), "2027-06-12");
  assert.equal(addNights("2027-01-10", 3), "2027-01-13");
});

test("high-season boundaries treat checkout as exclusive", () => {
  assert.equal(stayIncludesHighSeason("2027-05-29", "2027-06-01"), false);
  assert.equal(stayIncludesHighSeason("2027-05-30", "2027-06-02"), true);
  assert.equal(stayIncludesHighSeason("2027-09-30", "2027-10-01"), true);
  assert.equal(stayIncludesHighSeason("2027-10-01", "2027-10-04"), false);
});

test("minimum stays remain 11 nights regardless of season", () => {
  assert.equal(getMinimumStayNights("2027-07-01", "2027-07-11"), 11);
  assert.equal(getMinimumStayNights("2027-01-10", "2027-01-13"), 11);
  assert.equal(getStayLengthNights("2027-07-01", "2027-07-12"), 11);
});

test("only real YYYY-MM-DD calendar dates are accepted", () => {
  assert.equal(isValidBookingDate("2027-07-01"), true);
  assert.equal(isValidBookingDate("2027-07-01T00:00:00Z"), false);
  assert.equal(isValidBookingDate("2027-02-30"), false);
  assert.equal(isValidBookingDate(null), false);
  assert.equal(Number.isNaN(getStayLengthNights("2027-07-01T00:00:00Z", "2027-07-12")), true);
});