# Toki Product Feature Inventory

**Repository:** `Toki-App` (`C:\Users\regob\Downloads\Projetos_de_Codigo\Toki-App`)  
**Branch:** `feature/deep-focus-audio`  
**Audit Standard:** Codebase Verification + Test Suite Execution (`40 test files, 433 unit tests passed`) + Branch & Commits Review  
**Date:** August 6, 2026  

---

## 1. Executive Summary

This document presents the complete, verified product-feature inventory for **Toki**, an offline-first desktop focus application for Windows. Every feature, sub-component, architectural boundary, and external integration has been audited against the actual source code, test suite, and branch history of `Toki-App`.

### Key Findings
1. **Source of Truth:** `Toki-App` contains 11 core sub-systems. All 433 unit tests pass (`vitest`), and TypeScript typechecking succeeds cleanly (`tsc`).
2. **Core Strengths:** Pure reducer Pomodoro state machine with zero wall-clock drift, offline-first Deep Focus audio engine with local CC BY ambient tracks and isolated Spotify/YouTube embeds, 3-tiered Windows distraction blocker (process termination + hosts DNS modification + PowerShell browser tab closure), and local-first zero-telemetry architecture with OS-backed `safeStorage` encryption.
3. **Integration Reality:**
   - **Google Calendar:** Fully implemented 1-way OAuth event import (outdated on current landing page FAQ).
   - **Notion:** Fully implemented 2-way OAuth sync (imports unchecked checkboxes and updates Notion page status/checkbox state on completion).
   - **Todoist:** Fully implemented 1-way OAuth project task import.
4. **Current Inaccuracies & Gaps on Landing:**
   - Landing FAQ claims Google Calendar is "planned for a future release" — it is already built and tested in `Toki-App`.
   - Deep Focus audio (ambient soundscapes + Spotify/YouTube timer-sync) is missing entirely from current landing feature cards.
   - Blocker claims desktop enforcement without mentioning Windows UAC administrator elevation requirements.

---

## 2. Product Definition & Positioning

### Product Category
**Calm Desktop Focus Workspace** (desktop-first environment combining focus timer, task context, distraction blocking, focus audio, and cloud task imports).

### Target User
Knowledge workers, software developers, writers, students, and creative professionals on Windows who struggle with browser tab switching, app distractions, fragmented task lists, and context switching.

### Primary Problem Solved
Distraction-heavy desktop environments where time tracking, task context, focus music, and app blocking are fragmented across multiple browser tabs and background tools.

### Main Transformation Promised
From scattered, distraction-prone work sessions to a calm, protected desktop focus routine where time, task, sound, and boundaries land in one place.

### Three Strongest Differentiators
1. **Desktop-Level OS Blocker:** Blocks distracting sites and process executables at the Windows system level without relying on bypassable browser extensions.
2. **Timer-Bound Deep Focus Audio:** Integrated Spotify, YouTube, and offline ambient soundscapes that automatically start, pause, and fade with focus cycles.
3. **Local-First & Zero-Telemetry Privacy:** All task, timer, streak, and history data remains local on-device; Cloudflare OAuth broker isolates tokens so API credentials never touch the renderer or local disk unencrypted.

---

## 3. Complete Verified Feature Inventory

### 3.1 Core Focus Experience
- **Pomodoro Timer Engine:** Pure reducer state machine in `src/pomodoro/machine.ts` with zero side-effects inside reducer. Side-effects emitted as `MachineEffect[]`.
- **Phases:** `IDLE`, `FOCUS`, `SHORT_BREAK`, `LONG_BREAK`, `COMPLETED` (`src/pomodoro/machine.types.ts`).
- **Durations:** Default 25m Focus / 5m Short Break / 15m Long Break; customizable in integer minutes via Settings and stored under `customTimes` (`src/store.js`).
- **Actions:** Start, Pause, Resume, Reset, Reset Cycle, Skip Phase, Force Phase, Advance Phase.
- **Anti-Drift & Sleep Recovery:** `TimerEngine` (`src/pomodoro/engine.ts`) calculates wall-clock deadlines (`expectedEndTime`) and reconciles on OS wake via `TICK_WAKE` events.
- **Bonsai Companion:** SVG visual progress tree in `src/bonsai.js` advancing through 5 intra-session growth stages (seed $\rightarrow$ flourished) and 5 global evolution levels.

