import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../../lib/gsap'
import { assetUrl, useAsset } from '../../lib/assets'
import Section from '../Section'
import ScrubVideo from '../ScrubVideo'
import { useReveal } from '../../lib/useReveal'
import { useReducedMotion } from '../../lib/useReducedMotion'

/**
 * Chapters 04–09 — the anatomy wing. Six vitrines, one per component visible
 * in the footage. Headings are exact: “01 · THE DIAL” … “06 · THE BRACELET”.
 * Copy describes only what the footage shows.
 */
export default function Anatomy() {
  const introRef = useRef<HTMLDivElement>(null)
  useReveal(introRef)

  return (
    <>
      <section className="anatomy-intro">
        <div className="anatomy-intro__inner" ref={introRef}>
          <p className="label eyebrow" data-reveal>
            04 ANATOMY
          </p>
          <h2 data-reveal>Six Vitrines</h2>
          <p data-reveal>
            A watch is a small museum of parts. The film takes the Planet Ocean apart and puts
            it back together; between those two acts, the museum pauses at each layer. What
            follows describes only what the footage shows — nothing more is claimed.
          </p>
        </div>
      </section>

      <Chapter id="dial" eyebrow="CHAPTER 04 · VITRINE 01" heading="01 · THE DIAL">
        <ScrubVideo assetId="dial-macro" ratio="300vh" label="01 · THE DIAL" />
      </Chapter>
      <Chapter id="hands" eyebrow="CHAPTER 05 · VITRINE 02" heading="02 · THE HANDS">
        <ScrubVideo assetId="hands-gold" ratio="280vh" label="02 · THE HANDS" />
      </Chapter>
      <Chapter id="movement" eyebrow="CHAPTER 06 · VITRINE 03" heading="03 · THE MOVEMENT">
        <ScrubVideo assetId="movement" ratio="220vh" label="03 · THE MOVEMENT" />
      </Chapter>
      <Chapter id="case" eyebrow="CHAPTER 07 · VITRINE 04" heading="04 · THE CASE">
        <ScrubVideo assetId="case-crown" ratio="280vh" label="04 · THE CASE" />
      </Chapter>
      <CrystalChapter />
      <Chapter id="bracelet" eyebrow="CHAPTER 09 · VITRINE 06" heading="06 · THE BRACELET">
        <ScrubVideo assetId="bracelet-clasp" ratio="240vh" label="06 · THE BRACELET" />
      </Chapter>
    </>
  )
}

/* ------------------------------------------------------------------ */

function Chapter({
  id,
  eyebrow,
  heading,
  children,
}: {
  id: string
  eyebrow: string
  heading: string
  children: ReactNode
}) {
  const headRef = useRef<HTMLDivElement>(null)
  useReveal(headRef)

  return (
    <Section id={id} className="chapter">
      <div className="chapter__head" ref={headRef}>
        <p className="label chapter__eyebrow" data-reveal>
          {eyebrow}
        </p>
        <h2 data-reveal>{heading}</h2>
        <ChapterCopy id={id} />
      </div>
      {children}
    </Section>
  )
}

/** Vitrine 05 — no dedicated footage: two stills of the crystal lifting away,
 *  drifting at slightly different speeds (parallax). */
function CrystalChapter() {
  const headRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useReveal(headRef)

  useLayoutEffect(() => {
    if (reduced) return
    const scope = stackRef.current
    if (!scope) return
    const ctx = gsap.context(() => {
      gsap.to('.crystal__fig--one', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to('.crystal__fig--two', {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, scope)
    return () => ctx.revert()
  }, [reduced])

  return (
    <Section id="crystal" className="chapter">
      <div className="chapter__head" ref={headRef}>
        <p className="label chapter__eyebrow" data-reveal>
          CHAPTER 08 · VITRINE 05
        </p>
        <h2 data-reveal>05 · THE CRYSTAL</h2>
        <ChapterCopy id="crystal" />
      </div>
      <div className="crystal__stack" ref={stackRef}>
        <CrystalFigure assetId="crystal-01" modifier="one" />
        <CrystalFigure assetId="crystal-02" modifier="two" />
      </div>
    </Section>
  )
}

function CrystalFigure({ assetId, modifier }: { assetId: string; modifier: 'one' | 'two' }) {
  const asset = useAsset(assetId)
  return (
    <figure className={`crystal__fig crystal__fig--${modifier}`}>
      <img
        src={assetUrl(asset.file)}
        alt={asset.scene}
        loading="lazy"
        width={asset.width ?? undefined}
        height={asset.height ?? undefined}
      />
      <figcaption className="label">
        {modifier === 'one' ? 'THE CRYSTAL LIFTS AWAY FROM THE BODY' : 'CRYSTAL AND BEZEL, SEPARATED FROM THE DIAL BELOW'}
      </figcaption>
    </figure>
  )
}

/* ------------------------------------------------------------------ */

const COPY: Record<string, ReactNode> = {
  dial: (
    <>
      <p>
        Deep blue, nearly black at the edges. Printed in small type along the lower half: the
        words on the dial are the only specification this museum will quote — and they are
        quoted exactly as printed.
      </p>
      <p>Hour markers and light. The dial does the work of an ocean: it holds colour at depth.</p>
    </>
  ),
  hands: (
    <>
      <p>
        Gold-toned, shaped to be read at a glance, doing what hands have always done — turning
        the abstract idea of time into a position you can see.
      </p>
      <p>Watch them sweep across the dial; the footage keeps their pace, not yours.</p>
    </>
  ),
  movement: (
    <>
      <p>
        The caseback opens onto metalwork behind a transparent window: finished surfaces,
        arranged in layers, turning. No calibre number is claimed here — this room quotes only
        what a lens can see.
      </p>
      <p>For verified specifications, the official catalog link waits at the foot of the page.</p>
    </>
  ),
  case: (
    <>
      <p>
        Seen from the side, the case is architecture: a curved wall of metal rising to meet the
        crystal, and a crown waiting at three o’clock like a door handle on a strong room.
      </p>
      <p>The footage follows the profile from lug to crown. Nothing more is stated.</p>
    </>
  ),
  crystal: (
    <>
      <p>
        The first layer to lift in the exploded view is the one you look through. A transparent
        crystal rises off the dial and holds there — the room’s only window between you and the
        object.
      </p>
    </>
  ),
  bracelet: (
    <>
      <p>
        The last layer is the one you wear. Links run outward from the case to a clasp signed
        with the same name as the dial — the object’s only signature, worn against the wrist.
      </p>
    </>
  ),
}

function ChapterCopy({ id }: { id: keyof typeof COPY | string }) {
  return (
    <div className="chapter__copy" data-reveal>
      {COPY[id] ?? null}
    </div>
  )
}
