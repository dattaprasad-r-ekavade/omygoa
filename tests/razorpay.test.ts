import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { verifyRazorpaySignature } from "../lib/payments/razorpay";

test("accepts a Razorpay HMAC signature", () => {
  const secret = "whsec_demo";
  const body = JSON.stringify({ event: "payment.captured" });
  const signature = createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(verifyRazorpaySignature(body, signature, secret), true);
});

test("rejects a tampered body", () => {
  const secret = "whsec_demo";
  const signature = createHmac("sha256", secret).update("original").digest("hex");
  assert.equal(verifyRazorpaySignature("tampered", signature, secret), false);
  assert.equal(verifyRazorpaySignature("original", null, secret), false);
});
