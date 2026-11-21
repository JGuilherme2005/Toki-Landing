# Lighthouse mobile, 3 runs each (local `vite preview`, VERCEL=1 root build, headless Chrome)

| | Run 1 | Run 2 | Run 3 |
| --- | --- | --- | --- |
| Before (origin/main) | 100, CLS 0, LCP 1.8 s | 100, CLS 0, LCP 1.8 s | 100, CLS 0, LCP 1.8 s |
| After (this PR) | 100, CLS 0, LCP 1.8 s | 100, CLS 0, LCP 1.8 s | 100, CLS 0, LCP 1.8 s |

(An earlier "before" run scored 65 because a Rust build was running on the same machine; discarded and re-run idle.)
