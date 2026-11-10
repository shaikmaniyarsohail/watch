import { useRef } from 'react'
import AmbientVideo from '../AmbientVideo'
import Section from '../Section'
import { scrollToId } from '../../lib/scrollToId'
import { useReveal } from '../../lib/useReveal'

/**
 * Chapter 12 — the last room. The object assembled again, held in the light;
 * the exhibition closes where it opened, with a way back to the entrance.
 */
export default function FinalReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, { stagger: 0.16 })

  return (
    <Section id="reveal" className="reveal">
      <div className="reveal__bg" aria-hidden="true">
        <AmbientVideo assetId="final-hands" fill />
      </div>
      <div className="reveal__scrim" aria-hidden="true" />
      <div className="reveal__inner" ref={ref}>
        <p className="label eyebrow" data-reveal>
          07 FINAL REVEAL
        </p>
        <h2 className="reveal__title" data-reveal>
          Assembled
          <br />
          Again
        </h2>
        <p className="reveal__sub" data-reveal>
          The layers return to their places and the hands resume their sweep. The exhibition
          ends the way a museum visit ends: back in the light, the object whole, the story
          told only by what the lens saw.
        </p>
        <button
          type="button"
          className="reveal__cta"
          data-reveal
          onClick={() => scrollToId('entrance')}
        >
          RETURN TO THE ENTRANCE
        </button>
      </div>
      <div className="reveal__end" aria-hidden="true">
        <span className="label">Ω · END OF EXHIBITION</span>
      </div>
    </Section>
  )
}