### 3.2 Deep Focus Audio
- **Offline Audio Library:** 5 packaged CC BY 4.0 MP3 files (`peace-of-mind.mp3`, `new-direction.mp3`, `ephemera.mp3`, `static.mp3`, `there-is-a-place.mp3`) in `src/assets/sounds/deep-focus/`.
- **Playback Modes:**
  - `with-focus-timer` (Default): Audio automatically starts when Focus begins, pauses on break, and fades out over 5,000ms upon completion (`src/deep-focus/controller.ts`).
  - `continuous`: Audio plays continuously across breaks until manually stopped.
- **Provider Host Sandbox:** Local HTTP loopback server (`127.0.0.1:<port>/focus-audio/<token>`) in `src/deep-focus/provider-host.js` running Spotify and YouTube embed SDKs under a strict Content Security Policy (`frame-ancestors file:`).
- **External Player Dock:** 224px $\times$ 224px visible dock (`#focusAudioProviderDock`) preventing iframe context destruction during view switches.
- **YouTube Progress Persistence:** Playback position and playlist index captured every 4,000ms.
- **Starter Playlists:** 3 built-in Spotify playlists ("Deep Focus", "lofi beats", "Brain Food") in `src/deep-focus/starter-playlists.ts`.

### 3.3 Workspace & Task Management
- **Workspace Task List:** Create, edit, complete, delete, and reorder tasks directly in main workspace (`src/index.html`).
- **Current Task Binding:** Selected task binds `sessionTaskId` to active Pomodoro session on `START`.
- **Daily Reset & Routines:** `performDailyReset()` runs automatically at 00:00:10. Tasks tagged `isDaily: true` are retained; non-daily tasks are archived to history.
- **Multi-Select & Bulk Operations:** Batch reordering and task manager modal (`#taskManagerModal`).

### 3.4 Website & Application Blocker
- **App Termination:** Kills process executables using `taskkill /F /IM "<app.exe>"` (`src/blocker.js`) and path-based script `src/kill_by_path.ps1`.
- **Hosts File DNS Blocker:** Writes `127.0.0.1` and `::1` loopback entries between `# TOKI_BLOCK_START` and `# TOKI_BLOCK_END` markers in `C:/Windows/System32/drivers/etc/hosts` and executes `ipconfig /flushdns`.
- **Browser Tab Blocker:** PowerShell script `src/scripts/block_sites.ps1` matches browser window titles (Chrome, Edge, Opera, Firefox, Brave) and sends `Ctrl+W` tab close signals every 3,000ms during active focus.
- **Elevation Requirement:** Automatically triggers Windows UAC prompt (`Start-Process -Verb RunAs` in `main.js`) on startup to obtain host editing rights.

### 3.5 External Integrations & OAuth
- **Google Calendar (1-Way Import):** Lists user calendars, queries events in RFC3339 date ranges (`today`, `next-7-days`, `next-30-days`), and imports events as tasks using 32-bit FNV-1a hash IDs (`google-calendar-<hash>`).
- **Notion (2-Way Sync):** Recursively traverses page checkbox blocks using a 4-concurrency semaphore (`backend/src/notion.ts`). Imports unchecked `to_do` blocks. `NotionSubscriber` (`src/integrations/notion/subscriber.ts`) enqueues completion updates to a persistent `localStorage` queue, updating Notion page status (`Status`, `Completed At`, `Focus Minutes`) and checkbox state.
- **Todoist (1-Way Import):** Fetches projects and uncompleted tasks (`data:read` scope) with priority, due dates, and project labels (`src/integrations/todoist/importer.ts`).
- **OAuth Infrastructure:** Cloudflare Worker broker (`backend/src/index.ts`) isolates client secrets. OAuth access tokens are encrypted with AES-256-GCM in Cloudflare D1. Desktop installation credentials use Windows DPAPI via Electron `safeStorage`.

### 3.6 Desktop Experience & System Behavior
- **Platform:** Windows 64-bit (`dist/Toki Setup 1.0.0.exe`).
- **System Tray:** Runs silently in notification area when main window is closed (`main.js`).
- **Single Instance Lock:** Prevents multiple running instances via `app.requestSingleInstanceLock()` and file watcher on `%APPDATA%/userData/duplicate_trigger`.
- **Native Notifications:** Native Windows OS notifications for timer completions and blocker terminations.

