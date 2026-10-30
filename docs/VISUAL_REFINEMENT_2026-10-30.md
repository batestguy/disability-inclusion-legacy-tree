# Framed sections, bilingual quote and visual identity — 30 October 2026

Owner requests clear section borders; a fuller centred portrait; a different
header photograph; Hausa quote localisation; a large Interact with me invitation
and recognisable chatbot mark; researched calligraphy/interactive headings;
activity thumbnails and a deeper search for connection imagery. Implement locally,
without deployment or approval-flag changes. Baseline: 6a21eea, clean working tree.

## Design direction and evidence

Audience: members of the public and journalists exploring the record. Domain:
inclusion, participation, contribution, advocacy, documented roles, initiative,
source. Colour world: white page, Nigerian green, institutional blue, warm gold,
purple/magenta connection accents. Signature: five bordered chapters around genuine
portraits, a selectable source cloud and source-bound relationships. Avoid tiny
script labels, decorative fake controls and photographic stand-ins for outcomes.

- GOV.UK heading guidance supports a clear semantic hierarchy and captions:
  https://design-system.service.gov.uk/styles/headings/
- GOV.UK image guidance supports visible labels alongside icons and text alternatives:
  https://design-system.service.gov.uk/styles/images/
- IBM conversation guidance stresses recognisable bot identity, clear greetings
  and choices. Apply those ideas to the existing deterministic clickable guide;
  do not imply an external AI model or unrestricted free text.
  https://www.ibm.com/design/ai/conversation/
  https://www.ibm.com/think/topics/chatbot-design
- Briem Hand is a calligraphic handwriting family with OFL distribution. Actual
  local cmap check confirms all Hausa hooked letters, unlike Caveat, Merienda and
  Shantell Sans. Use self-hosted Briem Hand only for large, short display headings;
  keep figures, labels, sources and chat choices in Source Sans 3.
  https://github.com/SorkinType/Briem-Hand
  https://github.com/google/fonts/tree/main/ofl/briemhand
- Lucide bot-message-square supplies a familiar robot/conversation symbol under
  ISC licence, with the licence bundled. It identifies this guide, not a provider.
  https://lucide.dev/icons/bot-message-square
  https://lucide.dev/license

The following are project design decisions inferred from this research: clear
bounded sections, handwritten display titles, labelled jump actions into real
controls, a prominent chat invitation and concise three-choice conversation.
No research claim of measured engagement improvement is made.

## Implementation decisions

- Use the existing source-identified SocietyNow seated photograph for a fuller,
  centred intro image, without facial edits or invented body. Keep its original
  proportions. Use the different formal office portrait as a CSS-cropped header
  avatar; both source records and local-preview rights limits remain explicit.
- Translate the existing quote as draft Hausa on /ha/; keep the original English
  available and identify the Hausa as a draft translation, not a speech transcript.
- Add strong, distinct full borders to intro, figures, advocacy/cloud, connections
  and chat. Keep white surfaces and compact figure cards within each frame.
- Make display titles inviting; add labelled heading actions that focus actual
  contribution controls, cloud choices or question options. No decorative click.
- Use original topic-specific illustrated activity thumbnails; reuse the existing
  source-identified NigWED event image only for its actual activity. Do not add
  unsupported event photos or suggest an illustration is a photograph.
- Deeper official-image search located SMEDAN's inline header SVG, DataLead's
  official glyph, NCPWD's commission logo, Africa Unconquered's logo and the joint
  JAC/Elizade Autoland mark. Local-prototype identification only where public reuse
  terms remain unestablished. Never mistake NIGAWD for NigWED, or Elizade Toyota
  for Elizade JAC Autoland. Keep remaining initials when identity is unresolved.

## Progress and validation

Research, implementation and validation completed locally. Section boundaries,
portrait framing, header/avatar visibility, Hausa quote and glyphs, real heading
controls, thumbnail fallbacks and source-aligned connections checked on desktop/phones.

## Asset and wording record

- Hero source is the existing SocietyNow appointment photograph, with bytes/hash
  preserved; original full frame now visible. Header uses the existing different
  office portrait with a CSS cap/face crop. Both retain local-preview-only rights
  status. Manifest: content/dashboard-visual-assets.json.
- Hausa draft quote: “Ƙarfinmu ba ya cikin rashin ƙalubale, sai dai a juriyarmu ta
  shawo kansu.” Original English stays available; hausa_reviewed remains false.
- Five new official-site logos: DataLead Africa (/logo.svg); Africa Unconquered
  (2024/09/logo.png); NCPWD (/logo1.png); JAC/Elizade Autoland (2021/09/JAC-Elizade-logo.png);
  SMEDAN (inline SVG in the homepage header). Exact pages/assets and hashes are in
  content/dashboard-network-assets.json. Public reuse permission is unverified;
  identification graphics in the local preview only, not licensed public assets.
- Sources checked: https://www.dataleadafrica.com/ , https://africaunconquered.org/ ,
  https://ncpwd.gov.ng/ , https://jacnigeria.com/ , https://smedan.gov.ng/ .
- NIGAWD was rejected as a different organisation. NigWED's identity was separately
  checked against its named project profile; no reused image/permission established.
  https://ng.linkedin.com/company/nigwedproject . Other unsupported node images
  remain labelled initials, including Deaf-in-Tech, school, foundation and Red Cross.
- New logo colours/geometry preserved. SMEDAN's white wordmark uses a dark tile
  rather than recolouring. Lucide ISC licence and Briem Hand OFL are bundled.
- English callouts: Inclusion in action; Ideas worth exploring; Follow the
  connections; Interact with me. Their actions focus real controls/questions.

## Final validation

- Preflight, lint, typecheck and all 69 unit tests pass.
- Full web/Studio build passed; final web rebuild passed after the image-fit fix.
- Dashboard browser: nine groups/seven zero-violation axe states. Standalone chat:
  eight groups/five zero-violation axe states. No page errors, failed responses
  or runtime external requests in either suite.
- Explicit checks cover five full chapter borders, centred uncropped photo,
  different header source, draft Hausa quote/locale, loaded calligraphic font,
  functional heading actions, thumbnails, six logo records and asset bytes.
- A visual inspection found that intrinsic grid rows clipped the tall DataLead
  graphic. Switched logo tiles to flex fitting and gave thumbnail images explicit
  bounds; rechecked in the production build. DataLead image now 46px high inside
  its 48px tile; all logo bounds fit. Deliberate NigWED decode failure falls back
  to the original sewing/training illustration.
- Desktop intro/chat/network and Hausa phone screenshots inspected. Representative
  evidence: output/playwright/dashboard-framed-{intro,chat,network,hausa-phone}.png.
  Browser results are in output/dashboard-browser-results.json and
  output/guided-browser-results.json.
- git diff --check passes. No package/lockfile or frozen v1 edits. No commit,
  deployment, new CI result, performance certification or human Hausa approval.

