import bundle from "../../../content/dashboard/v1/bundle.json";
import manifest from "../../../content/dashboard/v1/manifest.json";
import { assertChatPreviewAllowed } from "./chat-preview-gate.mjs";

/** This research preview must never become public through an unrelated CMS gate. */
export function getChatData() {
  assertChatPreviewAllowed(process.env.RELEASE_MODE);
  return { bundle, manifest };
}
