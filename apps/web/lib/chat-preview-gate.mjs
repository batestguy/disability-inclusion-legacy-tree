/** Separate research-preview gate; existing CMS approvals cannot approve this bundle. */
export function assertChatPreviewAllowed(releaseMode) {
  if (releaseMode === "public") {
    throw new Error(
      "Chat preview blocked: reviewed subset and Hausa are not approved for public release.",
    );
  }
}
