# Toki Landing Page Gap & Accuracy Audit

**Audit Baseline:** `Toki-App` codebase (`C:\Users\regob\Downloads\Projetos_de_Codigo\Toki-App` on branch `feature/deep-focus-audio`)  
**Audit Target:** `Toki-Landing` (`C:\Users\regob\Downloads\Projetos_de_Codigo\Toki-Landing/index.html`)  
**Audit Purpose:** Comprehensive line-by-line audit of current landing claims against verified app functionality to identify inaccuracies, outdated statements, and missing features.  
**Date:** August 6, 2026  

---

## 1. Landing Claims Audit Table

| Claim # | Landing Section & Lines | Current Landing Claim | Classification | Evidence in Toki-App Codebase | Recommended Replacement Copy |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | Hero (`index.html:1445-1447`) | *"TOKI is a desktop focus and deep work app for Windows. The biggest platforms are built to keep your attention moving. TOKI was built to help it land."* | **Accurate** | Electron 30 app built for Windows (`package.json:35-38`, `main.js:180-196`). Target artifact `Toki Setup 1.0.0.exe`. | Keep as is. |
| **2** | Hero Trust (`index.html:1460`) | *"No account in beta"* | **Accurate** | No user login/registration in app. All core state hydrated via local store (`src/index.html:2364`). | Keep as is. |
| **3** | Hero Trust (`index.html:1461`) | *"Local blocking"* | **Accurate** | Local process termination (`taskkill`) and local hosts file manipulation (`src/blocker.js:8-204`). | Keep as is. |
| **4** | Feature 01 (`index.html:1540-1551`) | *"A configurable Pomodoro cycle that puts a clear boundary around your work."* | **Accurate** | Pure reducer state machine (`src/pomodoro/machine.ts`) with configurable durations and wall-clock sleep recovery. | Keep as is. |
| **5** | Feature 02 (`index.html:1553-1565`) | *"Chosen sites and apps are kept out of reach while the cycle runs. Local, desktop-level enforcement — no extension, no workaround."* | **Partially Accurate** | Blocker is local & desktop-level (`src/blocker.js`), but requires Windows UAC Administrator elevation prompt on launch (`main.js:343`). | *"Local desktop-level enforcement — blocks apps and sites directly on Windows without browser extensions."* |
| **6** | Feature 03 (`index.html:1568-1577`) | *"Your work leaves a trace. A quiet companion grows through your sessions."* | **Accurate** | Visual SVG Bonsai companion (`src/bonsai.js`) with 5 growth stages and 5 evolution levels. | Keep as is. |
| **7** | Integrations (`index.html:1734`) | *"Yes. The desktop app can import work from Notion and Todoist. Google Calendar integration is planned for a future release."* | 🚨 **OUTDATED** | **Google Calendar integration is FULLY IMPLEMENTED in Toki-App!** (`src/integrations/google-calendar/importer.ts`, `backend/src/google-calendar.ts`, `main.js:459-469`). | *"Yes. The desktop app imports work directly from Notion, Todoist, and Google Calendar via secure OAuth."* |
| **8** | Offline FAQ (`index.html:1724-1726`) | *"Yes. The current beta runs as a local desktop app on Windows. No internet required once installed."* | **Partially Accurate** | Timer, tasks, blocker, and built-in ambient audio run 100% offline. However, Notion/Todoist/GCal sync and Spotify/YouTube audio streaming require network connection. | *"Yes. The timer, local blocker, tasks, and built-in ambient soundscapes run 100% offline. Network connection is only needed for cloud task sync or streaming Spotify/YouTube audio."* |
| **9** | Account FAQ (`index.html:1728-1730`) | *"No. Download, open, and start a block. That's it. Account support may come later, but the beta is fully local."* | **Accurate** | Tokens stored locally via OS `safeStorage` DPAPI (`src/oauth/secure-installation.js`). No Toki account required. | Keep as is. |
| **10** | Audio Feature (`index.html`) | *Not mentioned anywhere on landing page.* | 🚨 **MISSING** | **Deep Focus Audio Engine is FULLY IMPLEMENTED!** 5 offline ambient MP3s (`src/assets/sounds/deep-focus/`), Spotify/YouTube embeds (`src/deep-focus/provider-host.js`), and timer auto-sync. | Add dedicated **Instrument 04: Deep Focus Audio** feature card. |
| **11** | System Tray (`index.html`) | *Not mentioned anywhere on landing page.* | 🚨 **MISSING** | System tray minimize on close implemented in `main.js:224-258`. | Add system tray bullet point to desktop features. |
| **12** | Single Instance (`index.html`) | *Not mentioned anywhere on landing page.* | 🚨 **MISSING** | Single instance lock and IPC file watcher notification implemented in `main.js:262-320`. | Add single-instance protection bullet point. |

