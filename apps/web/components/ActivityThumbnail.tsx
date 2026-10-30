"use client";

import { useState } from "react";
import Image from "next/image";
import ContributionIllustration from "./ContributionIllustration";

/** Illustrations indicate a record's topic, never a measured outcome. */
export default function ActivityThumbnail({ activityId, groupIds, unit }: { activityId: string; groupIds: string[]; unit?: string }) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const photo = activityId === "nigwed-skills-2024" && !photoFailed;
  const topic = groupIds.includes("training-education") ? "education" : groupIds.includes("health-welfare") ? "health" : groupIds.includes("accessibility") ? "access" : groupIds.includes("employment") || groupIds.includes("enterprise-support") ? "work" : "record";
  return <span className={`activity-thumbnail is-${topic}`} data-thumbnail-kind={photo ? "source-photo" : "illustration"} aria-hidden="true">
    {photo ? <Image src="/branding/mohammed-abba-isa-speaking.webp" width={600} height={800} sizes="64px" alt="" onError={() => setPhotoFailed(true)} /> : unit ? <ContributionIllustration activityId={activityId} unit={unit} /> : <svg viewBox="0 0 64 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      {topic === "education" ? <><path d="M32 14c-9-5-17-5-24-2v32c9-3 16-1 24 3 8-4 15-6 24-3V12c-7-3-15-3-24 2Zm0 0v33" /><path d="M15 20h9m-9 8h9m16-8h9m-9 8h9" /></> : topic === "health" ? <><path d="M24 9h16v12h12v15H40v12H24V36H12V21h12Z" /><path d="M29 22h6v7h7v6h-7v7h-6v-7h-7v-6h7Z" fill="currentColor" stroke="none" /></> : topic === "access" ? <><circle cx="32" cy="9" r="4" /><path d="m15 20 17 5 17-5M32 25v10m0 0-13 13m13-13 13 13" /><circle cx="32" cy="29" r="24" strokeDasharray="3 5" /></> : topic === "work" ? <><rect x="8" y="18" width="48" height="30" rx="4" /><path d="M23 18v-7h18v7M8 30c15 7 33 7 48 0M29 31h6v8h-6Z" /></> : <><path d="M15 7h25l10 10v33H15Z M40 7v12h10M23 27h18m-18 8h18m-18 8h10" /><circle cx="48" cy="39" r="10" fill="white" /><path d="m44 39 3 3 6-7" /></>}
    </svg>}
  </span>;
}
