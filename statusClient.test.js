const test = require("node:test");
const assert = require("node:assert/strict");
const { describeStatusClient, normalizeRegisteredClientType } = require("./statusClient");

test("native app registration identifies iOS and Android clients", () => {
  const socket = { handshake: { headers: { "user-agent": "Android Chrome/120.0" } } };
  assert.equal(describeStatusClient(socket, "ios-app"), "iOS App");
  assert.equal(describeStatusClient(socket, "android-app"), "Android App");
});

test("headless registration identifies the client independently of its user agent", () => {
  const socket = { handshake: { headers: { "user-agent": "talktome-headless/1.0.0" } } };
  assert.equal(normalizeRegisteredClientType("headless"), "headless");
  assert.equal(normalizeRegisteredClientType(" HEADLESS "), "headless");
  assert.equal(describeStatusClient(socket, "headless"), "Headless");
  assert.equal(describeStatusClient({}, "headless"), "Headless");
});

test("browser and unknown registrations keep the user-agent description", () => {
  const socket = { handshake: { headers: { "user-agent": "iPhone Safari/17.0" } } };
  assert.equal(describeStatusClient(socket), "iPhone Safari");
  assert.equal(describeStatusClient(socket, "spoofed-client"), "iPhone Safari");
  assert.equal(normalizeRegisteredClientType(" ANDROID-APP "), "android-app");
  assert.equal(normalizeRegisteredClientType({ value: "ios-app" }), null);
});
