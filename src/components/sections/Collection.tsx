import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../../lib/gsap'
import { assetUrl, useAsset } from '../../lib/assets'
import Section from '../Section'
import { useReveal } from '../../lib/useReveal'
import { useReducedMotion } from '../../lib/useReducedMotion'

const ITEMS: Array<{ id: string; caption: string }> = [
  { id: 'collection-01-display', caption: 'THE DISPLAY WALL — “Seamaster PLANET OCEAN”' },
  { id: 'collection-02-front', caption: 'THE FRONT — DEEP-BLUE DIAL' },
  { id: 'collection-03-profile', caption: 'THE PROFILE — CASE SIDE AND CROWN' },
  { id: 'collection-04-hands', caption: 'THE HANDS — GOLD ACROSS BLUE' },
  { id: 'collection-05-caseback', caption: 'THE CASEBACK — THE MOVEMENT, SEEN' },
  { id: 'collection-06-pedestal', caption: 'THE PEDESTAL — THE COMPLETE OBJECT' },
]

/**
 * Chapter 03 — a corridor of vitrines. The page pins and the gallery tracks
 * sideways, the way a visitor walks a wall of display cases.
 */
export default function Collection() {
  const introRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hudRef = useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()
  useReveal(introRef)

  useEffect(() => {
    if (reduced) return
    const stage = stageRef.current
    const track = trackRef.current
    if (!stage || !track) return

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => `+=${track.scrollWidth - stage.clientWidth}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const max = track.scrollWidth - stage.clientWidth
        track.style.transform = `translate3d(${-self.progress * max}px, 0, 0)`
        const n = ITEMS.length
        const idx = Math.min(n, Math.max(1, Math.round(self.progress * (n - 1)) + 1))
        if (hudRef.current) {
          hudRef.current.textContent = `${String(idx).padStart(2, '0')} / ${String(n).padStart(2, '0')}`
        }
      },
    })

    return () => {
      st.kill()
      track.style.transform = ''
    }
  }, [reduced])

  return (
    <Section
      id="collection"
      className={`collection${reduced ? ' collection--static' : ''}`}
    >
      <div className="collection__intro" ref={introRef}>
        <p className="label eyebrow" data-reveal>
          03 THE COLLECTION
        </p>
        <h2 data-reveal>One Object, Six Ways of Seeing</h2>
        <p data-reveal>
          A museum never shows a thing only once. Walk the wall: the same watch seen from the
          front, from the side, from behind, through glass, and finally whole.
        </p>
      </div>
      <div className="collection__stage" ref={stageRef}>
        <div className="collection__track" ref={trackRef}>
          {ITEMS.map((item, i) => (
            <CollectionFigure key={item.id} item={item} index={i + 1} />
          ))}
        </div>
        {!reduced && (
          <span className="label collection__hud" ref={hudRef} aria-hidden="true">
            01 / 06
          </span>
        )}
      </div>
    </Section>
  )
}

function CollectionFigure({ item, index }: { item: { id: string; caption: string }; index: number }) {
  const asset = useAsset(item.id)
  return (
    <figure className="collection__item">
      <img
        src={assetUrl(asset.file)}
        alt={asset.scene}
        loading="lazy"
        width={asset.width ?? undefined}
        height={asset.height ?? undefined}
      />
      <figcaption className="label">
        {String(index).padStart(2, '0')} · {item.caption}
      </figcaption>
    </figure>
  )
}
