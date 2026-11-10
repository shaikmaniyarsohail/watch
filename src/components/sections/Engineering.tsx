import { useRef } from 'react'
import { assetUrl, useAsset, type AssetEntry } from '../../lib/assets'
import Section from '../Section'
import { useReveal } from '../../lib/useReveal'

/** Chapter 10 — construction notes, told from two stills of the film. */
export default function Engineering() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)

  return (
    <Section id="engineering" className="engineering">
      <div className="engineering__inner" ref={ref}>
        <p className="label eyebrow" data-reveal>
          05 ENGINEERING
        </p>
        <h2 data-reveal>Built to Be Taken Apart</h2>
        <p data-reveal>
          The film’s central act is a disassembly. Before the explosion of layers, the museum
          pauses on the details that make the separation possible: the case that holds the
          movement, and the stack of components that emerges when the case lets go.
        </p>

        <div className="engineering__grid">
          <figure className="engineering__fig" data-reveal>
            <EngineeringImage assetId="engineering-case" />
            <figcaption className="label">EXHIBIT A — CASE CONSTRUCTION, SIDE PROFILE</figcaption>
          </figure>
          <div className="engineering__note" data-reveal>
            <p>
              A side profile tells you how a watch was assembled. Walls, edges, a crown set
              into the case — each one a joint between what you see and what keeps time behind
              it.
            </p>
          </div>
          <figure className="engineering__fig" data-reveal>
            <EngineeringImage assetId="engineering-stack" />
            <figcaption className="label">EXHIBIT B — VERTICAL COMPONENT STACK, MID-EXPLOSION</figcaption>
          </figure>
          <div className="engineering__note" data-reveal>
            <p>
              Mid-explosion, the object becomes a diagram of itself: layers separated along a
              single vertical line, each one visible, none of them hidden. The next room holds
              this diagram and lets you control it.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function EngineeringImage({ assetId }: { assetId: string }) {
  const asset: AssetEntry = useAsset(assetId)
  return (
    <img
      src={assetUrl(asset.file)}
      alt={asset.scene}
      loading="lazy"
      width={asset.width ?? undefined}
      height={asset.height ?? undefined}
    />
  )
}
