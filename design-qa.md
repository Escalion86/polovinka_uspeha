# Design QA — публичные страницы, вариант 2

- Source visual truth: `C:\Users\Escal\.codex\visualizations\2026\07\13\019f5c3d-db1b-7c92-94a5-94b70efb84bd\design-options\option-2.png`
- Implementation screenshot: `C:\Users\Escal\.codex\visualizations\2026\07\13\019f5c3d-db1b-7c92-94a5-94b70efb84bd\design-qa\city-desktop.png`
- Mobile screenshot: `C:\Users\Escal\.codex\visualizations\2026\07\13\019f5c3d-db1b-7c92-94a5-94b70efb84bd\design-qa\city-mobile.png`
- Combined comparison: `C:\Users\Escal\.codex\visualizations\2026\07\13\019f5c3d-db1b-7c92-94a5-94b70efb84bd\design-qa\comparison-option-2-vs-city.png`
- Desktop viewport: 1440 × 1000, route `/krsk`, public unauthenticated state.
- Mobile viewport: 390 × 844, route `/krsk`, public unauthenticated state.

## Full-view comparison evidence

The combined comparison confirms the same first-screen composition as option 2: light warm background, burgundy brand/header, two-column hero, serif two-line heading, blue primary CTA, trust line, rounded landscape photo, and the upcoming-events block immediately after the hero.

The implementation intentionally uses an existing real project photo instead of the generated concept photo. The events area is driven by live city data; the captured state is empty because there are no future public events in the current development dataset. Its populated row layout retains the reference fields: date, time, title, place, price, available places, and detail action.

## Focused region comparison evidence

- Typography: Lora display heading, matching burgundy color, two desktop lines, restrained body hierarchy, and readable mobile wrapping.
- Spacing/layout: header, hero gutters, column proportions, image radius, CTA width, trust-line rhythm, and transition into the events section closely follow the reference.
- Colors/tokens: warm white `#fbfaf8`, burgundy family around `#681724`, and blue CTA around `#72c5f2` match the accepted direction and existing project palette.
- Image quality: the original project photo is sharp, naturally cropped, and semantically stronger than a generated substitute because it shows real participants.
- Copy/content: hero heading, supporting text, CTA, trust points, event heading, all-events link, and safety note match the approved concept. City names use the correct prepositional form.
- Accessibility: visible keyboard focus restored globally; semantic links/buttons/headings are retained; no horizontal overflow at 390 px.

## Comparison history

1. Earlier P2: desktop heading wrapped to three lines and made the hero denser than the reference.
   - Fix: adjusted grid proportions and display type scale, then introduced the intended two-line semantic grouping.
   - Post-fix evidence: final 1440 × 1000 capture has a 99 px two-line heading and matches the reference hierarchy.
2. Earlier P2: on mobile the image appeared before the explanation and CTA, pushing the primary action down.
   - Fix: changed responsive order so copy and CTA appear before the photo.
   - Post-fix evidence: at 390 × 844 the CTA is visible in the first viewport and `scrollWidth` equals `clientWidth`.

## Findings

No actionable P0/P1/P2 findings remain.

Accepted product constraints:

- The live header retains additional navigation items for existing project sections.
- The hero uses a real project photograph rather than the generated reference photograph.
- The captured event block shows the production empty state because the development dataset has no future public events; populated rows are data-driven.

## Primary interactions tested

- Main-page city-selection modal opens and lists only public cities (`krsk`, `ekb`).
- City-page CTA scrolls to the nearest-events section.
- Mobile navigation opens and exposes all navigation actions.
- Browser console contains no errors.
- Full project ESLint passes.

## Follow-up polish

- P3: capture a populated event-row state when the development database contains a future event, to visually verify long titles and addresses against the reference.

final result: passed
