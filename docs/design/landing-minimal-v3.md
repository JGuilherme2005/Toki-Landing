# Sylviae landing v3: minimal pass

Owner feedback on [PR #14](https://github.com/JGuilherme2005/Toki-Landing/pull/14) called for less text, a Forest-like pace, and a usable phone layout. The previous 375 px page was 13,777 px tall; its desktop product screenshot was too small to read and clipped the task column.

## Result

The page now opens with the frog pond, one headline, one short subline, one Windows download button, and a small Android private beta link. Four visual sections explain focus, blocking, sounds, and the Android companion. Four collapsed FAQ answers preserve the detailed caveats. Privacy is one footer line.

| Full-page capture | 375 px height | 1440 px height | What changed |
| --- | ---: | ---: | --- |
| [Before](../screenshots/polish-v3/before/375.png) | 13,777 px | 11,976 px | Previous v2 landing |
| [Round 1](../screenshots/polish-v3/round-1/375.png) | 4,626 px | 4,316 px | Removed repeated lists, table, and step sections; introduced four visual stories |
| [Round 2](../screenshots/polish-v3/round-2/375.png) | 4,428 px | 4,316 px | Shortened hero copy; moved phone crops toward the timer and blocker panels |
| [Round 3](../screenshots/polish-v3/round-3/375.png) | 4,528 px | 4,316 px | Completed phone crops so timer controls and blocker panel are visible |
| [After](../screenshots/polish-v3/after/375.png) | 4,544 px | 4,316 px | Enlarged the Android link's phone tap target |

[Before desktop](../screenshots/polish-v3/before/1440.png) and [after desktop](../screenshots/polish-v3/after/1440.png). Each round was captured and visually reviewed at both widths.

## Verification

- `bun run test`: passed, including HTML validation, links/assets, and build.
- Mobile Lighthouse on the local production preview: performance **100**, accessibility **100**, CLS **0**, LCP **1.88 s**. [JSON evidence](../lighthouse/polish-v3/after-mobile.json).
- The current main benchmark recorded in [new desktop screenshots](../lighthouse/new-desktop-screenshots.md) was performance **100** on three mobile runs; v3 is unchanged.
- `check:links` verified seven fragment links. Windows download and Android request URLs were preserved.
- Frog video remains 133 KB, muted, inline, poster backed, and hidden under reduced motion.

## Limits

The native desktop images are previews of a newer interface; the current Windows v1.0.0 beta download is called out under the first preview. Android is a private beta by request and its saved blocklist does not block sites or apps on Android. The screenshots are full-page captures at fixed viewport widths; visual checks were done at 375 and 1440 px.
