# Landing-page interaction plan — 4 November 2026

Status: proposed next pass, not implemented. The owner requested this plan after
expanding Isa's About page and explaining agent assistance in Methodology.

## Intended experience

Make the opening feel welcoming and alive, then give visitors a clear reason to
choose Figures, Themes, Connections or the guide. Keep Isa's centred photograph,
quote and biography link as the focal point. Retain the existing four-colour
bubbles, four visible stacked languages and shared record/conversation state.
Use the current components and dependencies, with no paid service or live AI call.

## Recommended changes, in order

### 1. Bring the choices into the opening experience

- Tighten excess vertical gaps around the introduction, photograph and quote on
  wide screens. Keep the full photograph and readable text; use actual viewport
  checks to decide how much can fit without crowding.
- Add one subtle entrance sequence: heading/portrait first, then the four choices.
  Use short opacity/transform transitions, with no layout shift or reading delay.
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
- Pause motion must stop all decorative movement, including hover transforms;
  remember the choice. Reduced motion removes movement automatically. Static
  focus/colour feedback remains. Avoid sound, flashing or pointer-follow effects.

Acceptance: all four links stay easy to target while animating, no hover-only
content is required to navigate, and both pause and reduced-motion checks pass.

### 3. Show a glimpse before the visitor leaves Home

- Add one small, stable preview region immediately below the choices, rather
  than four more dashboard cards. Reserve enough space to prevent page jumps.
- On desktop, hovering or focusing a bubble changes the preview. It shows a
  concise example from the current data: a properly bounded figure and source,
  a real concept phrase, a documented connection, or a prepared guide question.
- On touch screens, offer a separate native preview disclosure/control adjacent
  to the choices. It must not turn the main links into a two-tap interaction or
  put a button inside an anchor. Keep any controls at least 44px.
- Use the same four-language content pipeline. All dates, bounds, role labels
  and source links come from the existing records. Prefer a single useful
  example to extra totals, counters or implied progress.

Acceptance: keyboard and touch can reach equivalent information; previews do
not steal focus, reset the selected record/chat path or require a network call.
Links retain their current URLs, reload and browser Back/Forward behaviour.

### 4. Finish with a focused visual and interaction check

Check desktop, a mid-width tablet, 390px and 320px phones; all four languages;
keyboard focus; 200% text; reduced motion and Pause; forced colours; and image
failure. Compare actual load/layout behaviour with the existing local baseline.
Run the existing lint/typecheck/tests/build and landing/locale browser suites,
adding assertions only for new interaction behaviour. Do not claim a performance
score or improvement without recording a measurement.

## Work sequence and completion boundary

Implement items 1–2 together as the first reviewable local checkpoint, preserving
the established visual direction. Then add item 3 and complete item 4. Show the
owner the running local result before treating this as the final landing design.
About/Methodology changes are implemented separately; this document does not
claim the landing changes already exist. Publishing and source commits are
separate actions; no public deployment is part of this plan.