### 3.7 Privacy, Security, & Local-First
- **100% Local Data:** Tasks, history, streaks, settings, and analytics stored locally in `electron-store` (`src/store.js`).
- **Zero Telemetry:** Audited codebase contains zero tracking scripts, analytics webhooks, or telemetry providers (`src/lib/analytics.js` is strictly an in-memory session calculator).
- **Renderer Isolation:** `contextIsolation: true`, `nodeIntegration: false`, `webSecurity: true`, subframe IPC access blocked (`preload.js`).
- **URL & Navigation Guard:** External links strictly validated against whitelist (`open.spotify.com`, `youtube.com`, etc.) and forced to open in system browser (`shell.openExternal`).

---

## 4. Feature Classification Matrix

| Feature ID | Feature Name | Status | User Value | Marketing Suitability | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `core-pomodoro-engine` | Pomodoro Focus & Break Engine | Released/merged | Primary | Hero-level | Verified in code and tests |
| `deep-focus-audio-engine` | Deep Focus Audio & Soundscapes | Implemented on branch | Primary | Hero-level | Verified in code and tests |
| `workspace-task-management` | Workspace Task & Daily Flow | Released/merged | Primary | Main feature section | Verified in code and tests |
| `distraction-blocker` | Desktop Distraction Blocker | Released/merged | Primary | Main feature section | Verified in code only |
| `google-calendar-integration` | Google Calendar Task Import | Released/merged | Supporting | Main feature section | Verified in code and tests |
| `notion-integration` | Notion 2-Way Task Sync | Released/merged | Supporting | Main feature section | Verified in code and tests |
| `todoist-integration` | Todoist Task Import | Released/merged | Supporting | Main feature section | Verified in code and tests |
| `history-analytics` | Local Analytics & History | Released/merged | Supporting | Secondary feature | Verified in code and tests |
| `system-tray-background` | System Tray Background Run | Released/merged | Supporting | Secondary feature | Verified in code only |
| `privacy-security-local-first` | Zero-Telemetry Privacy Architecture | Released/merged | Primary | Secondary feature | Verified in code and tests |
| `bonsai-visual-companion` | Visual Bonsai Growth Companion | Released/merged | Supporting | Secondary feature | Verified in code and tests |
| `autostart-on-boot` | Windows Autostart on Boot | Planned only | Advanced | Do not market yet | Verified in code only |

---

## 5. Marketing Suitability & Visibility Recommendations

### Top-Page Visibility (Hero & Main Sections)
1. **Calm Pomodoro Focus Timer Engine:** Configurable work/break cycles with zero-drift sleep recovery.
2. **Deep Focus Audio & Soundscapes:** Timer-bound Spotify/YouTube streaming and offline ambient soundscapes.
3. **Desktop Distraction Blocker:** System-level website and app blocking on Windows.
4. **Cloud Task Integrations:** 1-click import from Google Calendar, Todoist, and 2-way sync with Notion.

### Lower-Page Visibility (Secondary & Feature Grids)
1. **Local Analytics & Monthly Calendar Grid:** Daily focus minutes, session deduplication, and streak tracking.
2. **System Tray Operation:** Minimizes to system tray while maintaining active focus protections.
3. **Visual Bonsai Companion:** Subtle visual growth tied to completed sessions.
4. **Local-First Zero-Telemetry Guarantee:** Complete privacy with OS safeStorage encryption.

### Do Not Market Yet
1. **Windows Boot Autostart:** Feature is not implemented in codebase (`app.setLoginItemSettings()` missing).
2. **Spotify Account Playlist Sync:** Toki supports Spotify embeds, but not Spotify user account login or personal playlist imports.
3. **Google Calendar 2-Way Sync / Event Creation:** Integration is strictly 1-way import.
4. **macOS or Linux Support:** App packaging and blocker code are Windows-exclusive.

### Limitations for FAQ Section
1. **Windows Administrator Prompt:** Explaining that hosts-file DNS blocking requires accepting a Windows UAC prompt on launch.
2. **Spotify Volume Controls:** Explaining that Spotify iframe SDK does not support volume fading (pauses directly at focus end).
3. **Offline vs. Network Scope:** Clarifying that core timer, tasks, blocker, and built-in soundscapes are 100% offline, while Notion/Todoist/GCal and Spotify/YouTube require internet connection.
