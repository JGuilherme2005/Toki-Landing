# Toki App Image Audit & Screenshot Selection

**Date:** August 6, 2026 (v1) · **Updated:** August 21, 2026 (v2)
**v2 Source Directory:** `C:\Users\regob\Downloads\Projetos_de_Codigo\Toki-Landing\asserts_2.0`
**Target Folder:** `assets/app/`

---

## 1. v2 Asset Inventory (current)

Full-window captures of the rebranded Sylviae app (green theme, icon-tab nav), no title bar chrome, ~1913×1076px each.

| Filename (source) | Landing filename | App View Shown | Dimensions | Category / Target Section |
| :--- | :--- | :--- | :--- | :--- |
| `workspace.png` | `assets/app/workspace.png` | Focus timer + Focus List + Today's Progress | 1913×1072 | **Hero visual** & **Core workflow** (`#top`, `#workflow`) |
| `appblocklist.png` | `assets/app/appblock.png` | App Blocklist (.exe) + Site Blocklist, Secure DNS notice | 1913×1076 | **Distraction Blocker** (`#blocker`) |
| `deepfocus_music.png` | `assets/app/deepfocus.png` | Deep Focus — offline library (Focus Library tab), current sound + volume, playback mode | 1918×1077 | **Deep Focus audio**, "Offline library" tab (`#audio`) |
| `deepfocus_music_yt.png` | `assets/app/deepfocus-youtube.png` | Deep Focus — YouTube source playing, Spotify connect CTA, saved audio list | 1915×1078 | **Deep Focus audio**, "YouTube" tab (`#audio`) |
| `calendar_steak_consistency .png` | `assets/app/streak.png` | Streak & Consistency — current/best streak, productive days, monthly focus calendar | 1915×1076 | **Streak & Consistency** (new section, `#streak`) |
| `settings.png` | `assets/app/settings.png` | Timer Settings, System toggles, Notification Type, About | 1912×1077 | **Desktop Continuity / Settings** (`#continuity`) |
| `intregations.png` (added later) | `assets/app/integrations.png` | "Bring into Sylviae" modal — Notion, Todoist, Google Calendar connected, Google Tasks/Obsidian coming soon | 1915×1077 | **Tasks & Cloud Integrations** (`#integrations`) |

### Resolved gap

`#integrations` previously used `assets/app/calendar.png`, which actually showed the Streak & Consistency screen, not the integrations modal — a mismatch carried over from v1. It's now fixed with `assets/app/integrations.png` (correct content, current "Sylviae" branding, no title-bar chrome — consistent with every other screenshot on the page). The stale `calendar.png` and the off-brand `toki-intregations.png` (old "Toki" title, modal-over-blurred-background) have been deleted from `assets/app/`.

---

## 2. v2 Section Assignment Strategy

- **Hero + Core workflow**: `workspace.png` — timer, focus list, and today's progress in one frame; reused in both the hero and the Workspace tab of the integrations showcase.
- **Deep Focus audio**: two-tab showcase — `deepfocus.png` (offline library, default tab) and `deepfocus-youtube.png` (YouTube source, second tab) — replacing the single static image.
- **Distraction Blocker**: `appblock.png` — app + site blocklists and the Secure DNS status row.
- **Streak & Consistency** *(new section, inserted between Desktop Continuity and the comparison table)*: `streak.png` — current streak, best streak, productive days this month, and the monthly focus calendar.
- **Desktop Continuity**: `settings.png` — timer defaults, background/notification toggles, persisted across sessions.

---

## 3. v1 History (superseded)

<details>
<summary>Original August 6, 2026 audit</summary>

| Filename | App View Shown | Dimensions | Size | Target Landing Section |
| :--- | :--- | :--- | :--- | :--- |
| `workspace .png` | Main Workspace & Focus Timer | 1422×932 | 54.2 KB | Hero Visual & Core Workflow |
| `Deepfocus .png` | Deep Focus Audio Engine | 1407×935 | 78.2 KB | Deep Focus Audio Section |
| `appblock.png` | Desktop Distraction Blocker | 1437×911 | 52.8 KB | Distraction Blocker Section |
| `calendar.png` | Tasks & Integrations | 1447×930 | 69.2 KB | Tasks & Cloud Integrations Section |
| `settings.png` | Settings & Desktop Continuity | 1446×927 | 50.0 KB | Progress & Desktop Continuity Section |

The originals in `app-images/` remain untouched; v1 derivatives lived in `assets/app/` under the same names now overwritten by v2.

</details>
