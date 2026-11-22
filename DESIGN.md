# DESIGN.md — Sylviae Landing ("Tactile 3D Moonlit Pond")

```yaml
conceito-ancora: "A tactile 3D miniature focus instrument floating over a moonlit botanical pond — calm depth you can almost touch."
modo: imersivo
intensidade: ousado
color:
  base: "#111513"      # deep moonlit pond night background (surfaces: #171c19, #1f2521; text: #efe9dc; muted: #a3a79b)
  destaque: "#8fc27a"  # botanical lime primary action & active focus signal
  acento: "#f0c75e"    # firefly gold rim light, specular edge & active indicator
typography:
  display: "'Syne', 'Syne Fallback', 'Segoe UI', system-ui, sans-serif (700)"
  body: "'Segoe UI', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif (400/600)"
  mono: "'JetBrains Mono', 'JetBrains Mono Fallback', 'Consolas', ui-monospace, monospace (300/500)"
  h1: "clamp(52px, 5.5vw, 78px) / -0.045em / 1.03"
  h2-h6: "h2: clamp(34px, 3.8vw, 56px) / -0.035em / 1.08; kicker: 12px mono / +0.09em"
spacing: "[4, 8, 12, 16, 24, 32, 48, 64, 96] — 4px base rhythm, generous vertical breathing room (95px–110px per story section)"
components:
  radius: "arch stage: 220px 220px 24px 24px; desktop 3D stage: 18px; phone 3D chassis: 32px; CTA pill: 12px"
  shadow: "3D extruded chassis rim: 0 1px 0 rgba(240,199,94,0.28) inset, 0 -2px 0 rgba(0,0,0,0.65) inset, 0 6px 0 #0b0f0d, 0 34px 80px -12px rgba(0,0,0,0.72), 0 0 55px -10px rgba(143,194,122,0.14)"
  estados: "3D perspective rest angle (rotateX / rotateY), interactive pointer-tracked 3D tilt (--tilt-x, --tilt-y) + dynamic specular glare (--glare-x, --glare-y), tactile 3D button press (translateY(-3px)translateZ(8px) hover -> translateY(2px) active), focus-visible 2px #f0c75e outline"
motion:
  dur-micro: "160ms"
  dur-layout: "320ms"
  dur-page: "520ms"
  ease-out: "cubic-bezier(0.16, 1, 0.3, 1)"
  ease-in: "cubic-bezier(0.4, 0, 1, 1)"
  ease-inout: "cubic-bezier(0.45, 0, 0.55, 1)"
voice:
  do:
    - "Focus, gently."
    - "Begin with one task."
    - "Take the calm along."
  dont:
    - "10x your productivity with AI superpowers!"
    - "Crush your grind!"
    - "Sign up now for limited-time enterprise synergy!"
anti-patterns:
  - "No purple-to-blue neon SaaS gradients or generic flat 12px cards"
  - "No heavy WebGL bundles that delay LCP — use hardware-accelerated CSS 3D transforms (perspective, preserve-3d, translateZ) + tactile 3D diorama artwork + lightweight pointer tilt"
  - "Never animate when prefers-reduced-motion: reduce is active"
```
