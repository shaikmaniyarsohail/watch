import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { CHAPTERS } from '../lib/chapters'
import { useActiveChapter } from '../lib/activeChapter'
import { scrollToId } from '../lib/scrollToId'

export default function Nav() {
  const active = useActiveChapter()
  const chapter = CHAPTERS.find((c) => c.id === active) ?? CHAPTERS[0]
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        bar.style.transform = `scaleX(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <>
      <header className="nav">
        <a className="nav__wordmark" href="#entrance" onClick={go('entrance')}>
          <span className="nav__omega">Ω</span>
          <span className="nav__wordmark-text">
            OMEGA
            <span className="nav__wordmark-sub label">PLANET OCEAN · A DIGITAL MUSEUM</span>
          </span>
        </a>
        <div className="nav__chapter" aria-live="polite">
          <span className="label nav__index">{chapter.index}</span>
          <span className="nav__name">{chapter.label}</span>
        </div>
        <div className="nav__progress" aria-hidden="true">
          <div className="nav__progress-fill" ref={barRef} />
        </div>
      </header>
      <nav className="rail" aria-label="Chapters">
        {CHAPTERS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`rail__dot${active === c.id ? ' is-active' : ''}`}
            onClick={() => scrollToId(c.id)}
            aria-label={`Go to ${c.label}`}
            aria-current={active === c.id ? 'true' : undefined}
          >
            <span className="rail__tip label" aria-hidden="true">
              {c.index} · {c.label}
            </span>
          </button>
        ))}
      </nav>
    </>
  )
}
