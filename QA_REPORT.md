# Application QA report — v4 follow-up audit

## Scope
Reviewed the v3 source files (`index.html`, `app.js`, `style.css`, `sw.js`, `manifest.webmanifest`, `lessons.json`) and compared the lesson calendar against the supplied `100-Lesson Roadmap AI + Data Engineering.docx`. This was a source-code and logic audit, not a claim of exhaustive cross-device browser testing.

## Additional defects found and corrected in v4

1. **Viewing the dashboard created an empty day record.** `dayData()` mutated persistent state during rendering. This inflated monthly “days recorded” and could pollute analytics. Reads are now side-effect-free; a day record is created only when the user changes or saves data.
2. **Quality averages were misleading.** Default energy/focus/confidence values of 3 were included even when no study/check-in had been logged. Analytics now only averages days with study hours or a check-in.
3. **Streak incorrectly dropped to zero if today was not checked in.** It now starts from yesterday when today has no check-in/review, then counts consecutive active days.
4. **Streak definition was inconsistent.** The calculation counted either an honest check-in or a completed daily review, while the KPI said check-ins only. The KPI wording now matches the calculation.
5. **Monthly consistency used the full month even before it had elapsed.** Current-month denominator now uses elapsed calendar days; future months safely show zero.
6. **Malformed project data in an imported backup could crash normalization.** Projects are now type-checked, bounded, sanitized, and URL-filtered before use.
7. **Imported project IDs could break CSS selectors.** Project field lookup now compares `dataset` values instead of interpolating imported IDs into CSS selectors.
8. **A failed backup restore could leave the in-memory state replaced.** Import now rolls back the in-memory state if persistence fails.
9. **A failed lesson save could still show a success toast.** Lesson status and note flows now only report success when storage confirms the write.
10. **Reset could replace in-memory state after a storage failure.** Reset now restores the prior state if the write fails.
11. **Checklist changes forced a full page rerender and scroll reset.** Checklist styling and completion count now update in place.
12. **Recent lessons looked like rows but were not actionable.** They now open the lesson workspace and support keyboard activation.
13. **Built-in portfolio project links could be saved but not opened.** Valid saved HTTP(S) links now get an Open link, as custom projects already did.
14. **Service-worker activation deleted every cache on the same origin.** It now deletes only caches with this app's cache prefix, avoiding interference with other GitHub Pages projects on the same origin.
15. **PWA icon set relied only on an SVG marked maskable.** Added 192px and 512px PNG icons and referenced them in the manifest for more reliable Android installation.
16. **Block 2 copy implied Day 75 began on 12 March.** Copy now distinguishes re-entry activity beginning 12 March from Day 75 beginning 18 March.
17. **Backup project collection was not guarded as an array.** Normalization now safely handles missing or wrongly typed project collections.
18. **Lesson modal buttons relied on implicit form submission.** Action buttons now have explicit button types; a failed lesson-status save rolls the status back instead of leaving an unsaved change in memory.

## Earlier v3 fixes retained

- Lesson completion no longer marks daily Learn/Build/Evidence tasks complete.
- Removed the misleading non-functional start-date setting.
- Backup import structure validation and numeric bounds.
- Local-storage error reporting.
- Mobile sidebar closes after navigation.
- Duplicate navigation handler removed.
- Custom evidence URL, notes and shipped state are editable.
- Unsafe URL schemes are rejected; external links use `noopener noreferrer`.
- Export object URL revocation is delayed.
- Lesson rows support keyboard interaction.
- Service-worker network-first behavior with offline fallback and cache versioning.

## Roadmap verification

- 100 lessons numbered 1–100; 7 phases.
- Days 1–74 map from 14 Nov 2026 through 8 Feb 2027, skipping Sundays.
- The planned break is 9 Feb–11 Mar 2027.
- Block 2 re-entry begins 12 Mar; Day 75 is scheduled for 18 Mar 2027.
- Days 75–100 have 26 unique dates through 29 Apr 2027.
- The app tracks the 100 numbered lessons. It does not yet provide dedicated cards for the separate re-entry, 83b/85b/87b/89b, Extra A–G, and launch-day tasks in the source document. Those are a feature gap, not a lesson-count error.

## Automated checks

- `node --check app.js` — passed.
- JSON parse for `lessons.json` and `manifest.webmanifest` — passed.
- 15 Node VM assertions — passed, covering lesson count, phase count, date uniqueness, Sunday exclusion, break exclusion, Day 74/75 boundaries, non-mutating render initialization, malformed backup handling, yesterday streak continuation, and empty analytics.
- ZIP integrity check — passed.

## Remaining limitations / recommended next improvements

1. A real Android Chrome functional pass is still needed. This environment did not provide a dependable interactive browser session, so no claim of full end-to-end UI testing is made.
2. Add explicit task cards for re-entry days, 83b/85b/87b/89b, Extra A–G and launch day, rather than treating them as generic flexible days.
3. Add optional encrypted/cloud sync only if multi-device use is needed; current progress remains local to one browser profile.
4. Add a true edit/delete flow for custom portfolio entries and an undo option for accidental lesson status changes.
5. Add a visible storage-health/last-backup indicator and periodic backup reminder (browser notifications require permission and HTTPS).
6. Consider a dedicated data migration version and automated tests for every future backup schema change.

## Known design constraints

- The tracker does not verify GitHub commits, grade learning outcomes, send partner notifications, or provide an AI tutor.
- Offline access depends on the app having been loaded online at least once and the browser retaining its service-worker cache.
- Progress is stored in browser localStorage and does not automatically synchronize across devices.
