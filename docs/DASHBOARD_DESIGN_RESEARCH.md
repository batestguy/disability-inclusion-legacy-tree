# Achievement dashboard direction — 27 October 2026

## Applied after installation

The owner subsequently installed interface-design and kpi-dashboard-design
globally and requested applying them. Earlier download-only statements below
describe the research stage. The dashboard now follows the compact scoreboard
direction: shorter heading/control space, aligned target units, short programme
labels, compact mobile rows, and top filters with visible active context. Green
achievements/gold targets retain the requested white canvas and number + Source
format. Original self-hosted Source Sans 3 files include Adobe's OFL licence and
provenance. Saved design decisions: ../.interface-design/system.md.
No example metric, trend or progress percentage was imported. See VALIDATION.md
for browser evidence; before/after images are under output/playwright/.

Owner rejected generic card layouts and long explanations: each KPI should carry
its main story through a number, short label and one source link. Keep a white
opening section, meaningful colour, category-first targets/achievements and the
existing shared English/Hausa navigation. This is a public-facing record of a
person's work, not a sales-management system or an internal compliance console.

## Actual references inspected

| Reference | Useful visual pattern | Fit for this project |
|---|---|---|
| [Geckoboard charity fundraising](https://www.geckoboard.com/dashboard-examples/finance/fundraising-dashboard/) | Oversized numeric display, very short labels, clear focal metric and compact supporting blocks | Best reference for the number-first experience; adapt its hierarchy to the requested white canvas |
| [Tableau Big Numbers KPI dashboard](https://public.tableau.com/views/BigNumbersKPIDashboard/SalesKPIDashboard) | White canvas, aligned numeric summaries, small controls and focused charts | Best reference for compact analytical structure rather than a landing-page hero |
| [Microsoft nonprofit Program Impact dashboard](https://learn.microsoft.com/en-us/industry/nonprofit/program-impact-dashboard-use) | Programme-oriented tabs, grouped measures, short table labels and date/status filters | Useful for organising detail below the opening board; its full admin density is unnecessary here |
| [Tableau programme-impact example](https://www.tableau.com/solutions/workbook/program-impact-measurements) | Programme/participant and date-range exploration | Supports programme-focused exploration; embedded interactive view was not inspected |

Downloaded Geckoboard, Tableau KPI and Microsoft reference screenshots were
visually inspected under ignored output/dashboard-design-research/. These are
research references, not shipped site assets. The Tableau Foundation image URL
failed, so its visual style is not used as inspected evidence. Geckoboard's image
and surrounding article show different illustrative targets; no example values
are imported into this site's data.

## Specific design recommendation

- Keep the opening board as a compact scoreboard, with Planned targets and
  Achievements as category headings. Use the existing eleven measures.
- Give numbers the strongest contrast; labels answer what each number means.
  Keep Source as the only action on a KPI card.
- Use a clear grid, aligned baselines and consistent spacing. Remove duplicated
  figure boards, repeated stage badges, editorial paragraphs, large repeated
  introductions and explanations of our own checking process.
- Put records, full source context and calculations behind deliberate actions.
  Keep the main view readable without knowing our implementation.
- Use green/gold consistently for achievement/target grouping, not arbitrary
  rainbow cards. Preserve the requested small sparkle accent and accessibility
  fallbacks without making decoration the main event.
- Borrow layout and hierarchy, not the examples' sales/fundraising arithmetic.
  Existing household/person/job measures do not support a combined beneficiary
  total or target-completion gauges. Do not add fictitious trend lines for style.

The first simplification pass removes per-card dates, Details buttons, repeated
verification copy, the duplicate lower figure dashboard and repeated hero/inventory
cards. Compact activity/figure/target/source counts remain beside the filters.
Full record evidence is still available from the activity list. This cleanup is
not presented as a complete reference-led redesign.

## Downloadable skills checked

Counts are a 27 October 2026 snapshot, not guarantees of design quality.

| Skill | Scope and observed adoption | Recommendation |
|---|---|---|
| [interface-design](https://skills.sh/dammyjay93/interface-design/interface-design) | Specifically product dashboards/tools, hierarchy, density, domain-specific craft; 30.9K installs, about 5.9K repository stars | Best match for replacing generic dashboard composition |
| [kpi-dashboard-design](https://skills.sh/wshobson/agents/kpi-dashboard-design) | KPI selection and executive/operational arrangements; 16.3K installs, about 41.8K repository stars | Useful supplement for metric arrangement; its sales/finance formulas are not this project's data |
| [Official frontend-design](https://skills.sh/anthropics/skills/frontend-design) | Broad frontend aesthetic and anti-template guidance; about 1.0M installs | Useful general guidance; less dashboard-specific than interface-design |

Install command offered by the interface-design directory page:

```powershell
npx.cmd skills add https://github.com/dammyjay93/interface-design --skill interface-design
```

Downloaded the interface-design and official frontend-design SKILL.md files into
ignored output/dashboard-design-research/ for inspection. No skill was installed,
no global skill was overwritten, and no downloaded script was executed. Local
frontend-design instructions differ from the fetched official file; use explicit
source/version selection for any later installation rather than silently replacing
the existing skill. A skill improves the design discipline; it does not substitute
for choosing references and inspecting the actual result at desktop/mobile sizes.
