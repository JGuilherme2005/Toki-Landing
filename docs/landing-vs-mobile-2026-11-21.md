# Landing vs Sylviae Mobile — comparison, plan and verification (2026-11-21)

Scope: bring the Sylviae landing page (this repo) in line with the **current Sylviae Mobile app on `origin/main`**
(`JGuilherme2005/Sylviae-Mobile` @ `0f68bdb`, includes merged PR #12 streak widget/reminders/UX polish and PR #15
moonlit-pond design + reading-frog icon + portrait Deep Focus video). Open PR #14 (security) is **not merged and not counted**.

Method: the inventory below was built from **code and tests on `origin/main`** (read with `git show origin/main:<file>`, never
from docs/claims). The mobile suite was run against an export of `origin/main` (no edits, no git writes in the mobile repo):
`vitest run` → **22 files passed, 1 skipped; 289 tests passed, 16 skipped** (the skipped ones are the Supabase integration
suite, which needs a local stack). Screenshots come from `docs/design/mobile-2026-11-20/` (Android 15 emulator, release build).

Status vocabulary: **Verified** = implemented and backed by a code path plus a test or screenshot · **Partial** · **Planned** ·
**Deprecated** · **Unverifiable** (cannot be confirmed from code/tests/screenshots in this session).

---

## Phase A1 — Sylviae Mobile feature inventory (origin/main)

| # | Feature | Status | Evidence (code path + test/screenshot) |
|---|---------|--------|----------------------------------------|
| M1 | Focus / Short break / Long break timer, start-pause-resume-skip-end, absolute-deadline countdown (survives sleep/restart) | **Verified** | `App.tsx` `FocusScreen`, `src/domain/pomodoro.ts`; `pomodoro.test.ts` ("derives the countdown from the deadline, so a sleeping device cannot gain time", "reconstructs a restarted app from the persisted deadline"); `focus.png` |
| M2 | Local task list: add/edit/delete/complete, select task for a session, daily tasks that reset | **Verified** | `FocusTaskList`, `src/domain/task.ts`, `src/data/workspace.ts`; `task.test.ts` ("keeps daily routines, clears their completion…"), `workspace.test.ts`; `focus.png` |
| M3 | Deep Focus scene: while FOCUS is running, full-screen looping muted frog-reading pond video with task title, countdown, audio status, Pause/Skip/End | **Verified** | `DeepFocusScene`, `PondVideoBackground`, `assets/video/frog-reading-portrait.mp4`; `pomodoro.test.ts` `isDeepFocusActive` (running→true, paused→false); `deep-focus.png` |
| M4 | Focus audio: 5 packaged offline tracks with attribution; "With Focus timer" vs "Continuous" modes; pauses on Focus pause/breaks; volume | **Verified** | `FocusAudioPanel`, `src/audio/mobile-audio.tsx`, `src/domain/audio*.ts`; `audio.test.ts` ("keeps the five approved bundled sources…", "pauses timer-bound audio on Focus pause/break and resumes it with Focus") |
| M5 | Saved Spotify / YouTube links (canonical URL, optional title override) that **open in the provider's app** (no in-app playback) | **Verified** (as handoff only) | `createExternalSource`, `openExternal`, UI copy "External audio opens in its provider app."; `audio.test.ts` ("canonicalizes supported provider links and rejects insecure URLs") |
| M6 | History: today's focus minutes, day streak, monthly calendar (none/partial/complete), sessions list, deduplicated by session id | **Verified** | `HistoryScreen`, `src/domain/history.ts`; `history.test.ts` ("counts a focus session once…", "matches Desktop daily states…"); `history.png` |
| M7 | Android home-screen **Streak widget** (current week + streak) | **Verified** (logic + preview asset; no on-device screenshot) | `src/widget/*`, `app.json` widget config; `streak-widget.test.ts` (7 cases incl. "breaks the streak after a missed day"); `assets/widget/streak-preview.png` |
| M8 | Friendly reminders (tasks left, streak at risk, morning) in **EN / PT / ES** following phone language; "Friendly reminders" toggle; quiet while a focus block runs | **Verified** (copy/planning logic) | `src/notifications/nudges.ts`, `language.ts`; `nudges.test.ts` ("maps regional tags to a supported language…", "stops nagging today once the daily goal is reached") |
| M9 | One OS notification per natural phase end (Focus / Short / Long break complete); none for skipped phases; Notifications + Sound toggles | **Verified** | `src/notifications/phase-notice.ts`; `phase-notice.integration.test.ts` ("delivers exactly one notice per phase…", "never notifies a skipped phase") |
| M10 | Welcome flow with **"Continue without an account"**; tasks stay on the phone | **Verified** | `WelcomeScreen`, `src/domain/welcome.ts`; `welcome.test.ts` ("keeps a remembered local-mode choice in the app after restart"); `welcome.png` |
| M11 | Blocklist: save sites/apps; UI states **"Blocking is not active — this build saves your list only"**; no enforcement | **Verified as list-only** (enforcement **absent**) | `BlocklistScreen`, `src/domain/block-rule.ts` (`describeEnforcement`: Android domains "requires-permission/VpnService… Sylviae does not run one yet", Android apps "unsupported"); `block-rule.test.ts`; `blocklist.png` |
| M12 | Integrations screen (Notion, Todoist, Google Calendar import; Spotify playlists/Connect) via broker | **Partial** | `IntegrationsScreen`, `src/integrations/*`; `provider-mappers.test.ts` covers mapping only. `integrations.png` shows every provider **"Unavailable — could not reach the integration service"**, so end-to-end behaviour is not demonstrated |
| M13 | Optional account (email/Google), cross-device sync of tasks, block rules, settings, Focus session; device registry | **Partial / Unverifiable for the shipped build** | Code + tests exist (`sync-engine.test.ts`, `focus-sync.test.ts`, `settings-sync.test.ts`, `device-registry.test.ts`), but `welcome.png` states "Account sign-in needs this build's Supabase configuration" and the Desktop has no cloud client (`docs/desktop-parity.md`). **Not promoted on the landing page** |
| M14 | Reading-frog launcher icon + in-app mark; dark "moonlit pond" palette; Syne / system / JetBrains Mono | **Verified** | `assets/sylviae/icon.png`, `docs/design/README.md` tokens, `fonts.test.ts`; `launcher-icon.png`, all screenshots |
| M15 | Distribution: Android **preview** APK via EAS internal distribution (`eas.json` preview/apk) | **Verified (as preview only)** | `eas.json`; `gh release list` on the mobile repo is empty; no store listing found anywhere in code/config |
| M16 | iOS build / App Store / Google Play listing | **Unverifiable → treated as not available** | No iOS build profile, no store metadata |
| M17 | Native mobile blocking enforcement | **Planned (not started)** | `RUN.md` "Still deferred", `block-rule.ts` comments |
| M18 | Google Tasks | **Deprecated / not exposed** | `docs/desktop-parity.md` (and no code path) |

