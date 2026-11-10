import { useEffect, useRef, type CSSProperties } from 'react'
import { ScrollTrigger } from '../../lib/gsap'
import { assetUrl, useAsset } from '../../lib/assets'
import Section from '../Section'
import { useReveal } from '../../lib/useReveal'
import { useReducedMotion } from '../../lib/useReducedMotion'

const FRAME_DIR = 'frames/exploded-view'

// Every supplied frame, in chronological order — the filename prefix (NNN) is
// the sequence position, the suffix (MMMM) is the original master frame number.
// The source was sampled at 2 fps, so adjacent frames are cross-faded on the
// canvas rather than duplicated or interpolated.
const FRAMES = [
  'frame_001_master_0109.jpg',
  'frame_002_master_0110.jpg',
  'frame_003_master_0111.jpg',
  'frame_004_master_0112.jpg',
  'frame_005_master_0113.jpg',
  'frame_006_master_0114.jpg',
  'frame_007_master_0115.jpg',
  'frame_008_master_0116.jpg',
  'frame_009_master_0117.jpg',
  'frame_010_master_0118.jpg',
  'frame_011_master_0119.jpg',
  'frame_012_master_0120.jpg',
  'frame_013_master_0121.jpg',
  'frame_014_master_0122.jpg',
  'frame_015_master_0123.jpg',
]
const FRAME_COUNT = FRAMES.length

// The five layers this footage actually resolves, in separation order.
const PARTS = ['CRYSTAL & BEZEL', 'DIAL & HANDS', 'MOVEMENT', 'CASE & CROWN', 'CASEBACK & BRACELET'] as const

// Label thresholds measured against the footage (p = frameIndex / 14):
//   f1 (p≈0.00) crystal & bezel already lifting · f3 (p≈0.14) dial & hands apart
//   f4 (p≈0.21) movement exposed as its own layer · f5 (p≈0.28) case & crown
//   distinct, clasp pieces spreading · labels stay lit — the supplied frames
//   end fully exploded, so nothing closes again.
const LABEL_ON = [0.02, 0.14, 0.21, 0.28, 0.35] as const
const EXPLODED_AT = 0.86 // p ≥ 0.86 → frames 13–15 hold the fully exploded watch

/**
 * Chapter 11 — the signature room. Fifteen stills (master frames 0109–0123,
 * sampled at 2 fps) scrubbed across 520vh on a canvas. Scroll is the only
 * driver: forward separates the watch, reverse brings it back — every frame
 * is reachable in both directions. Adjacent frames cross-fade so the 2 fps
 * source reads as one continuous separation. Preloading is staged
 * (first frames → final exploded frame → the middle in threes, via
 * requestIdleCallback) so nothing decodes all at once. HUD and labels are
 * written straight to the DOM — no React state per frame.
 */
