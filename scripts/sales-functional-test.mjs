import assert from "node:assert/strict";

const baseUrl = process.env.TEST_BASE_URL || "http://127.0.0.1:5000";

async function request(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await response.json() : await response.text();
  return { response, body };
}

async function run() {
  const home = await request("/");
  assert.equal(home.response.status, 200, "Home page must load");

  const session = await request("/api/sales/session");
  assert.equal(session.response.status, 200, "Sales session endpoint must respond");
  assert.deepEqual(session.body, { verified: false }, "Anonymous visitor must not be verified");

  const brochure = await request("/api/sales/brochure?lang=fr");
  assert.equal(brochure.response.status, 401, "Private brochure must reject anonymous access");
  assert.equal(brochure.body.code, "VERIFICATION_REQUIRED");

  const invalidRegistration = await request("/api/sales/request-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Functional",
      lastName: "Test",
      email: "not-an-email",
      phone: "+34123",
      buyerType: "private_buyer",
      preferredLanguage: "fr",
      consentGiven: true,
    }),
  });
  assert.equal(invalidRegistration.response.status, 400, "Invalid registration must be rejected");
  assert.equal(invalidRegistration.body.code, "VALIDATION_ERROR");

  console.log("Sales functional checks passed.");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});