---

## 2. Detailed Section-by-Section Analysis

### 2.1 Hero & Navigation
- **Hero Statement:** Accurate and well-aligned with product vision.
- **CTA Download Target:** Filename `toki-setup-1.0.0.exe` matches `package.json:36` artifact pattern (`Toki Setup ${version}.${ext}`).
- **Trust Badges:** Accurate (Windows beta, No account required, Local blocking).

### 2.2 Feature Instruments Section
- **Instrument 01 (Timer):** Accurate representation of Pomodoro machine.
- **Instrument 02 (Blocker):** Accurate, but benefits from clarifying Windows administrator privilege requirements in FAQ.
- **Instrument 03 (Bonsai Companion):** Accurate representation of `src/bonsai.js`.
- **MISSING Instrument 04 (Deep Focus Audio):** Major product gap on landing. Audio engine (offline ambient soundscapes, Spotify & YouTube timer-synced playback) is one of Toki's primary features on branch `feature/deep-focus-audio`.

### 2.3 Integration Claims
- **Notion:** Accurate (2-way sync implemented for page status, completion timestamp, and checkbox blocks).
- **Todoist:** Accurate (1-way task import implemented).
- **Google Calendar:** 🚨 **OUTDATED**. Landing FAQ explicitly states Google Calendar is "planned for a future release", whereas `Toki-App` contains complete OAuth client, worker backend handlers, RFC3339 date range filtering, and FNV-1a deduplication task import (`src/integrations/google-calendar/importer.ts`).

### 2.4 Privacy & Technical Architecture Claims
- **Local Data Storage:** Accurate (`electron-store` local storage).
- **Zero Tracking:** Accurate (no telemetry frameworks or external tracking scripts).
- **Security:** Accurate (`safeStorage` DPAPI encryption on local installation secrets, AES-256-GCM cloud token encryption, renderer context isolation).

### 2.5 Visual Assets & Media
- Media files in `Toki-Landing/assets/` (`toki-improved.mp4`, `toki-shot-setup.png`, `toki-shot-focus.png`, `toki-shot-block.png`, `icon.png`, `icon.ico`) are valid.
- Screenshots accurately represent the core UI layout. However, new screenshots capturing the **Deep Focus Audio** tab and **Google Calendar Integration** modal should be added when updating the landing page.

---

## 3. Recommended Landing Page Corrections in Priority Order

### Priority 1: Fix Outdated Google Calendar FAQ Claim
- **Location:** `index.html:1734`
- **Issue:** Landing states Google Calendar is not yet available.
- **Action:** Update FAQ text to confirm Google Calendar is fully supported alongside Notion and Todoist.

### Priority 2: Add Deep Focus Audio Feature Card
- **Location:** `index.html` (Instruments Section, following Instrument 03)
- **Issue:** Deep Focus audio engine is missing from the landing page.
- **Action:** Insert a new feature card ("Instrument 04: Deep Focus Audio") highlighting offline ambient soundscapes and Spotify/YouTube timer synchronization.

### Priority 3: Refine Offline Capabilities Copy
- **Location:** `index.html:1726`
- **Issue:** "No internet required once installed" is slightly misleading because cloud task imports and Spotify/YouTube streaming require network access.
- **Action:** Add clear boundary explanation: timer, local blocker, tasks, and built-in soundscapes run 100% offline, while cloud sync and external streaming require internet.

### Priority 4: Highlight System Tray & Desktop Protection
- **Location:** `index.html` (Features checklist / Offer section)
- **Issue:** System tray background operation is an important desktop benefit that is currently unlisted.
- **Action:** Add bullet point: *"Minimizes to the Windows system tray to maintain distraction protection in the background."*

### Priority 5: Capture New App Screenshots
- **Location:** `index.html` (Visual showcase)
- **Action:** Capture updated high-resolution 1200 $\times$ 800px screenshots of the Deep Focus audio player and Google Calendar integration importer.
