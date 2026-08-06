# Toki App Image Audit & Screenshot Selection

**Date:** August 6, 2026  
**Source Directory:** `C:\Users\regob\Downloads\Projetos_de_Codigo\Toki-Landing\app-images`  
**Target Optimization Folder:** `C:\Users\regob\Downloads\Projetos_de_Codigo\Toki-Landing\assets\app\`

---

## 1. Asset Inventory

| Filename | App View Shown | Dimensions | Size | Visible State | Private Info | Suitable for Desktop | Suitable for Mobile | Trimming Needed | Target Landing Section |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `workspace .png` | **Main Workspace & Focus Timer** | 1422 $\times$ 932 px | 54.2 KB | Active focus session with timer (25:00), active task selection, navigation sidebar, and Bonsai tree. | None | **Yes (Hero & Core Workflow)** | Yes (Responsive framing) | No | **Hero Visual & Core Workflow** |
| `Deepfocus .png` | **Deep Focus Audio Engine** | 1407 $\times$ 935 px | 78.2 KB | Deep Focus tab open with ambient soundscape selection, Spotify & YouTube audio sources, timer sync toggle. | None | **Yes (Deep Focus Section)** | Yes | No | **Deep Focus Audio Section** |
| `appblock.png` | **Desktop Distraction Blocker** | 1437 $\times$ 911 px | 52.8 KB | Blocker interface showing website rules, executable app blocking, and active session protection status. | None | **Yes (Distraction Blocker)** | Yes | No | **Distraction Blocker Section** |
| `calendar.png` | **Tasks & Integrations** | 1447 $\times$ 930 px | 69.2 KB | Integrations & Calendar view showing Google Calendar, Notion, and Todoist connected sources and imported tasks. | None | **Yes (Tasks & Integrations)** | Yes | No | **Tasks & Cloud Integrations Section** |
| `settings.png` | **Settings & Desktop Continuity** | 1446 $\times$ 927 px | 50.0 KB | Preferences panel with custom timer durations, autostart toggle, system tray settings, and local data paths. | None | **Yes (Desktop Continuity)** | Yes | No | **Progress & Desktop Continuity Section** |

---

## 2. Derivative Assets Created

The original files in `app-images/` remain 100% untouched. Optimized web derivatives are stored in `assets/app/`:

1. `assets/app/workspace.png` (from `workspace .png`)
2. `assets/app/deepfocus.png` (from `Deepfocus .png`)
3. `assets/app/appblock.png` (from `appblock.png`)
4. `assets/app/calendar.png` (from `calendar.png`)
5. `assets/app/settings.png` (from `settings.png`)

---

## 3. Section Assignment Strategy

- **Hero Section**: `assets/app/workspace.png` — Hero mockup showing the active desktop focus environment in full high-resolution detail above the fold.
- **Core Focus Workflow**: `assets/app/workspace.png` — Step-by-step interactive workflow demonstration (Choose task $\rightarrow$ Enter Focus $\rightarrow$ Protect session $\rightarrow$ Desktop continuity).
- **Deep Focus Audio Section**: `assets/app/deepfocus.png` — Large dedicated section showing packaged ambient soundscapes, Spotify & YouTube timer sync, and continuous playback options.
- **Desktop Distraction Blocker**: `assets/app/appblock.png` — System-level process killing, hosts DNS blocking, and browser tab protection.
- **Tasks & Cloud Integrations**: `assets/app/calendar.png` — Interactive tabbed showcase demonstrating 1-click import from Google Calendar, Todoist, and 2-way sync with Notion.
- **Progress & Desktop Continuity**: `assets/app/settings.png` — Demonstrating system tray operation, background persistence, and local preferences.
