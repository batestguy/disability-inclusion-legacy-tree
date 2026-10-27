import bundle from "../../../content/dashboard/v1/bundle.json";
import manifest from "../../../content/dashboard/v1/manifest.json";
import { assertChatPreviewAllowed } from "./chat-preview-gate.mjs";

/** The research dashboard and chat must not become public through an unrelated CMS approval. */
export function getChatData() {
  assertChatPreviewAllowed(process.env.RELEASE_MODE);
  return { bundle, manifest };
}
