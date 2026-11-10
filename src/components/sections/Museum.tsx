import { useRef } from 'react'
import Section from '../Section'
import AmbientVideo from '../AmbientVideo'
import { useReveal } from '../../lib/useReveal'

/** Chapter 01 — the hall itself: blue stone, glass, light. */
export default function Museum() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)

  return (
    <Section id="museum" className="museum">
      <div className="museum__inner" ref={ref}>
        <p className="label eyebrow" data-reveal>
          01 MUSEUM
        </p>
        <div className="museum__grid">
          <div className="museum__copy">
            <h2 data-reveal>
              The Hall of
              <br />
              Blue Stone
            </h2>
            <p data-reveal>
              Before there is an object, there is a room. The walls carry the colour of the sea
              at depth; the vitrines hold their light like still water. Everything here is
              arranged to slow you down before you arrive at a single watch.
            </p>
            <p data-reveal>
              This museum is no different. Walk at the pace of the scrollbar. There is nowhere
              to be except where you are.
            </p>
          </div>
          <figure className="museum__media" data-reveal>
            <AmbientVideo assetId="museum-walk" />
            <figcaption className="label">
              ROOM 01 · THE WALKWAY — VISITORS BENEATH THE SIGN
            </figcaption>
          </figure>
        </div>
      </div>
    </Section>
  )
}
