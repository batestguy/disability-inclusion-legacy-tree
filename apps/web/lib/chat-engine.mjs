/** Local, deterministic preview engine. No network, persistence or raw-query receipts. */
const CATALOGUE = {
  smedan: {
    activity: "inclusive-business-skills",
    observation: "inclusive-business-skills:participants-supported",
    match: /\bsmedan\b/,
    label: { en: "SMEDAN", ha: "SMEDAN" },
  },
  nigwed: {
    activity: "nigwed-skills-2024",
    observation: "nigwed-skills-2024:trainees",
    match: /\bnig\s?wed\b/,
    label: { en: "NIGWED training", ha: "Horon NIGWED" },
  },
  startup: {
    activity: "startup-support-march-2024",
    observation: "startup-support-march-2024:recipients",
    match: /\b(start\s?up|pos|pdich)\b/,
    label: { en: "March startup support", ha: "Tallafin fara sana’a na Maris" },
  },
  borno: {
    activity: "borno-employment-2024",
    observation: "borno-employment-2024:placements",
    match: /\bborno\b/,
    label: { en: "Borno placements", ha: "Samar da aikin Borno" },
  },
  beyond: {
    activity: "beyond-disability-coordination-2024",
    observation: "beyond-disability-coordination-2024:projected-opportunities",
    match: /\b(beyond disability|36551)\b/,
    label: { en: "Beyond Disability target", ha: "Burin Beyond Disability" },
  },
};
const unique = (values) => [...new Set(values)];
const normalise = (s) =>
  s
    .toLowerCase()
    .normalize("NFKC")
    .replace(/36[,\s]551/g, "36551")
    .replace(/[’‘]/g, "'")
    .replace(/[-–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const copy = (value) => JSON.parse(JSON.stringify(value));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const yearsIn = (q) => unique(q.match(/\b(?:19|20)\d{2}\b/g) || []).map(Number);
// Explicit population summaries use checked source contexts, never an inferred
// gender split of an otherwise mixed cohort.
const WOMEN_SUMMARY = [
  {
    programme: "nigwed",
    sourceId: "3531",
    population:
      "Women with disabilities trained in reusable sanitary-pad production",
  },
  {
    programme: "startup",
    sourceId: "2279",
    population:
      "Women with disabilities receiving POS equipment and startup kits",
  },
];
function isWomenSummary(question) {
  const subject =
    "(?:he|isa|abba isa|mohammed abba isa|hon\\.? (?:mohammed )?abba isa)";
  const population = "(?:disabled women|women with disabilities)";
  const english = new RegExp(
    `^(?:what (?:has ${subject} done|did ${subject} do|does ${subject} do) for ${population}|how (?:has|does|did) ${subject} (?:help|support|helped|supported) ${population}|(?:tell me|show me) (?:about )?(?:his )?(?:work|support) for ${population}|what support (?:has ${subject} provided|is documented) for ${population})[?.!]*$`,
  );
  const hausa =
    /^(?:me (?:ya yi|abba isa ya yi|mohammed abba isa ya yi) (?:wa|ga) mata masu nakasa|ta yaya (?:ya|abba isa ya) tallafa wa mata masu nakasa|wane tallafi (?:ya|abba isa ya) bayar (?:ga|wa) mata masu nakasa|(?:nuna|bayyana) (?:ayyukan|tallafin) (?:da ya yi wa |ga )?mata masu nakasa)[?.!]*$/;
  const scoped = question.replace(
    / (?:reported in|in report year|in|a shekarar rahoto) (?:19|20)\d{2}[?.!]*$/,
    "",
  );
  return english.test(scoped) || hausa.test(scoped);
}
// Follow-ups may change only the year. Every other qualifier needs its own plan.
const bareYearFollowup =
  /^(?:(?:and|what about|how about)(?: (?:in|for|report year|publication year))? |(?:in|for|report year|publication year) |(?:kuma|da)(?: a)? |(?:a|shekarar rahoto|a shekarar rahoto|kuma a shekarar rahoto) )?(?:19|20)\d{2}[?.!]*$/;
const fields = (object, allowed) =>
  object && Object.keys(object).every((key) => allowed.includes(key));
const evidenceIds = (o) =>
  unique(
    o.evidence.flatMap((e) => e.source_ids || [e.source_id]).filter(Boolean),
  );

function usable(bundle) {
  try {
    return (
      bundle?.schema_version === 1 &&
      bundle.dataset_version === "v1" &&
      bundle.status === "reviewed-subset-preview-not-public-approved" &&
      [
        "activities",
        "observations",
        "sources",
        "categories",
        "topics",
        "entities",
        "partnerships",
      ].every((key) => Array.isArray(bundle[key])) &&
      ["activities", "observations", "sources"].every(
        (key) =>
          new Set(bundle[key].map((r) => r.id)).size === bundle[key].length,
      ) &&
      bundle.activities.every(
        (a) =>
          typeof a.id === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(a.report_date) &&
          a.title?.en &&
          Array.isArray(a.source_ids) &&
          a.source_ids.length &&
          a.source_ids.every((id) => bundle.sources.some((s) => s.id === id)),
      )
    );
  } catch {
    return false;
  }
}

function base(bundle, context = {}) {
  return {
    status: "answered",
    kind: "none",
    reason: "",
    context: copy(context),
    plan: null,
    claims: [],
    sourceIds: [],
    activityIds: [],
    observationIds: [],
    sources: [],
    items: [],
    choices: [],
    snapshot: {
      version: bundle?.dataset_version || "",
      date: bundle?.dataset_date || "",
      status: bundle?.status || "",
    },
  };
}
function outcome(bundle, context, status, reason) {
  const answer = { ...base(bundle, context), status, reason };
  if (status === "clarification")
    answer.choices = suggestedQuestions("en", context).map(({ question }) => ({
      question,
      label: {
        en: question,
        ha:
          suggestedQuestions("ha", context).find((s) => s.question === question)
            ?.label || question,
      },
    }));
  if (status === "clarification" && reason === "programme")
    answer.choices = Object.entries(CATALOGUE)
      .filter(
        ([key]) =>
          context.intent !== "summary" ||
          WOMEN_SUMMARY.some((entry) => entry.programme === key),
      )
      .map(([key, entry]) => ({
        question:
          key === "startup"
            ? "How many startup recipients?"
            : key === "beyond"
              ? "Were 36,551 jobs delivered?"
              : `How many ${key} people?`,
        label: copy(entry.label),
      }));
  if (status === "clarification" && reason === "year")
    answer.choices = [2023, 2024, 2025, 2026].map((year) => ({
      question: `Show activities reported in ${year}`,
      label: { en: `Report year ${year}`, ha: `Shekarar rahoto ${year}` },
    }));
  if (status === "clarification" && reason === "year-global")
    answer.choices = [
      {
        question: "Start again",
        label: {
          en: "Clear context and report year",
          ha: "Cire zabin shiri da shekarar rahoto",
        },
      },
    ];
  return answer;
}
function countClaim(rows, year) {
  return {
    metric: "documented-activity-count",
    value: rows.length,
    bound: "exact",
    unit: "activities",
    population:
      "Distinct documented activity records in the reviewed-subset preview",
    stage: "mixed-reporting-stages",
    dateBasis: "reportDate",
    reportYear: year ?? null,
    attribution: "Selected office reports; not independent verification",
    activityIds: rows.map((a) => a.id),
    observationIds: [],
    sourceIds: unique(rows.flatMap((a) => a.source_ids)),
  };
}
function measureClaim(o) {
  return {
    metric: o.id,
    value: o.value,
    bound: o.bound,
    unit: o.unit,
    population: o.population,
    stage: o.stage,
    dateBasis: "reportDate",
    reportDate: o.report_date,
    evidenceDateBasis: o.date_basis,
    attribution: o.isa_role,
    activityIds: [o.activity_id],
    observationIds: [o.id],
    sourceIds: evidenceIds(o),
    limitations: copy(o.limitations),
  };
}

/** Execute only this module's small, strict plan vocabulary. Throws on malformed evidence. */
function execute(bundle, plan, context) {
  if (
    !usable(bundle) ||
    !fields(plan, [
      "operation",
      "dateBasis",
      "programme",
      "reportYear",
      "term",
      "catalogue",
    ]) ||
    plan.dateBasis !== "reportDate" ||
    (plan.reportYear !== undefined &&
      (!Number.isInteger(plan.reportYear) ||
        plan.reportYear < 1900 ||
        plan.reportYear > 2099))
  )
    throw Error("Invalid plan");
  const answer = {
    ...base(bundle, context),
    plan: copy(plan),
    kind: plan.operation,
  };
  if (["count", "list"].includes(plan.operation)) {
    if (plan.programme || plan.term || plan.catalogue)
      throw Error("Unexpected filter");
    const rows = bundle.activities.filter(
      (a) =>
        !plan.reportYear ||
        Number(a.report_date.slice(0, 4)) === plan.reportYear,
    );
    answer.claims = [countClaim(rows, plan.reportYear)];
    answer.activityIds = rows.map((a) => a.id);
    answer.sourceIds = unique(rows.flatMap((a) => a.source_ids));
    if (plan.operation === "list")
      answer.items = rows.map((a) => ({
        id: a.id,
        label: copy(a.title),
        reportDate: a.report_date,
      }));
  } else if (["measurement", "report-year"].includes(plan.operation)) {
    if (
      plan.term ||
      plan.catalogue ||
      !Object.hasOwn(CATALOGUE, plan.programme)
    )
      throw Error("Invalid programme");
    const entry = CATALOGUE[plan.programme];
    const o = bundle.observations.find((row) => row.id === entry.observation);
    const a = bundle.activities.find((row) => row.id === entry.activity);
    if (
      !o ||
      !a ||
      !a.observation_ids.includes(o.id) ||
      o.activity_id !== a.id ||
      !Number.isFinite(o.value) ||
      !["exact", "greater-than", "at-least", "approximate"].includes(o.bound) ||
      o.stage !==
        (plan.programme === "beyond" ? "target" : "reported-delivery") ||
      o.unit !==
        (plan.programme === "beyond" ? "job opportunities" : "people") ||
      !o.population ||
      !o.isa_role ||
      !o.date_basis ||
      !Array.isArray(o.limitations) ||
      !Array.isArray(o.evidence) ||
      !o.evidence.length ||
      !evidenceIds(o).length ||
      evidenceIds(o).some(
        (id) =>
          !a.source_ids.includes(id) ||
          !bundle.sources.some((s) => s.id === id),
      ) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(o.report_date)
    )
      throw Error("Invalid measurement evidence");
    if (
      plan.reportYear &&
      Number(o.report_date.slice(0, 4)) !== plan.reportYear
    )
      return outcome(bundle, context, "unsupported", "year-mismatch");
    answer.claims = [measureClaim(o)];
    if (plan.operation === "report-year")
      answer.claims = [
        {
          ...measureClaim(o),
          metric: "report-year",
          value: Number(o.report_date.slice(0, 4)),
          bound: "exact",
          unit: "report year",
        },
      ];
    answer.activityIds = [a.id];
    answer.observationIds = [o.id];
    answer.sourceIds = evidenceIds(o);
  } else if (plan.operation === "summary") {
    if (plan.programme || plan.term || plan.catalogue !== "women-disabilities")
      throw Error("Invalid summary");
    for (const entry of WOMEN_SUMMARY) {
      const measured = execute(
        bundle,
        {
          operation: "measurement",
          dateBasis: "reportDate",
          programme: entry.programme,
        },
        {},
      );
      const observation = bundle.observations.find(
        (o) => o.id === CATALOGUE[entry.programme].observation,
      );
      const evidence = observation?.evidence.find(
        (e) =>
          e.source_id === entry.sourceId &&
          e.population === entry.population &&
          e.stage === "reported-delivery",
      );
      // Bind this population-specific wording to the reviewed excerpt and bound.
      if (
        !evidence ||
        observation.bound !== "greater-than" ||
        evidence.original_numeric_wording !== `over ${observation.value}` ||
        !evidence.text.includes(String(observation.value))
      )
        throw Error("Invalid women-specific evidence");
      if (
        plan.reportYear &&
        Number(observation.report_date.slice(0, 4)) !== plan.reportYear
      )
        continue;
      const claim = { ...measured.claims[0], population: entry.population };
      answer.claims.push(claim);
      const value = claim.value.toLocaleString("en-GB");
      answer.items.push({
        id: observation.activity_id,
        label:
          entry.programme === "nigwed"
            ? {
                en: `Skills training: the office reported working with NigWED to train and support more than ${value} women with disabilities in reusable sanitary-pad production.`,
                ha: `Horon sana'a: ofishinsa ya ruwaito cewa ya haɗa kai da NigWED wajen horar da mata masu nakasa fiye da ${value} kan ƙera audugar jinin haila da ake iya wankewa a sake amfani da ita, tare da tallafa musu.`,
              }
            : {
                en: `Business support: more than ${value} women with disabilities were reported as recipients in a programme organised with partners providing POS machines and other startup kits. Individual packages were not verified.`,
                ha: `Tallafin fara sana'a: an ruwaito cewa mata masu nakasa fiye da ${value} sun samu tallafi a wani shiri da aka gudanar tare da ƙungiyoyin haɗin gwiwa, inda aka bayar da injinan POS da wasu kayan fara sana'a. Ba a tantance kayan da kowace mace ta samu ba.`,
              },
        reportDate: observation.report_date,
        sourceIds: [entry.sourceId],
        evidence: evidence.text,
        limitations: observation.limitations.join(" "),
      });
    }
    answer.activityIds = unique(answer.claims.flatMap((c) => c.activityIds));
    answer.observationIds = unique(
      answer.claims.flatMap((c) => c.observationIds),
    );
    answer.sourceIds = unique(answer.claims.flatMap((c) => c.sourceIds));
    if (!answer.claims.length) answer.reason = "no-matches";
  } else if (plan.operation === "lookup") {
    if (
      plan.programme ||
      plan.catalogue ||
      typeof plan.term !== "string" ||
      plan.term.length < 2 ||
      plan.term.length > 80
    )
      throw Error("Invalid lookup");
    const term = normalise(plan.term);
    const matchingSources = bundle.sources.filter((s) =>
      normalise(`${s.id} ${s.title}`).includes(term),
    );
    const rows = bundle.activities.filter(
      (a) =>
        (!plan.reportYear ||
          Number(a.report_date.slice(0, 4)) === plan.reportYear) &&
        (normalise(
          `${a.title.en} ${a.title.ha || ""} ${(a.participants_or_institutions || []).join(" ")} ${(a.geography || []).join(" ")}`,
        ).includes(term) ||
          a.source_ids.some((id) => matchingSources.some((s) => s.id === id))),
    );
    answer.activityIds = rows.map((a) => a.id);
    answer.sourceIds = unique(rows.flatMap((a) => a.source_ids));
    answer.items = rows.map((a) => ({
      id: a.id,
      label: copy(a.title),
      reportDate: a.report_date,
    }));
    answer.reason = rows.length ? "lookup" : "no-matches";
  } else if (plan.operation === "catalogue") {
    if (
      plan.programme ||
      plan.term ||
      plan.reportYear ||
      ![
        "categories",
        "topics",
        "organisations",
        "places",
        "connections",
      ].includes(plan.catalogue)
    )
      throw Error("Invalid catalogue");
    const rows =
      plan.catalogue === "organisations"
        ? bundle.entities.filter((e) => e.kind === "organisation")
        : plan.catalogue === "places"
          ? bundle.entities.filter((e) => e.kind === "place")
          : plan.catalogue === "connections"
            ? bundle.partnerships
            : bundle[plan.catalogue];
    answer.items = rows.map((r) => ({
      id: r.id,
      label:
        plan.catalogue === "connections"
          ? {
              en:
                r.entity_ids
                  .map(
                    (id) =>
                      bundle.entities.find((e) => e.id === id)?.label || id,
                  )
                  .join(" / ") + ` — ${r.kind.replaceAll("-", " ")}`,
            }
          : typeof r.label === "object"
            ? copy(r.label)
            : { en: r.label || r.id },
      ...(r.kind ? { kind: r.kind } : {}),
      ...(r.limitations ? { limitations: r.limitations } : {}),
      ...(r.evidence
        ? {
            reportDate: r.evidence.report_date,
            sourceIds: [r.evidence.source_id],
            evidence: r.evidence.text,
          }
        : {}),
    }));
    if (plan.catalogue === "topics")
      answer.sourceIds = unique(
        rows.flatMap((r) => r.representative_source_ids),
      );
    if (plan.catalogue === "connections")
      answer.sourceIds = unique(rows.map((r) => r.evidence.source_id));
  } else if (plan.operation === "explanation") {
    if (
      plan.programme ||
      plan.term ||
      plan.reportYear ||
      !["method", "scope", "network"].includes(plan.catalogue)
    )
      throw Error("Invalid explanation");
    answer.reason = plan.catalogue;
  } else throw Error("Unsupported operation");
  answer.sources = answer.sourceIds.map((id) => {
    const s = bundle.sources.find((row) => row.id === id);
    if (!s || !/^https:\/\//.test(s.url)) throw Error("Missing source");
    return {
      id: s.id,
      title: s.title,
      url: s.url,
      publisher: s.publisher,
      date: s.date,
    };
  });
  return answer;
}

/** A conservative bilingual phrase router; clarification is a supported outcome. */
export function answerQuestion(bundle, question, previous = {}) {
  const context = {};
  if (Object.hasOwn(CATALOGUE, previous?.programme))
    context.programme = previous.programme;
  if (
    Number.isInteger(previous?.reportYear) &&
    previous.reportYear >= 1900 &&
    previous.reportYear <= 2099
  )
    context.reportYear = previous.reportYear;
  if (
    ["count", "list", "measurement", "report-year", "summary"].includes(
      previous?.intent,
    )
  )
    context.intent = previous.intent;
  if (!usable(bundle)) return outcome(bundle, {}, "error", "invalid-bundle");
  if (
    typeof question !== "string" ||
    !question.trim() ||
    question.length > 1200
  )
    return outcome(bundle, context, "clarification", "question");
  const q = normalise(question);
  if (/^(reset|start again|clear|sake farawa|fara sabo)[.!?]?$/.test(q))
    return outcome(bundle, {}, "clarification", "reset");
  // These are semantic refusals, not a security filter: only validated plans execute below.
  if (
    /\b(money|naira|cash total|amount|spent|budget|cost|kudi|kuɗi|nawa aka kashe)\b/.test(
      q,
    )
  )
    return outcome(bundle, context, "unsupported", "money");
  if (
    /\b(unique|overall|altogether|combined|lifetime|total people|total beneficiaries|jimillar mutane|gaba daya)\b/.test(
      q,
    )
  )
    return outcome(bundle, context, "unsupported", "unique-people");
  if (
    /\b(cause|caused|impact|reduced poverty|income|because of|solely|created all|tasiri|talauci|kudin shiga)\b/.test(
      q,
    )
  )
    return outcome(bundle, context, "unsupported", "causality");
  if (
    /\b(not|except|excluding|without|didn't|wasn't|ba|banda|ban da)\b/.test(q)
  )
    return outcome(bundle, context, "clarification", "negation");
  const years = yearsIn(q);
  if (
    years.length > 1 ||
    /\b(last year|this year|last month|bara|bana)\b/.test(q) ||
    (/\bwace shekarar\b/.test(q) &&
      !/\b(reported|report|rahot|bayyana)\w*/.test(q))
  )
    return outcome(bundle, context, "clarification", "year");
  if (
    /\b(event year|actually happen|took place|event date|ranar taron|shekarar da aka gudanar)\b/.test(
      q,
    )
  )
    return outcome(bundle, context, "unsupported", "event-date");
  const lookup = q.match(
    /^(?:find|search|look up|source|nemo|bincika|tushe)\s*[: ]\s*(.+?)[?]?$/,
  );
  const womenSummary = !lookup && isWomenSummary(q);
  const explicit = lookup
    ? []
    : Object.keys(CATALOGUE).filter((key) => CATALOGUE[key].match.test(q));
  // "startup kits" also appears in SMEDAN; require an unambiguous named programme.
  if (explicit.length > 1)
    return outcome(bundle, context, "clarification", "programme");
  const followup =
    /^(and\b|what about\b|how about\b|a |da |kuma\b)|\b(that|it|wannan|hakan)\b/.test(
      q,
    ) || bareYearFollowup.test(q);
  const programme =
    lookup || womenSummary
      ? undefined
      : explicit[0] || (followup ? context.programme : undefined);
  const reportYear = years[0] ?? context.reportYear;
  const plan = { operation: "", dateBasis: "reportDate" };
  if (reportYear) plan.reportYear = reportYear;
  if (
    womenSummary ||
    (context.intent === "summary" && bareYearFollowup.test(q))
  ) {
    plan.operation = "summary";
    plan.catalogue = "women-disabilities";
  } else if (
    context.intent === "summary" &&
    /\b(which year|what year|when|wace shekara|yaushe)\b/.test(q) &&
    !explicit.length
  ) {
    return outcome(bundle, context, "clarification", "programme");
  } else if (programme) {
    if (
      /\b(activities|activity|records|sources|organisations|organizations|ayyuka)\b/.test(
        q,
      ) ||
      (!/^and\b/.test(q) && /\band (how|what|which|show|list)\b/.test(q))
    )
      return outcome(bundle, context, "clarification", "question");
    if (
      programme === "beyond" &&
      /\b(people|persons?|participants?|recipients?|beneficiaries|mutane|masu)\b/.test(
        q,
      )
    )
      return outcome(bundle, context, "unsupported", "unit");
    if (
      /\b(households?|pads?|stalls?|schools?|percent|percentage|average|mean|median|gidaje|kashi|matsakaici)\b/.test(
        q,
      ) ||
      (/\b(kits?|machines?|equipment|kayayyaki)\b/.test(q) &&
        !/\b(recipients?|participants?|people|women|mutane|mata|masu)\b/.test(
          q,
        ))
    )
      return outcome(bundle, context, "unsupported", "unit");
    if (
      /\b(men|boys|males|maza)\b/.test(q) ||
      (programme !== "nigwed" && /\b(women|girls|mata)\b/.test(q))
    )
      return outcome(bundle, context, "unsupported", "population");
    if (
      programme !== "beyond" &&
      /\b(target|targets|planned|projected|burin|manufa)\b/.test(q)
    )
      return outcome(bundle, context, "unsupported", "stage");
    if (
      programme !== "borno" &&
      programme !== "beyond" &&
      /\b(jobs?|employ|employment|placements?|aikin yi|samu aiki)\w*/.test(q)
    )
      return outcome(bundle, context, "unsupported", "stage");
    if (
      !["smedan", "nigwed"].includes(programme) &&
      /\b(train|trainees|training|horar|horon|horo)\w*/.test(q)
    )
      return outcome(bundle, context, "unsupported", "stage");
    // A cohort's broad support count does not establish each asset-specific outcome.
    if (
      programme !== "smedan" &&
      /\b(kits?|machines?|equipment|kayayyaki)\b/.test(q)
    )
      return outcome(bundle, context, "unsupported", "stage");
    const unparsed = q
      .replace(
        /\b(how|many|much|what|which|when|year|was|were|is|are|did|does|do|has|have|had|the|a|an|in|on|by|for|of|to|from|with|and|that|it|about|please|reported|report|publication|documented|canonical|source|sources|supported|support|received|receive|trained|training|trainees|participants|participant|people|person|recipients|recipient|beneficiaries|beneficiary|women|jobs|job|opportunities|target|delivered|employment|placements|employed|smedan|nigwed|nig|wed|startup|start|up|pos|pdich|borno|beyond|disability|36551|march|kits|kit|equipment|exactly|over|more|than|at|least|count|number|nawa|yawan|mutane|mata|masu|shirin|shiri|ta|tallafa|wa|tallafi|tallafin|aikin|suka|samu|horon|horo|an|samar|da|ayyukan|yi|manufa|burin|wace|shekara|shekarar|yaushe|aka|bayar|wannan|rahoto|rahoton|kuma|kamar|\d{4})\b/g,
        "",
      )
      .replace(/[^\p{L}\p{N}]/gu, "");
    if (unparsed) return outcome(bundle, context, "clarification", "filter");
    if (
      !/\b(how many|how much|nawa|yawan|what|which|when|year|reported|report|participants?|people|recipients?|women|jobs?|target|supported|training|trained|placements?|wace|shekara|yaushe|mutane|mata|tallafa|tallafi|horon|horo|samar|manufa|burin|rahoto)\b/.test(
        q,
      ) &&
      !/^(smedan|nigwed|nig wed|borno|startup|beyond disability)[?]?$/.test(
        q,
      ) &&
      !followup
    )
      return outcome(bundle, context, "clarification", "question");
    plan.programme = programme;
    plan.operation = /\b(which year|what year|when|wace shekara|yaushe)\b/.test(
      q,
    )
      ? "report-year"
      : "measurement";
  } else {
    if (lookup) {
      plan.operation = "lookup";
      plan.term = lookup[1].trim();
    } else if (
      /\b(method|methodology|nlp|nmf|tf idf|hanyar nazari)\b/.test(q)
    ) {
      plan.operation = "explanation";
      plan.catalogue = "method";
    } else if (
      /\b(scope|coverage|complete|all career|review status|iyaka|cikakken)\b/.test(
        q,
      )
    ) {
      plan.operation = "explanation";
      plan.catalogue = "scope";
    } else if (
      /\b(co occurrence|network meaning|partnership proof)\b/.test(q)
    ) {
      plan.operation = "explanation";
      plan.catalogue = "network";
    } else if (
      /^(?:show|list|what are|nuna|jera|wadanne)?\s*(?:the )?(categories|topics|themes|organisations|organizations|places|connections|rukuni|rukunai|jigogi|kungiyoyi|wurare|alaka)[?. ]*$/.test(
        q,
      )
    ) {
      plan.operation = "catalogue";
      plan.catalogue = /categor|rukun/.test(q)
        ? "categories"
        : /topic|theme|jigogi/.test(q)
          ? "topics"
          : /organi|kungiyoyi/.test(q)
            ? "organisations"
            : /place|wurare/.test(q)
              ? "places"
              : "connections";
    } else if (
      /\b(activities|activity|records|ayyuka|aiki|bayanan)\b/.test(q) &&
      /\b(how many|count|number|list|show|nawa|yawan|jera|nuna)\b/.test(q)
    ) {
      // Avoid silently ignoring programme/geography/category filters.
      const remainder = q
        .replace(
          /\b(how|many|count|number|of|the|documented|reviewed|selected|preview|activities|activity|records|are|is|were|was|there|in|for|from|during|report|reported|publication|year|years|list|show|all|please|me|nawa|yawan|ayyuka|aiki|a|aka|da|rahoton|rahoto|shekara|shekarar|jera|nuna|bayanan|ke|akwai|rubuta|\d{4})\b/g,
          "",
        )
        .replace(/[^\p{L}\p{N}]/gu, "");
      if (remainder) return outcome(bundle, context, "clarification", "filter");
      plan.operation = /\b(list|show|jera|nuna)\b/.test(q) ? "list" : "count";
    } else if (
      followup &&
      years.length === 1 &&
      ["count", "list"].includes(context.intent)
    ) {
      if (!bareYearFollowup.test(q))
        return outcome(bundle, context, "clarification", "filter");
      plan.operation = context.intent;
    } else return outcome(bundle, context, "clarification", "question");
  }
  if (["catalogue", "explanation"].includes(plan.operation) && reportYear)
    return outcome(bundle, context, "clarification", "year-global");
  const next = {
    ...(programme ? { programme } : {}),
    ...(reportYear ? { reportYear } : {}),
    ...(["count", "list", "measurement", "report-year", "summary"].includes(
      plan.operation,
    )
      ? { intent: plan.operation }
      : {}),
  };
  try {
    const answer = execute(bundle, plan, next);
    if (answer.status === "answered" && !validateAnswer(bundle, answer))
      throw Error("Invalid claim");
    return answer;
  } catch {
    return outcome(bundle, {}, "error", "invalid-evidence");
  }
}

/** Recompute complete candidate claims, selection and evidence against the unchanged bundle. */
export function validateAnswer(bundle, answer) {
  if (!answer || answer.status !== "answered" || !answer.plan) return false;
  try {
    const expected = execute(bundle, answer.plan, answer.context);
    return (
      expected.status === "answered" &&
      [
        "kind",
        "reason",
        "snapshot",
        "claims",
        "activityIds",
        "observationIds",
        "sourceIds",
        "sources",
        "items",
      ].every((key) => same(expected[key], answer[key]))
    );
  } catch {
    return false;
  }
}

const MESSAGES = {
  question: [
    "Try a documented activity count, a named programme, or “find: SMEDAN”.",
    "Tambayi yawan ayyukan da aka rubuta, sunan shiri, ko “nemo: SMEDAN”.",
  ],
  reset: [
    "We can start again. Choose a question below.",
    "Mu fara sabo. Zabi tambaya a kasa.",
  ],
  programme: [
    "Which programme do you mean? Please ask about one programme at a time.",
    "Wane shiri kake nufi? Tambayi shiri guda daya a lokaci daya.",
  ],
  year: [
    "Which report year do you mean? Use an explicit year. Report dates do not establish event dates.",
    "Wace shekarar rahoto kake nufi? Fadi shekara. Ranar rahoto ba ta tabbatar da ranar taron ba.",
  ],
  "year-global": [
    "That catalogue or explanation covers the whole preview, rather than the selected report year. Clear the report-year filter to see it.",
    "Wannan jerin ko bayani ya shafi dukan samfurin, ba shekarar rahoton da aka zaba ba. Cire zabin shekara don ganin sa.",
  ],
  filter: [
    "Please specify a supported report-year filter, or use “find:” for a keyword lookup.",
    "Fadi shekarar rahoto, ko yi amfani da “nemo:” wajen neman kalma.",
  ],
  negation: [
    "Please restate the question positively with one programme or report year. Exclusion and negation are not supported yet.",
    "Sake tambayar da sunan shiri daya ko shekarar rahoto. Har yanzu ba a tallafa wa tambayoyin warewa ko musantawa ba.",
  ],
  money: [
    "This preview does not establish a monetary total. Recipient counts cannot answer how much money was spent.",
    "Wannan samfuri bai tabbatar da jimillar kudi ba. Yawan masu karba ba ya nuna kudin da aka kashe.",
  ],
  "unique-people": [
    "A reliable total of unique beneficiaries is unavailable: cohorts may overlap and units and stages differ. The preview is incomplete.",
    "Ba a da tabbatacciyar jimillar mutane daban daban da suka amfana: kungiyoyin na iya maimaita mutane, kuma ma’auni da matakai sun bambanta. Samfurin bai cika ba.",
  ],
  causality: [
    "These reports do not establish causal impact, income changes or sole attribution. They describe reported activities and claims.",
    "Wadannan rahotanni ba su tabbatar da tasirin sanadi, canjin kudin shiga ko gudummawar mutum daya tak ba. Suna bayyana ayyuka da ikirarin da aka ruwaito.",
  ],
  unit: [
    "That unit is not established for this programme. People, households, production quantities and jobs cannot be substituted for each other.",
    "Ba a tabbatar da wannan ma’auni ga shirin ba. Ba a musanya mutane, gidaje, yawan kayayyaki da ayyukan yi.",
  ],
  population: [
    "That demographic subgroup is not established by this programme’s measurement. I cannot substitute a narrower population for the reported cohort.",
    "Ba a tabbatar da wannan rukunin mutane a ma’aunin shirin ba. Ba zan maye gurbin rukunin da aka ruwaito da wani karamin rukuni ba.",
  ],
  stage: [
    "That outcome or stage is not established for this programme. Reported support, training, employment and targets are distinct.",
    "Ba a tabbatar da wannan sakamako ko mataki ga shirin ba. Tallafi, horo, aikin yi da buri abubuwa ne daban.",
  ],
  "event-date": [
    "Exact event dates are unverified here. I can use the publication/report year instead.",
    "Ba a tabbatar da ainihin ranakun taron a nan ba. Zan iya amfani da shekarar wallafa rahoto.",
  ],
  "year-mismatch": [
    "The selected programme has no matching canonical measurement for that report year. This does not mean no activity occurred.",
    "Babu ma’aunin shirin da ya dace da wannan shekarar rahoto. Wannan ba yana nufin babu abin da ya faru ba.",
  ],
  "invalid-bundle": [
    "The reviewed preview could not be loaded safely. Please reload the page.",
    "Ba a iya loda samfurin da aka duba cikin aminci ba. Sake loda shafin.",
  ],
  "invalid-evidence": [
    "The selected evidence did not pass validation. No numerical answer has been produced.",
    "Shaidar da aka zaba ba ta wuce tantancewa ba. Ba a bayar da amsar adadi ba.",
  ],
  method: [
    "The preview uses reviewed categories, English-source TF-IDF and frozen NMF themes. Themes describe text patterns, not impact or truth probabilities. Hausa labels are drafts; no Hausa corpus analysis is claimed.",
    "Samfurin yana amfani da rukunan da aka duba, TF-IDF na rubutun Turanci da jigogin NMF. Jigogi suna bayyana tsarin rubutu, ba tasiri ko yiwuwar gaskiya ba. Sunayen Hausa daftari ne; ba a yi nazarin tarin rubutun Hausa ba.",
  ],
  scope: [
    "This is a selected, source-context-checked preview. It is neither the full archive nor a representative career account. Reports are not independent verification. Numerical review and public approval remain incomplete.",
    "Wannan zababben samfuri ne da aka duba mahallin tushensa. Ba cikakken tarihin ayyuka ko dukkan kundin bayanai ba ne. Rahotanni ba tabbaci ne mai zaman kansa ba. Binciken adadi da amincewar wallafawa ba su kammala ba.",
  ],
  network: [
    "Sharing an article does not prove partnership. Reviewed connections separately distinguish reported collaboration, cooperation intentions and reported signing; none independently verifies promised delivery.",
    "Bayyana tare a labari ba ya tabbatar da hadin gwiwa. Bayanan alaka suna bambanta hadin gwiwar da aka ruwaito, niyyar aiki tare da sanya hannu da aka ruwaito; ba su tabbatar da cika alkawura ba.",
  ],
};

export function renderAnswer(answer, lang = "en") {
  const ha = lang === "ha";
  const index = ha ? 1 : 0;
  const result = {
    heading: ha ? "Amsa daga bayanai" : "From the reviewed records",
    text: "",
    detail: "",
    items: [],
    draft: ha,
  };
  const disclaimer = ha
    ? "Zababben samfuri ne, ba cikakken tarihin aiki ba. Fassarar Hausa daftari ce mai jiran bitar mutum."
    : "Selected preview, not a complete career account. Office reporting is not independent verification.";
  if (answer.status !== "answered")
    result.text = (MESSAGES[answer.reason] || MESSAGES.question)[index];
  else if (answer.kind === "count" || answer.kind === "list") {
    const c = answer.claims[0];
    const year = answer.plan.reportYear;
    result.text = ha
      ? `Akwai ayyuka ${c.value.toLocaleString("en-GB")} da aka rubuta${year ? ` a shekarar rahoto ta ${year}` : " a wannan samfurin"}.`
      : `There are ${c.value.toLocaleString("en-GB")} documented activity records${year ? ` with report year ${year}` : " in this preview"}.`;
    result.detail = ha
      ? "Ana kirga ayyuka daban daban, ba mutane ko rahotanni ba. Shekarar rahoto ba lallai ta zama shekarar taron ba."
      : "This counts distinct activity records, including advocacy, meetings and plans. It counts neither people nor articles. Report year is not necessarily event year.";
    if (!c.value)
      result.detail += ha
        ? " Rashin bayanan da suka dace ba yana nufin babu ayyuka a zahiri ba."
        : " No matching records does not establish zero real-world activity.";
  } else if (answer.kind === "measurement" || answer.kind === "report-year") {
    const c = answer.claims[0];
    const programme = answer.plan.programme;
    const label = CATALOGUE[programme].label[ha ? "ha" : "en"];
    if (answer.kind === "report-year")
      result.text = ha
        ? `Shekarar rahoton ${label} ita ce ${c.value}.`
        : `${label} has canonical report year ${c.value}.`;
    else {
      const n = `${c.bound === "greater-than" ? (ha ? "fiye da " : "more than ") : c.bound === "at-least" ? (ha ? "a kalla " : "at least ") : c.bound === "approximate" ? (ha ? "kusan " : "about ") : ""}${c.value.toLocaleString("en-GB")}`;
      if (programme === "beyond")
        result.text = ha
          ? `An rubuta ${n} damar aikin yi a matsayin buri na Beyond Disability. Wannan ba adadin ayyukan yi da aka tabbatar an samar ba ne.`
          : `The recorded ${n} job opportunities are a Beyond Disability target. Documented delivery of those jobs is not established.`;
      else
        result.text = ha
          ? `${label}: an ruwaito mutane ${n}${programme === "borno" ? " sun samu aikin yi a Borno" : programme === "nigwed" ? " sun samu horo da tallafi" : " sun samu tallafi"}.`
          : `${label}: ${n} people ${programme === "borno" ? "reportedly employed by Borno State following office engagement" : programme === "nigwed" ? "reportedly trained and supported" : "reportedly supported"}.`;
    }
    result.detail = ha
      ? "An dogara da rahoton ofishi. Ranar rahoto ba ta tabbatar da ranar taron ba. Ba a auna canjin kudin shiga ko tasirin sanadi ba."
      : `${c.attribution} ${c.limitations.join(" ")} Publication/report dates do not establish exact event dates.`;
    if (programme === "smedan" && ha)
      result.detail +=
        " Horo da kayan tallafi na kungiya daya ne; ba a kirga su sau biyu ba.";
  } else if (answer.kind === "summary") {
    result.heading = ha
      ? "Tallafi ga mata masu nakasa"
      : "Support for women with disabilities";
    result.text =
      answer.reason === "no-matches"
        ? ha
          ? "Babu ayyukan wannan taƙaitaccen bayani da suka dace da shekarar rahoton da aka zaɓa. Wannan ba yana nufin babu wani tallafi a zahiri ba."
          : "None of the activities in this summary match the selected report year. This does not establish that no support occurred."
        : ha
          ? "Rahotannin ofishinsa da muka duba sun bayyana ayyukan da aka yi tare da ƙungiyoyin haɗin gwiwa:"
          : "The reviewed office reports describe the following work carried out with partners:";
    result.detail = ha
      ? "Ba a haɗa waɗannan alkaluma a matsayin jimillar mata daban-daban ba, domin ba a tabbatar ko wasu matan sun shiga shirye-shiryen biyu ba. Ba a tabbatar da ƙarin kuɗin shiga ko samun aikin yi bayan tallafin ba. Ana amfani da shekarar rahoto, ba ranar taron da aka tabbatar ba."
      : "These figures are kept separate: overlap between the programmes is unknown, so they are not a total of unique women. Subsequent income or employment gains were not established. Dates use the canonical report year, not a verified event date.";
  } else if (answer.kind === "explanation")
    result.text = MESSAGES[answer.reason][index];
  else if (answer.kind === "lookup")
    result.text =
      answer.reason === "no-matches"
        ? ha
          ? "Babu bayanan da suka dace da kalmar a wannan samfurin. Wannan ba hujjar rashin ayyuka ba ce."
          : "No matching records were found in this preview. This is not evidence that no real-world activity occurred."
        : ha
          ? "Ga bayanan da kalmar ta dace da su. Wannan binciken kalma ne, ba hukunci kan ma’anar duka rahoton ba."
          : "Here are matching activity records. This is a keyword lookup, not a finding about the meaning of every report.";
  else if (answer.kind === "catalogue") {
    result.text = ha
      ? "Ga bayanan da aka zaba a samfurin."
      : "Here are the reviewed catalogue entries in this preview.";
    result.detail =
      answer.plan.catalogue === "connections"
        ? MESSAGES.network[index]
        : answer.plan.catalogue === "topics"
          ? MESSAGES.method[index]
          : ha
            ? "Wadannan sunaye ba su tabbatar da ayyukan da aka kammala ko yawan mutanen da suka amfana ba."
            : "These labels do not establish completed delivery or beneficiary totals. Categories can overlap.";
  }
  result.items = (answer.items || []).map((item) => ({
    ...item,
    text: item.label?.[ha ? "ha" : "en"] || item.label?.en || item.id,
    untranslated: ha && !item.label?.ha,
  }));
  result.detail = [result.detail, disclaimer].filter(Boolean).join(" ");
  return result;
}

export function suggestedQuestions(lang = "en", context = {}) {
  const suggestions = [
    ["What has he done for disabled women?", "Me ya yi wa mata masu nakasa?"],
    ["How many activities are documented?", "Ayyuka nawa aka rubuta?"],
    ["Show activities reported in 2024", "Nuna ayyuka a shekarar rahoto 2024"],
    [
      "How many SMEDAN participants were supported?",
      "Mutane nawa SMEDAN ta tallafa wa?",
    ],
    [
      "How many women received NIGWED training?",
      "Mata nawa suka samu horon NIGWED?",
    ],
    ["Were 36,551 jobs delivered?", "An samar da ayyukan yi 36,551?"],
    [
      "How many unique people benefited overall?",
      "Mutane daban daban nawa suka amfana gaba daya?",
    ],
  ];
  if (context.programme)
    suggestions.unshift([
      "And which year was that reported?",
      "Kuma wace shekara aka bayar da wannan rahoto?",
    ]);
  return suggestions.map(([question, ha]) => ({
    question,
    label: lang === "ha" ? ha : question,
  }));
}

/** Manifest identity is supplied build metadata, not a runtime cryptographic attestation. */
export function createReceipt(answer, manifest) {
  const receiptPlan = copy(answer.plan);
  // A literal keyword is visitor text too; receipts retain only the matched IDs.
  if (receiptPlan?.term) receiptPlan.term = "[omitted]";
  return {
    operationVersion: "deterministic-chat-v1",
    datasetVersion: answer.snapshot.version,
    datasetDate: answer.snapshot.date,
    bundleSha256: manifest?.bundle_sha256 || null,
    manifestVersionMatches:
      manifest?.dataset_version === answer.snapshot.version,
    status: answer.status,
    plan: receiptPlan,
    activityIds: [...answer.activityIds],
    observationIds: [...answer.observationIds],
    sourceIds: [...answer.sourceIds],
    claims: copy(answer.claims),
    limitations:
      "Snapshot identity supplied by the build manifest; not independent verification or public approval.",
  };
}
