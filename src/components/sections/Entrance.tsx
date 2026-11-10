import { useRef } from 'react'
import AmbientVideo from '../AmbientVideo'
import { scrollToId } from '../../lib/scrollToId'
import { useReveal } from '../../lib/useReveal'

/** Chapter 00 — the threshold. Ambient museum hall fills the frame behind the title. */
export default function Entrance() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { stagger: 0.18 })

  return (
    <section id="entrance" className="hero" ref={ref}>
      <div className="hero__bg" aria-hidden="true">
        <AmbientVideo assetId="museum-hall" fill />
      </div>
      <div className="hero__scrim" aria-hidden="true" />
      <div className="hero__inner">
        <p className="label eyebrow" data-reveal>
          Ω · 00 ENTRANCE
        </p>
        <h1 className="hero__title" data-reveal>
          PLANET
          <br />
          OCEAN
        </h1>
        <p className="hero__sub" data-reveal>
          Thirteen chapters. One watch. A scroll-driven exhibition assembled entirely from
          user-supplied footage of the OMEGA&nbsp;Seamaster&nbsp;Planet&nbsp;Ocean.
        </p>
        <button type="button" className="hero__cta" data-reveal onClick={() => scrollToId('museum')}>
          ENTER THE FIRST ROOM
        </button>
      </div>
      <div className="hero__cue" aria-hidden="true">
        <span className="label">SCROLL</span>
        <span className="hero__cue-line" />
      </div>
    </section>
  )
}
