# OMEGA Seamaster Planet Ocean · A Digital Museum

An unofficial, cinematic digital museum for the OMEGA Seamaster Planet Ocean,
built **entirely from user-supplied footage** — no stock imagery, no stock
video, no 3D renders. Every frame you see descends from one 74.7-second
master film.

---

## Honesty first

- **The footage is AI-generated** (Veo-origin, watermark removed by the
  owner before delivery). The footer on the site discloses this.
- **No invented specifications.** No calibre number, case material, or
  water-resistance rating appears anywhere — unless it is *printed on the
  dial in the footage* and quoted exactly as printed (e.g.
  "Co-Axial Master Chronometer"). For verified specs, the footer links to
  OMEGA's official catalog.
- **Frame-rate honesty.** UI and scroll interactions run at 60 fps; the
  source film is 24 fps. Scrubbed videos interpolate between 24 fps frames —
  that cadence belongs to the film, and the site preserves it.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # serve the production build
```

Requires Node 20+ and ffmpeg/ffprobe on PATH only if you re-generate assets.

## The thirteen chapters

Scrolling walks you through one continuous exhibition:

| # | Chapter | Section | What happens |
|---|---|---|---|
| 00 | Entrance | `Entrance` | Full-bleed museum hall ambient loop, hero title "Thirteen chapters. One watch." |
| 01 | The Museum | `Museum` | Walkway footage with parallax reveals |
| 02 | First Encounter | `FirstEncounter` | Dial macro; scroll window reveals the printed dial quote |
| 03 | The Collection | `Collection` | Horizontally pinned vitrine track (6 images), HUD `01 / 06` … `06 / 06` |
| 04–09 | Anatomy · Dial / Hands / Movement / Case / Crystal / Bracelet | `Anatomy` | Six vitrines; headings byte-exact `01 · THE DIAL` … `06 · THE BRACELET`; crystal chapter gets a two-figure scroll parallax |
| — | The Engineering Room | `Engineering` | Case + component-stack stills with scroll reveals |
| — | The Exploded View | `ExplodedView` | 520vh scrub stage: canvas scrubs **all 15 supplied stills** (`frames/exploded-view/`, master frames 0109–0123, sampled at 2 fps) with cross-faded stepping; SEPARATING → EXPLODED phases, five layer labels, `NN / 15` + `000%` → `100%` readout |
| 07 | Final Reveal | `FinalReveal` | Closing hands macro, closing copy, "RETURN TO THE ENTRANCE" |

## Animation inventory

- **Lenis** smooth scrolling, integrated with GSAP ScrollTrigger.
- **Scroll-driven video scrubbing** — `ScrubVideo` maps scroll progress onto
  `video.currentTime` (museum, encounter, anatomy chapters).
- **Scroll-driven frame-sequence scrubbing** — the Exploded View scrubs all 15
  supplied stills on a canvas: adjacent frames cross-fade (no duplication or
  interpolation of the 2 fps source), preloading is staged via
  `requestIdleCallback`, and scroll drives the sequence in both directions.
- **CSS-sticky pinning** for scrub stages (no GSAP pin; pure `position: sticky`).
- **True GSAP pin** only on the horizontal Collection track (`pin:true`,
  `translate3d`, compositor-only updates, HUD via `textContent`).
- **Reveal system** (`useReveal`) — `gsap.from`/`fromTo` fade-rise on copy.
- **Ambient loops** (`AmbientVideo`) — lazy, play-on-visible, poster fallback.
- **Nav progress bar** — `scaleX` transform driven by ScrollTrigger.
- **Reduced motion** — every animation disabled; videos become posters;
  sections fall back to static vertical layouts. Content is 100% reachable.

## Dependencies

Runtime: `react` 19, `react-dom` 19, `gsap` 3.13 (ScrollTrigger),
`lenis` 1.3.
Build: `vite` 7, `typescript` 5.8, `@vitejs/plugin-react` 5.

No UI framework, no CSS libraries — all styles are hand-written
(`src/styles/tokens.css` + `src/styles/global.css`).

## Assets & pipeline

- `public/assets/manifest.json` — machine-readable manifest (19 assets,
  54.4 MB) with real ffprobe metadata (format, dimensions, fps, duration,
  bitrate, size). Regenerate with `node scripts/gen-manifest.mjs`.
- `public/assets/videos/` — 9 H.264 segments re-encoded from the master
  (CRF 21, keyframe every 0.5 s for scrub responsiveness, faststart,
  24 fps, no audio): `museum-hall`, `museum-walk`, `dial-macro`,
  `case-crown`, `hands-gold`, `movement`, `bracelet-clasp`,
  `explode-cycle` (478 frames / 19.9 s), `final-hands`.
- `public/assets/posters/` — 9 WebP posters.
- `public/assets/images/` — 10 WebP stills (collection ×6, engineering ×2,
  crystal ×2) converted from supplied keyframes.
- `videos/OMEGA_Museum_Master_No_Veo_Watermark.mp4` — the untouched master
  source. **Do not modify or delete.**
- `scripts/audit-wiring.mjs` — static audit: asset ids, section ids,
  scroll targets, CSS class coverage (`node scripts/audit-wiring.mjs`).

## Project map

```
src/
  components/            Nav, Section, AmbientVideo, ScrubVideo, Footer
  components/sections/   the 8 wings
  lib/                   gsap registration, chapters registry, smooth scroll,
                         video-seek, reveal, reduced-motion, asset manifest
  styles/                tokens.css (design tokens) · global.css (all styles)
design-system/MASTER.md  full design-system documentation
public/assets/           media + manifest.json
videos/                  original master footage (preserve)
```

## Design system

`design-system/MASTER.md` documents the palette (void→ember), fluid type
scale, spacing, motion architecture, layering, component contracts and the
copy voice. The one-line rulebook:

> Dark museum walls, one warm accent, serif headlines, mono labels,
> CSS-sticky pins, DOM-written scroll values, and only what the lens can see.

## Known limitations

- **24 fps source.** Scrubs and loops show 24 fps cadence; the interface
  itself is 60 fps. No frame interpolation was applied to keep footage honest.
- **AI-generated footage.** Depictions of the watch are synthetic; fine
  details (printing, finishing) may not match the real product. The site
  never claims otherwise.
- **No audio.** The master is video-only, so the site is silent by design.
- **Exploded view is stills, not 3D.** The scrub controls a canvas sequence of
  the 15 supplied frames (master frames 0109–0123, sampled at 2 fps from the
  master footage); adjacent frames cross-fade rather than interpolate, so the
  stepping stays honest to the source. Label thresholds are measured from the
  footage itself: crystal & bezel lifting from frame 1, dial & hands apart by
  frame 3, movement exposed by frame 4, case & crown and caseback & bracelet
  distinct by frame 5; frames 13–15 hold the fully exploded watch.
- **Single-language**, single-page experience; no routing.
- **Reduced-motion / small screens** get static fallbacks rather than
  equivalent motion — a deliberate accessibility trade-off.
- Unofficial fan project; all trademarks belong to their owner.
