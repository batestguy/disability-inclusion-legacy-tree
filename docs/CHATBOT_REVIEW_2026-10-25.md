# Guided chatbot review and improvement

Reviewed the committed baseline `c95e8d5` before improving it, as the owner
requested. A fresh read-only reviewer inspected navigation, evidence, accessible
names, announcements and tests. The owner clarified that “quiz” means design
questions, chose Activities and reported results as the starting priority, and
requested the OSSAP logo cursor only over buttons/links. No visitor quiz added.

## Required changes found in the committed baseline

| Finding | Baseline reference | Visitor impact | Correction |
| --- | --- | --- | --- |
| Programme identity omitted | GuidedWorkspace.tsx:158 | Ramadan and Karu both read “More than 500 people”, with no distinguishing programme name. | Concise programme name above its bound/stage/unit label; original report titles retained in sources. |
| Viewing details loses list position | GuidedWorkspace.tsx:107 | Returning from a source or Details resets visitors to the first option page. | Independent option/source page state; auxiliary views preserve each list position. |
| History restores a different evidence screen | GuidedWorkspace.tsx:80 | Forward/reload opens an answer wrapper instead of the source list shown on the original visit. | URL-path restoration uses the same evidence-screen default as ordinary navigation. |
| Summary sources have no stored finding displayed | GuidedWorkspace.tsx:35 | Women/year/theme source links open title/date only, despite relevant stored extracts. | Resolve matching stored evidence; explicitly explain if only the original report link exists. |
| Detail announcements omit the changed text | GuidedWorkspace.tsx:186 | Assistive technology receives a page number without the new source/detail text. | Announce the changed label/text with its actual language, including English evidence on Hausa pages. |

No additional numerical-integrity defect was found in the reviewed code. This is
an engineering review, not human Hausa or screen-reader certification. Existing
frozen free-text audit results and public-approval gates remain unchanged.

## Design improvements

Visible choices alternate deep green/white/green, including source choices, with
contrasting text, hover/focus states and forced-colour fallbacks. The starting
page prioritises activities/results, then report year, then women-focused support.
Three replacing choices remain the maximum. The underlying graph and its 162
nodes are retained; programme navigation titles are shortened, not source titles.

The optional native cursor uses the official website's unmodified 32×32 icon,
served locally over buttons and links on devices with a precise hovering pointer.
It has an off switch and standard fallbacks; reading/text selection, coarse
pointers and forced colours retain ordinary cursors. There is no animated cursor
follower or new dependency. See [cursor provenance](../content/ossap-cursor.json).
Public availability is not recorded as a reuse licence; public approval is false.

## Validation

See the newest [validation entry](VALIDATION.md) and the complete browser result
file for final checks, independent recheck and actual limits. Targeted regressions
cover distinguishable same-value programme choices, source/option page retention,
source-history restoration, summary extracts, language-tagged live text, colour
alternation, cursor scope/off switch and preserved source/receipt dimensions.
