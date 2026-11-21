# Lighthouse before/after (local `vite preview`, headless Chrome, Lighthouse CLI)

Raw JSON/HTML reports live in `before/` and `after/`. Screenshots at 375/768/1280/1920 px are in `../screenshots-quality/`.

## Review fixes (CLS)

Independent re-run (3 runs each, local preview, headless Chrome): landing mobile perf 95-96 (CLS 0), landing desktop 99 (CLS 0), callback mobile/desktop 100 (CLS 0.020 / 0.006). The font swap CLS was fixed with metric-matched `Syne Fallback` faces (Arial + `size-adjust`/`ascent-override`/`descent-override`); `sizes` on the screenshots now match the rendered widths so desktop gets the 1280w file.
