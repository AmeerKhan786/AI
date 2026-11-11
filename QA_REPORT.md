# App audit and fixes — v3

## Defects found and addressed

1. **Lesson completion falsified daily checklist progress.** Marking a lesson done silently set Learn, Build and Evidence to complete for its scheduled date. Removed that side effect; lesson status and daily execution are now independent records.
2. **Roadmap start-date setting was misleading.** It saved a new date but never recalculated lesson dates. Removed the non-functional control and made the source schedule explicit/read-only.
3. **Backup import accepted incomplete or malformed state.** Replaced the shallow check with structural validation, defaults/migration for older state, date-key filtering, bounded numeric values, and safe fallback on file-read errors.
4. **Saved-state loading was brittle.** Added normalization when reading existing local storage, preserving valid progress while filling missing fields.
5. **Storage failures were silent/unhandled.** Save now catches quota/unavailable-storage errors and displays a warning rather than throwing through the UI.
6. **Mobile navigation stayed open after selecting a page.** Navigation now closes the mobile sidebar.
7. **Navigation event handler was duplicated.** Removed the redundant sidebar listener to avoid rendering the same view twice.
8. **Custom portfolio evidence could not be edited after creation.** Added URL, notes and shipped controls to custom evidence entries.
9. **Unsafe external project URLs could be rendered as links.** Only HTTP/HTTPS URLs are accepted for saved project links; external links use `noopener noreferrer`.
10. **Backup export revoked its download URL immediately.** Delayed URL revocation to allow the browser to begin the download.
11. **Lesson rows were mouse-only.** Added keyboard focus and Enter/Space activation.
12. **Offline cache could keep serving stale app files.** Bumped cache version and changed fetch strategy to network-first with offline cache fallback; added `skipWaiting` and `clients.claim`.

## Checks performed

- `node --check app.js` — passed.
- `lessons.json` parses — passed; exactly 100 lessons, numbered 1–100, across 7 phases.
- `manifest.webmanifest` parses — passed.
- Schedule consistency — Days 1–74 run 14 Nov 2026–8 Feb 2027, skip Sundays, and have no duplicate dates; Block 2 dates align to the source calendar for Days 75–100.
- Archive integrity — checked after packaging.

## Test limitation

A full interactive browser run could not be completed in this execution environment: Chromium navigation was blocked by the environment (`ERR_BLOCKED_BY_ADMINISTRATOR`) for both local HTTP and file URLs. The app has been statically validated, but a final real-device pass on the deployed GitHub Pages site is still required. No claim is made that every possible browser/device issue has been eliminated.
