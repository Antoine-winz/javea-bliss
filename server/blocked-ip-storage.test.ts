import assert from "node:assert/strict";
import test from "node:test";
import { PgDialect } from "drizzle-orm/pg-core";

process.env.DATABASE_URL = "postgresql://test:test@localhost/test";
const { db } = await import("./db");
const { DatabaseStorage } = await import("./storage");

test("IP rules use a guaranteed aggregate row, retain dates, and propagate failures", async () => {
  const original = db.select;
  let payload: unknown = [];
  let fail = false;
  const dialect = new PgDialect();
  db.select = ((fields: any) => {
    const query = dialect.sqlToQuery(fields.blocks);
    assert.match(query.sql, /COALESCE\(json_agg/);
    assert.match(query.sql, /ORDER BY.*blocked_at.*DESC/s);
    return { from: async () => {
      if (fail) throw new Error("Simulated database outage");
      return [{ blocks: payload }];
    } };
  }) as typeof db.select;
  try {
    const storage = new DatabaseStorage();
    assert.deepEqual(await storage.listBlockedIps(), []);
    payload = [{ id: 7, ipAddress: "192.0.2.254", city: null, country: null, blockedAt: 1700000000123 }];
    const rules = await storage.listBlockedIps();
    assert.equal(rules[0].ipAddress, "192.0.2.254");
    assert.equal(rules[0].blockedAt?.getTime(), 1700000000123);
    payload = [{ id: 8, ipAddress: "2001:db8::1", city: null, country: null, blockedAt: null }];
    assert.equal((await storage.listBlockedIps())[0].blockedAt, null);
    payload = null;
    await assert.rejects(storage.listBlockedIps(), /Invalid database result/);
    fail = true;
    await assert.rejects(storage.listBlockedIps(), /Simulated database outage/);
  } finally {
    db.select = original;
  }
});
