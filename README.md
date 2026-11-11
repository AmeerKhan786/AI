# AI + Data Engineering Command Centre

A mobile-first, installable PWA for tracking the supplied 100-Lesson AI + Data Engineering roadmap.

## Deploy / update on GitHub Pages

1. Keep all app files in the repository root: `index.html`, `app.js`, `style.css`, `manifest.webmanifest`, `sw.js`, `lessons.json`, and `icon.svg`, `icon-192.png`, and `icon-512.png`.
2. Upload the new files to the same repository and choose **Commit changes**. Do not upload the ZIP as the only file.
3. GitHub Pages should remain configured as **Deploy from a branch → main → /(root)**.
4. Wait for the Pages deployment to finish, then reload the site. The service-worker cache was bumped to v4 so the updated assets can replace the previous cache.
5. If the installed app still shows the old version, fully close it, open the website in Chrome, reload once while online, then reopen the installed app.

## Install on Android

Open the GitHub Pages URL in Chrome and use **⋮ → Install app** (or **Add to Home screen**, depending on Chrome version).

## Progress and privacy

- Progress is stored in this browser's local storage. It is not synced to another phone or browser.
- Export a JSON backup regularly, especially before updating, clearing browser data, or changing devices.
- Import validates and normalizes backup data before replacing current progress; failed imports roll back if the browser cannot save.
- This app does not send your journal, study hours, or notes to a server.

## Roadmap schedule

The schedule follows the supplied document: Block 1 is 14 Nov 2026–8 Feb 2027 (Lessons 1–74, Sundays reserved for catch-up); break is 9 Feb–11 Mar 2027; Block 2 is 12 Mar–30 Apr 2027, with re-entry and extra build days. Day 75 itself starts 18 Mar; the re-entry period begins 12 Mar. Lesson dates are a fixed plan, not a movable start-date setting.

## Known limitations

- No cloud sync, push reminders, partner notifications, or AI tutor integration.
- The app is a tracker; it does not verify GitHub commits or independently grade lesson outcomes.

## QA and changes

See `QA_REPORT.md` for the audit scope, fixes, automated checks and remaining limitations. See `CHANGELOG.md` for version history.
