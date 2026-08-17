import assert from "node:assert/strict";
import test from "node:test";

process.env.NODE_ENV = "test";

const {
  codexAccessTokenExpired,
  rateLimitWindowDurationMins,
  weeklyOnlyCodexSnapshot,
  weeklyQuotaWindow,
} = await import("../server.js");

function jwt(payload) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none" })}.${encode(payload)}.`;
}

test("weekly quota is identified by its 10080-minute duration", () => {
  const fiveHour = { usedPercent: 10, windowDurationMins: 300 };
  const weekly = { usedPercent: 20, windowDurationMins: 10080 };
  assert.equal(weeklyQuotaWindow({ primary: fiveHour, secondary: weekly }), weekly);
  assert.equal(weeklyQuotaWindow({ primary: weekly, secondary: null }), weekly);
  assert.equal(rateLimitWindowDurationMins({ window_duration_mins: "10080" }), 10080);
});

test("Codex snapshots expose only the weekly window", () => {
  const fiveHour = { usedPercent: 10, windowDurationMins: 300 };
  const weekly = { usedPercent: 20, windowDurationMins: 10080 };
  const normalized = weeklyOnlyCodexSnapshot({
    rateLimitsByLimitId: { codex: { primary: fiveHour, secondary: weekly } },
  });
  assert.equal(normalized.weekly, weekly);
  assert.equal(normalized.primary, weekly);
  assert.equal(normalized.secondary, null);
  assert.throws(
    () => weeklyOnlyCodexSnapshot({ rateLimits: { primary: fiveHour } }),
    /weekly quota window/,
  );
});

test("expired Codex access tokens can fail before app-server startup", () => {
  const auth = { tokens: { access_token: jwt({ exp: 100 }) } };
  assert.equal(codexAccessTokenExpired(auth, 100_000), true);
  assert.equal(codexAccessTokenExpired(auth, 99_000), false);
  assert.equal(codexAccessTokenExpired({ tokens: { access_token: "opaque" } }, 100_000), false);
});