## Phase A2 — What the landing page said/showed before this change

- **Positioning:** "One calm desktop space", Windows-only; no mention of mobile at all.
- **Sections:** hero (workspace screenshot), value strip, 4-step loop, Focus audio, Distraction blocker, Tasks & integrations (tabs), Desktop continuity (system tray), Streak (desktop), **competitor comparison table**, **"What early testers noticed"** (2 featured + 10+ marquee testimonials with names, roles, 5-star ratings, "Beta since v0.6"), Local-first privacy, **"Cross into Focus Mode"** (fox-dragon companion + yellow portal), Pricing/FAQ, final CTA, footer.
- **CTAs / downloads:** every CTA → `…/releases/download/v1.0.0/toki-setup-1.0.0.exe` (Windows beta installer; release asset confirmed present, HTTP 200, pre-release). No mobile CTA, no store badges.
- **Screenshots:** 7 desktop screenshots of the Electron v1.0.0 beta (bright-green UI), 3 fox-dragon companion PNGs, 1 illustrated room JPG.
- **Brand:** old bright-green + cream-yellow palette, Fraunces/Outfit fonts, previous icon (`assets/icon.*`).
- **Other pages:** `auth/callback/index.html` (the hosted email-confirmation / password-reset page that **Sylviae Mobile routes its email links through**, PR #6/#9/#10) used the old palette and an "s" glyph as logo.

## Phase A3 — Discrepancies

| # | Landing (before) | Reality (mobile main) | Type | Severity |
|---|------------------|-----------------------|------|----------|
| D1 | No mention of Sylviae Mobile at all | Mobile app exists with timer, tasks, Deep Focus, audio, history, widget, reminders | Missing feature | High |
| D2 | Brand: old yellow/green palette, previous icon, fox-dragon companion, "Focus Mode" yellow portal | Approved reading-frog icon; dark moonlit-pond tokens (#111513 / #8fc27a / #f0c75e); Syne/system/JetBrains Mono | Outdated visuals | High |
| D3 | Testimonials with names, roles, 5-star ratings and "Beta since v0.6" | Nothing in code, tests or docs supports these quotes, people or ratings | **Claim without evidence** (violates "no invented testimonials") | High |
| D4 | Competitor table (Forest/Pomofocus, Cold Turkey/Freedom, Endel/Brain.fm, Todoist/Notion) with ✓/—/$ ratings for third-party products | Cannot be verified from this repo; third-party facts change | **Unverifiable claim** | Medium |
| D5 | Favicon / apple-touch / nav / footer used previous icon; callback page used an "s" glyph | Approved frog icon (desktop `sylviae-icon-*`, mobile tile) | Outdated brand mark | Medium |
| D6 | "Spotify and YouTube… directly inside Sylviae" | True for desktop per audit; **on mobile links open in the provider's app** | Needs scoping | Medium (new risk once mobile is described) |
| D7 | "Block distracting sites and apps" | Desktop: yes. **Mobile: saves list only, blocking not active** | Needs scoping (would be false for mobile) | High (once mobile is described) |
| D8 | Integrations copy implied universal availability | Mobile integrations depend on the broker service; screenshot shows "Unavailable" | Needs scoping | Medium |
| D9 | "Which operating systems are supported? Windows 64-bit" | Windows desktop beta **and** Android preview; no iOS/macOS/Linux | Outdated | Medium |
| D10 | Streak section only desktop | Mobile also has history calendar, streak, Android widget | Missing feature | Medium |
| D11 | Open Graph/Twitter image = old poster; title says "Desktop Focus Workspace for Windows" | Product is now desktop + mobile | Outdated meta | Low |
| D12 | Footer links wrapped never (`nav.footer-links` overflowed the viewport at 375 px) | — | **Pre-existing layout bug** | Low |
| D13 | Heading order jumped h2 → h4 in 7 places | — | A11y defect | Low |
| D14 | Fraunces + Outfit web fonts (2 extra render-blocking requests) | Tokens call for Syne titles + system body | Perf / consistency | Low |
| D15 | Desktop screenshots show the Electron v1.0.0 UI | Current desktop is a Rust/GPUI "moonlit pond" preview (branch `feat/native-rust-desktop`, not released); the downloadable installer is still v1.0.0 | **Unverifiable here — kept, flagged** | Info (see Limitations) |

---

## Phase B — Ranked change plan

1. **Correctness / honesty first.** Remove invented testimonials + ratings (D3) and the unverifiable competitor table (D4). Scope every mobile statement to what the code proves (D6–D8): spell out *no blocking on the phone*, *Spotify/YouTube open in their apps*, *integrations need the service*, *no store listing*.
2. **Value communication.** Add a **Sylviae Mobile** section (D1, D10) with real screenshots and six verified features; replace the competitor table with an honest **Windows desktop vs Android mobile** table that shows differences (including "—" for mobile blocking). Update hero, meta, FAQ (OS support, "Is there a mobile app?", "Does mobile block apps?").
3. **Mobile/site consistency.** Re-skin via design tokens only (D2, D14): dark BG #111513, surface #171c19, text #efe9dc, muted #a3a79b, accent #8fc27a, gold #f0c75e; Syne titles, system body, JetBrains Mono. Same structure and components. Replace the fox-dragon "Focus Mode" section with the real **Deep Focus** pond screenshot (D2).
4. **Visuals where justified.** Approved frog icon for favicon/nav/footer/apple-touch/callback page (D5); new OG image built from the real Deep Focus screenshot (D11); six mobile screenshots resized to 540×1200 WebP (≈ 20–30 KB each).
5. **CTAs.** Keep the single real download (Windows installer). **No mobile download button and no store badges** (no such artifacts exist). Hero gets a secondary anchor link to the mobile section.
6. **Responsiveness.** Phone screenshots become a scroll-snap row ≤ 640 px; fix footer link overflow (D12); table collapses to labelled cards (existing mechanism).
7. **A11y / perf.** Fix heading order (D13); alt text for every image; drop 2 web fonts; remove dead testimonial/portal CSS and unused fox-dragon images; keyboard focus + contrast checks (Phase D).

Explicitly **not** done (out of scope / needs owner): deploy, mobile download link, store badges, refreshed desktop screenshots, new OG deployment, analytics changes.

---

## Phase C — What changed (files)

- `index.html`: tokens re-skin; hero/meta/nav/footer/FAQ copy; new `#mobile` section; `#compare` rewritten as desktop-vs-mobile; `#stories` (testimonials) removed; `#focusmode` rewritten as Deep Focus with real screenshot; `h4`→`h3` heading order; footer wrap fix; dead CSS removed (~290 lines).
- `auth/callback/index.html`: palette + frog mark aligned with the app (logic untouched; callback tests pass).
- `assets/icon.png|ico`, `assets/apple-touch-icon.png`: approved frog icon. `assets/mobile/*.webp`, `assets/mobile/app-icon.png`: screenshots/icon.
- `public/assets/og-sylviae.jpg`: new 1200×630 share image.
- Removed: `assets/sylviae/companion-*.png`, `assets/sylviae/deep-focus-bg.jpg` (old fox-dragon visuals, no longer referenced).
- `docs/screenshots/{before,after}/landing-{375,768,1280,1920}.jpg`.

## Phase D — Verification

| Check | Result |
|-------|--------|
| `bun run test` (callback tests + html-validate + asset check + link check + `vite build`) | **Pass** — 10/10 callback tests, lint clean, 15 asset refs, 11 fragment links, build OK (before and after) |
| Mobile suite on `origin/main` export | 289 passed / 16 skipped (integration needs Supabase stack) |
| Screenshots 375/768/1280/1920 before & after | `docs/screenshots/`; no real horizontal scroll at any width (`scrollX` stays 0). The 375 px page is ~17 000 px tall, so its image is cut at 16 000 px (footer area not shown) |
| Links/CTAs | 0 dead `#anchors`; Windows installer URL → HTTP 200 (release `v1.0.0`, asset `toki-setup-1.0.0.exe`, pre-release); `auth/callback` back link and `toki://auth-callback` unchanged |
| A11y (automated, headless Chrome, reduced-motion) | 0 images without alt; decorative brand icons have `alt=""` next to visible text; 1 × `h1`, **0 heading-order skips** (was 7); 0 text/background pairs below WCAG AA (4.5:1, 3:1 for large text); skip link + all nav/CTA links show a 2 px focus outline in keyboard Tab order; phone-screenshot row is a focusable scroll region |
| Not run | Screen-reader pass, Lighthouse, real-device touch testing |

### Claim → inventory map (every product claim on the new/changed copy)

| Landing claim | Inventory row |
|---------------|---------------|
| "Focus, short and long breaks… start, pause, skip or end" | M1 |
| "task list that lives on your phone and daily tasks that come back each day" | M2 |
| "While a Focus session runs, the screen becomes a looping moonlit pond with your task and the countdown" / "looping muted video that mixes with your focus audio" / "Pause, skip or end… see which track is playing" | M3 |
| "Five offline tracks… follow the Focus timer or play continuously" | M4 |
| "Saved Spotify and YouTube links open in their own apps" | M5 |
| "monthly calendar of partial and complete days" | M6 |
| "Android home-screen widget with your week and current streak" | M7 |
| "Gentle nudges about open tasks and your streak… English, Portuguese or Spanish" | M8 |
| "a notice when a Focus or break phase ends" | M9 |
| "Continue without an account and your tasks stay on your phone" | M10 |
| "No blocking on the phone… saves the list only" | M11 (list-only) |
| "Integrations… need the integration service to be reachable" (mobile) | M12 (Partial, stated as such) |
| "Android preview build… not on Google Play or the App Store, no public mobile download" | M15, M16 |
| "There is no macOS, Linux or iOS version" | M16 (no build exists) |
| Desktop-column ticks and desktop-only copy | Carried over unchanged from the previous landing, which was audited against the desktop app in `product/feature-evidence.json` (Aug 2026, 433 desktop tests). **Not re-verified in this task** |

No claim on the page maps to a Partial/Planned/Unverifiable row except where the page says so explicitly (M11, M12, M15). Account sync (M13) is deliberately not mentioned.

## Limitations

- **Mobile has no public download.** Nothing links to a mobile build; owner must decide the distribution channel (APK link, Play internal testing, TestFlight) before adding a CTA.
- **Desktop screenshots and the installer are the v1.0.0 Electron beta.** The current desktop is the Rust/GPUI "moonlit pond" preview on an unreleased branch; the page's desktop screenshots (bright green) therefore no longer match the new dark page or brand. Refreshing them needs new desktop captures and a new release — owner action.
- **Cross-device account sync** is implemented on mobile but depends on a configured backend and has no desktop client; intentionally not advertised.
- **OG image / favicon only take effect on deploy**; no deploy, merge or push to `main` was done.
- Desktop-side claims were not re-audited (out of scope); testimonials/competitor claims were removed rather than verified.
- Automated a11y/contrast checks only; no manual screen-reader or Lighthouse run. The 375 px full-page "after" image is truncated at 16 000 px.
- GitHub Pages mirror still uses the `/Toki-Landing/` base path, which is unchanged.
