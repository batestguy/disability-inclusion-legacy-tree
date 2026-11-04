# Landing-page interaction plan — 4 November 2026

Latest accepted solar direction: the four navigation bubbles are the planets,
revolving around the stationary portrait with perspective and depth. The real
concept-cloud labels replace glitter, falling in clipped lanes beside the photo,
never across it. The chat destination is now Chat assistant / Guided questions
and answers. SolarSystem.tsx implements a 42-second orbit with hover/focus pause,
hidden-tab suspension and a static effects-off/reduced-motion/enlarged-text
fallback. This supersedes the older independent-floating bubble presentation.

Latest owner correction: remove the entire destination-preview block and its
extra choices from Home. Retain the four main interactive bubbles and portrait
effects. Restore standard browser cursors everywhere; the photo-cursor rule,
activation state and chat checkbox are removed. This supersedes the preview
recommendation and cursor behavior described in the historical record below.

Status: owner-approved direction implemented locally after saved/pushed checkpoint
`d6ee2b5`. The owner selected a celebratory/lively theme, continuous effects with
a compact footer setting, and small sourced destination previews. The landing
work remains uncommitted and is not publicly deployed. Earlier Pause-button
requirements are superseded by this accepted direction.

## Intended experience

Make the opening feel welcoming and alive, then give visitors a clear reason to
choose Figures, Themes, Connections or the guide. Keep Isa's centred photograph,
quote and biography link as the focal point. Retain the existing four-colour
bubbles, four visible stacked languages and shared record/conversation state.
Use the current components and dependencies, with no paid service or live AI call.

## Implemented changes

### 1. Bring the choices into the opening experience

- Tighten excess vertical gaps around the introduction, photograph and quote on
  wide screens. Keep the full photograph and readable text; use actual viewport
  checks to decide how much can fit without crowding.
- Use a short heading entrance and independent bubble float rhythms, with
  stationary link targets and no reading delay.
- Keep phone ordering straightforward: introduction, photograph/quote, choices.
  The existing two-column choice layout must still fit translated wording.

Acceptance: the next action is visually obvious at desktop and phone widths;
the portrait remains centred and complete; no clipped or overlapping copy at
320px or enlarged text. Essential content is visible if JavaScript fails.

### 2. Give each bubble a little life

- Refine the existing independent float rhythm and add a restrained response
  to hover, keyboard focus and press: illustration lift and directional arrow.
- Animate only decorative content inside the stationary link. Keep the hit areas
  fixed, with one tap/Enter opening the same destination as today.
- Let each illustration respond differently through its existing vector shapes:
  figures highlight, theme words gently emphasise, connection nodes glow, and
  the guide's speech mark gives a small welcoming cue. No face animation.
- Remove the prominent Pause button. Home footer **Appearance → Visual effects**
  stops all decorative movement, including hover transforms, and persists the
  choice. Previous session Pause preference migrates. System reduced motion
  removes movement automatically; hidden tabs suspend animation. Static focus/
  colour feedback remains. No sound, flashing or pointer-follow effects.
- Green/gold particles fall continuously in the portrait frame's side gutters:
  20 deterministic CSS particles on desktop, eight on phones, staggered 5–9s
  cycles. The photograph stays complete and unaltered. Connected circles/paths
  and the four-language “Every voice. Every ability. Every opportunity.” line
  establish the inclusive theme. Forced colours hide the ornaments.

Acceptance: all four links stay easy to target while animating, no hover-only
content is required to navigate, and both effects-off and reduced-motion checks pass.

### 3. Show a glimpse before the visitor leaves Home

- Add one small, stable preview region immediately below the choices, rather
  than four more dashboard cards. Reserve enough space to prevent page jumps.
- On desktop, hovering or focusing a bubble changes the preview. It shows a
  concise example from the current data: a properly bounded figure and source,
  a real concept phrase, a documented connection, or a prepared guide question.
- Four separate native preview buttons work on touch screens and keyboards.
  They do not turn the main links into a two-tap interaction or put buttons
  inside anchors. Controls remain at least 44px.
- Use the same four-language content pipeline. All dates, bounds, role labels
  and source links come from the existing records. Prefer a single useful
  example to extra totals, counters or implied progress.

Acceptance: keyboard and touch can reach equivalent information; previews do
not steal focus, reset the selected record/chat path or require a network call.
Links retain their current URLs, reload and browser Back/Forward behaviour.

### 4. Finish with a focused visual and interaction check

Check desktop, a mid-width tablet, 390px and 320px phones; all four languages;
keyboard focus; 200% text; reduced motion and effects-off; forced colours; and image
failure. Compare actual load/layout behaviour with the existing local baseline.
Run the existing lint/typecheck/tests/build and landing/locale browser suites,
adding assertions only for new interaction behaviour. Do not claim a performance
score or improvement without recording a measurement.

## Work sequence and completion boundary

The pre-landing source checkpoint was pushed to main as `d6ee2b5`; both GitHub
Actions jobs passed. This landing implementation is a separate local result.
Preview examples reuse NigWED's bounded training figure and both sources,
the disability-inclusion phrase's actual report denominator, the documented
adapted-vehicle connection and an existing prepared guide question. Original
source titles/evidence and frozen approval flags remain unchanged.

Show the owner the running result at http://127.0.0.1:8767/.
Validation and observational load/layout measurements are recorded in
docs/VALIDATION.md. No runtime dependency, paid service, live agent or public
deployment was introduced. Committing/pushing the new landing work is separate.
