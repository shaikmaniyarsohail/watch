import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import Section from '../Section'
import ScrubVideo from '../ScrubVideo'
import { useReveal } from '../../lib/useReveal'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * Chapter 02 — the first close look. A pinned scrub of the dial macro; the
 * camera pushes in as you scroll and the printed promise on the dial surfaces.
 */
export default function FirstEncounter() {
  const introRef = useRef<HTMLDivElement>(null)
  const scrubRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useReveal(introRef)

  useLayoutEffect(() => {
    if (reduced) return
    const scope = scrubRef.current
    if (!scope) return

    const ctx = gsap.context(() => {
      // Dolly in across the whole pinned scrub.
      gsap.fromTo(
        '.scrub__media',
        { scale: 1 },
        {
          scale: 1.18,
          ease: 'none',
          scrollTrigger: {
            trigger: scope,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )

      // The quote surfaces mid-pin and lets go near the end.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      })
      tl.fromTo('.encounter__quote', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }).to(
        '.encounter__quote',
        { autoAlpha: 0, duration: 1 },
        '+=2',
      )
    }, scope)

    return () => ctx.revert()
  }, [reduced])

  return (
    <Section id="encounter" className="encounter">
      <div className="encounter__intro" ref={introRef}>
        <p className="label eyebrow" data-reveal>
          02 FIRST ENCOUNTER
        </p>
        <h2 data-reveal>
          A Dial the Colour
          <br />
          of Deep Water
        </h2>
        <p data-reveal>
          Every museum visit has a moment where the crowd thins and one object is suddenly
          alone with you. This is that moment. Scroll slowly — the footage moves at your pace.
        </p>
      </div>
      <div className="encounter__scrub" ref={scrubRef}>
        <ScrubVideo assetId="dial-macro" ratio="260vh" label="02 · FIRST ENCOUNTER">
          <blockquote className="encounter__quote">
            <p>
              “Co-Axial Master Chronometer” — printed in small type,
              <br />
              a promise written on the dial itself.
            </p>
          </blockquote>
        </ScrubVideo>
      </div>
    </Section>
  )
}
