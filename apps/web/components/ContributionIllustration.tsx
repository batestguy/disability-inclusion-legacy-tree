type Props = { activityId: string; unit: string };

/** Original decorative SVGs describe the programme topic, never its scale or delivery status. */
export default function ContributionIllustration({ activityId, unit }: Props) {
  const type = unit === "vehicle" ? "vehicle" : unit === "toolkit" ? "toolkit"
    : unit === "households" ? "household"
    : activityId === "fha-stalls-2025" ? "stall"
    : activityId === "startup-support-march-2024" ? "pos"
    : activityId === "nigwed-skills-2024" ? "sewing"
    : activityId === "inclusive-business-skills" ? "skills"
    : activityId === "ayubson-event-2025" ? "participation"
    : activityId === "borno-employment-2024" || activityId === "beyond-disability-coordination-2024" ? "employment"
    : activityId === "karu-food-cash-2024" ? "food-cash" : "food";
  return <svg className="contribution-illustration" data-illustration={type} viewBox="0 0 80 68" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <ellipse cx="40" cy="60" rx="31" ry="4" className="art-ground" />
    {type === "vehicle" ? <>
      <path d="m13 34 9-17h31l12 17 5 3v17H10V39l3-5Z" className="art-blue-fill art-blue-line" />
      <path d="m25 21-7 13h40l-8-13H25Z" className="art-paper-fill" />
      <path d="M38 21v13M13 39h10M58 39h9" className="art-blue-line" />
      <circle cx="23" cy="54" r="7" className="art-ink-fill" /><circle cx="23" cy="54" r="3" className="art-gold-fill" />
      <circle cx="58" cy="54" r="7" className="art-ink-fill" /><circle cx="58" cy="54" r="3" className="art-gold-fill" />
      <circle cx="55" cy="16" r="12" className="art-green-fill" /><circle cx="55" cy="10" r="2" className="art-paper-fill" />
      <path d="M55 15v6h5l2 4M52 18a5 5 0 1 0 5 7" className="art-paper-line" />
    </> : type === "toolkit" ? <>
      <path d="M40 18c-9-6-20-6-30-2v38c11-4 21-2 30 3 9-5 19-7 30-3V16c-10-4-21-4-30 2Z" className="art-blue-fill art-blue-line" />
      <path d="M40 20c-8-6-17-7-26-4v33c10-2 18 0 26 5 8-5 16-7 26-5V16c-9-3-18-2-26 4Z" className="art-paper-fill" />
      <path d="M40 21v32M21 25h10M21 31h10M21 37h7" className="art-blue-line" />
      <path d="M49 14v19l5-4 5 4V13Z" className="art-gold-fill" />
      <circle cx="61" cy="47" r="12" className="art-green-fill" /><path d="m55 47 4 4 8-9" className="art-paper-line" />
    </> : type === "stall" ? <>
      <path d="M16 28h49v31H16Z" className="art-blue-soft-fill art-blue-line" />
      <path d="m11 27 8-16h43l8 16H11Z" className="art-green-fill" />
      <path d="m27 11-4 16h12l1-16M47 11l2 16h12l-5-16" className="art-paper-fill" />
      <path d="M11 27v4c0 5 12 5 12 0 0 5 12 5 12 0 0 5 14 5 14 0 0 5 12 5 12 0 0 5 9 5 9 0v-4" className="art-green-line" />
      <path d="M23 40h19v19H23Z" className="art-gold-fill" /><path d="M49 40h10v10H49Z" className="art-blue-fill" />
      <path d="M12 60h57" className="art-ink-line" />
    </> : type === "pos" ? <>
      <path d="m25 14 33 3-3 43-34-3 4-43Z" className="art-blue-fill art-blue-line" />
      <path d="m30 8 26 2-1 13-26-2 1-13Z" className="art-paper-fill art-blue-line" />
      <path d="m34 13 16 1M34 17l11 1" className="art-blue-line" />
      <path d="m29 27 22 2-1 11-22-2 1-11Z" className="art-gold-fill" />
      <path d="m30 45 3 .2m5 .5 3 .2m5 .5 3 .2M30 51l3 .2m5 .5 3 .2" className="art-paper-line" />
      <circle cx="60" cy="47" r="11" className="art-green-fill" /><path d="m55 47 3 3 6-7" className="art-paper-line" />
    </> : type === "sewing" ? <>
      <path d="M13 54h55v6H13Z" className="art-blue-fill" /><path d="M17 27h18v-8h22l8 9v17H37v-9H25v10H17V27Z" className="art-green-fill art-green-line" />
      <path d="M21 39v14M17 46h14M49 13v6" className="art-ink-line" /><path d="M44 9h10v6H44Z" className="art-gold-fill" />
      <circle cx="56" cy="30" r="5" className="art-paper-fill" /><path d="M12 50h29v5H12Z" className="art-gold-fill" />
      <path d="M13 52h22" className="art-blue-line" /><path d="M40 28h7" className="art-paper-line" />
    </> : type === "skills" ? <>
      <path d="M13 12h37v43H13Z" className="art-paper-fill art-blue-line" /><path d="M21 22h20M21 28h15M21 34h12" className="art-blue-line" />
      <path d="m34 45 6 16 5-6 6 2-7-17Z" className="art-gold-fill" /><circle cx="39" cy="41" r="9" className="art-green-fill" />
      <path d="m35 41 3 3 5-6" className="art-paper-line" /><path d="M53 29h13v29H53Z" className="art-blue-fill art-blue-line" />
      <path d="M57 26h5v9h-5Z" className="art-gold-fill" /><path d="M58 42h4M58 48h4" className="art-paper-line" />
    </> : type === "participation" ? <>
      <circle cx="25" cy="23" r="7" className="art-blue-fill" /><path d="M12 51v-9c0-14 26-14 26 0v9" className="art-blue-soft-fill art-blue-line" />
      <circle cx="56" cy="22" r="6" className="art-green-fill" /><path d="M44 49v-9c0-12 24-12 24 0v9" className="art-green-soft-fill art-green-line" />
      <path d="M42 16v14h10l5 14" className="art-gold-line" /><circle cx="40" cy="45" r="12" className="art-gold-line" />
      <path d="M16 57h49" className="art-ink-line" />
    </> : type === "employment" ? <>
      <path d="M27 20v-7h25v7" className="art-green-line" /><rect x="10" y="22" width="60" height="36" rx="5" className="art-blue-fill art-blue-line" />
      <path d="M11 35c18 9 40 9 58 0" className="art-paper-line" /><path d="M35 35h10v12H35Z" className="art-gold-fill" />
      <path d="m53 9 15 3-4 23-15-3 4-23Z" className="art-paper-fill art-green-line" /><circle cx="58" cy="18" r="3" className="art-green-fill" />
      <path d="m54 25 7 1" className="art-green-line" />
    </> : type === "household" ? <>
      <path d="m11 33 27-22 28 22" className="art-blue-line" /><path d="M17 29v30h42V29L38 13 17 29Z" className="art-blue-soft-fill art-blue-line" />
      <path d="M25 38h11v21H25Z" className="art-green-fill" /><path d="M44 36h9v10h-9Z" className="art-gold-fill" />
      <path d="m50 48 19-3 3 16H49l1-13Z" className="art-gold-fill art-gold-line" /><path d="m56 47 2-10m-2 6-4-3m6-1 4-3" className="art-green-line" />
    </> : <>
      <path d="M21 31c-2-10-5-13-9-14M24 31c3-10 5-15 10-18" className="art-green-line" />
      <path d="M18 24c-8 0-11-6-10-12 8 0 12 6 10 12Zm9-1c0-9 5-13 11-13 1 7-3 13-11 13Z" className="art-green-fill" />
      <path d="m40 31 5-23c9 0 14 3 15 8l-7 19" className="art-gold-fill art-gold-line" />
      <path d="m46 17 8 2m-9 4 7 2" className="art-paper-line" />
      <path d="m14 31 48 1-5 27H20l-6-28Z" className="art-blue-soft-fill art-blue-line" /><path d="M24 33v-7h27v7" className="art-blue-line" />
      <path d="M31 43h15M31 48h11" className="art-green-line" />
      {type === "food-cash" && <><path d="m48 40 22-7 5 17-22 7-5-17Z" className="art-green-fill" /><circle cx="61" cy="45" r="4" className="art-gold-fill" /></>}
    </>}
  </svg>;
}