export default function ExplodedView() {
  const asset = useAsset('exploded-view-frames')
  const reduced = useReducedMotion()
  const introRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const partsRef = useRef<Array<HTMLDivElement | null>>([])
  const phaseRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<HTMLSpanElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  useReveal(introRef)

  useEffect(() => {
    if (reduced) return
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ---- frame loading: staged, never all fifteen at once ----
    const images: Array<HTMLImageElement | null> = FRAMES.map(() => null)
    const pending = new Set<number>()
    let disposed = false
    let rafId = 0
    const idleIds: Array<number> = []
    const timerIds: Array<number> = []
    const idle = window.requestIdleCallback?.bind(window)
    const cancelIdle = window.cancelIdleCallback?.bind(window)

    const schedule = (fn: () => void) => {
      if (idle) {
        idleIds.push(idle(fn, { timeout: 400 }))
      } else {
        timerIds.push(window.setTimeout(fn, 16))
      }
    }

    const load = (idx: number) => {
      if (images[idx] || pending.has(idx) || disposed) return
      pending.add(idx)
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (disposed) return
        images[idx] = img
        requestDraw()
      }
      img.src = assetUrl(`${FRAME_DIR}/${FRAMES[idx]}`)
    }

    // 1) the frame in view and its neighbour, 2) the fully exploded end
    // state, 3) the middle frames in threes.
    const batches: Array<Array<number>> = [[0, 1], [FRAME_COUNT - 1]]
    for (let i = 2; i < FRAME_COUNT - 1; i += 3) {
      batches.push([i, i + 1, i + 2].filter((n) => n < FRAME_COUNT - 1))
    }

    let batchIdx = 0
    const runNextBatch = () => {
      if (disposed) return
      const batch = batches[batchIdx++]
      if (!batch) return
      batch.forEach(load)
      if (batchIdx < batches.length) schedule(runNextBatch)
    }
    runNextBatch()

    // ---- canvas rendering: contain-fit, cross-fade between adjacent frames ----
    let progress = 0
    let drawQueued = false

    const requestDraw = () => {
      if (drawQueued) return
      drawQueued = true
      rafId = requestAnimationFrame(render)
    }

    // Exact frame if decoded; otherwise the nearest decoded neighbour, so the
    // canvas never blanks while a frame is still streaming in.
    const pickNearest = (idx: number) => {
      for (let d = 0; d < FRAME_COUNT; d++) {
        if (idx - d >= 0 && images[idx - d]) return images[idx - d]
        if (idx + d < FRAME_COUNT && images[idx + d]) return images[idx + d]
      }
      return null
    }

    const render = () => {
      drawQueued = false
      const w = canvas.width
      const h = canvas.height
      if (!w || !h) return
      ctx.clearRect(0, 0, w, h)

      // Continuous position within the 15-frame sequence.
      const pos = progress * (FRAME_COUNT - 1)
      const i = Math.min(FRAME_COUNT - 1, Math.floor(pos))
      const t = pos - i

      const fit = (img: HTMLImageElement) => {
        // Contain-fit — letterboxed 16:9, never stretched.
        const s = Math.min(w / img.naturalWidth, h / img.naturalHeight)
        const dw = img.naturalWidth * s
        const dh = img.naturalHeight * s
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
      }

      let base = images[i] ?? pickNearest(i)
      if (base) {
        ctx.globalAlpha = 1
        fit(base)
      }
      // Cross-fade the next frame over the current one — a real blend between
      // the two adjacent stills, no duplication, no interpolation.
      const next = t > 0 ? images[i + 1] : null
      if (next && next !== base) {
        ctx.globalAlpha = t
        fit(next)
      }
      ctx.globalAlpha = 1
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      requestDraw()
    }
    resize()
    window.addEventListener('resize', resize)

    // ---- HUD + labels, written straight to the DOM ----
    const update = (p: number) => {
      progress = p
      requestDraw()

      partsRef.current.forEach((el, i) => {
        if (!el) return
        el.classList.toggle('is-on', p >= LABEL_ON[i])
      })

      const phase = p >= EXPLODED_AT ? 'EXPLODED' : 'SEPARATING'
      if (phaseRef.current && phaseRef.current.textContent !== phase) {
        phaseRef.current.textContent = phase
      }
      const n = Math.min(FRAME_COUNT, Math.max(1, Math.round(p * (FRAME_COUNT - 1)) + 1))
      const frames = `${String(n).padStart(2, '0')} / ${FRAME_COUNT}`
      if (frameRef.current && frameRef.current.textContent !== frames) {
        frameRef.current.textContent = frames
      }
      const pct = `${String(Math.round(p * 100)).padStart(3, '0')}%`
      if (pctRef.current && pctRef.current.textContent !== pct) {
        pctRef.current.textContent = pct
      }
    }

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => update(self.progress),
      onRefresh: (self) => update(self.progress),
    })

    return () => {
      disposed = true
      st.kill()
      cancelAnimationFrame(rafId)
      idleIds.forEach((id) => cancelIdle?.(id))
      timerIds.forEach((id) => window.clearTimeout(id))
      window.removeEventListener('resize', resize)
      partsRef.current.forEach((el) => el?.classList.remove('is-on'))
      if (phaseRef.current) phaseRef.current.textContent = 'SEPARATING'
      if (frameRef.current) frameRef.current.textContent = '01 / 15'
      if (pctRef.current) pctRef.current.textContent = '000%'
    }
  }, [reduced])

  const style = { '--scrub-h': '520vh' } as CSSProperties

  return (
    <Section id="exploded" className="explode">
      <div className="explode__intro" ref={introRef}>
        <p className="label eyebrow" data-reveal>
          06 EXPLODED VIEW
        </p>
        <h2 data-reveal>One Watch, Five Layers</h2>
        <p data-reveal>
          The film takes the Planet Ocean apart one layer at a time, and holds each
          layer in the air. Fifteen frames, sampled at two per second, carry the watch
          from first separation to its widest explosion — scroll to walk the sequence
          forward, scroll back to walk it in reverse.
        </p>
      </div>

      <div
        ref={stageRef}
        className={`explode__stage${reduced ? ' explode--static' : ''}`}
        style={style}
      >
        <div className="explode__pin">
          {reduced ? (
            <img
              className="explode__media"
              src={assetUrl(`${FRAME_DIR}/${FRAMES[FRAME_COUNT - 1]}`)}
              alt={asset.scene}
              loading="lazy"
            />
          ) : (
            <canvas
              ref={canvasRef}
              className="explode__canvas"
              role="img"
              aria-label={asset.scene}
            />
          )}
          <div className="explode__scrim" aria-hidden="true" />

          <aside className="explode__panel" aria-hidden="true">
            {PARTS.map((part, i) => (
              <div
                key={part}
                ref={(el) => {
                  partsRef.current[i] = el
                }}
                className="explode__part"
              >
                <span className="label explode__part-index">{String(i + 1).padStart(2, '0')}</span>
                <span className="explode__part-name">{part}</span>
              </div>
            ))}
          </aside>

          <div className="explode__readout" aria-hidden="true">
            <span className="label explode__phase" ref={phaseRef}>
              SEPARATING
            </span>
            <span className="label explode__frame" ref={frameRef}>
              01 / 15
            </span>
            <span className="label explode__pct" ref={pctRef}>
              000%
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}
