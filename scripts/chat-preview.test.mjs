import { test } from "node:test";
import assert from "node:assert/strict";
import { assertChatPreviewAllowed } from "../apps/web/lib/chat-preview-gate.mjs";

test("research chat cannot enter a public build through existing CMS approvals", () => {
  assert.throws(
    () => assertChatPreviewAllowed("public"),
    /Chat preview blocked/,
  );
  assert.doesNotThrow(() => assertChatPreviewAllowed(undefined));
  assert.doesNotThrow(() => assertChatPreviewAllowed("preview"));
});
