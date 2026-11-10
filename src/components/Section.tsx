import { useLayoutEffect, type ReactNode } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { setActiveChapter } from '../lib/activeChapter'

interface Props {
  id: string
  className?: string
  children: ReactNode
}

/**
 * Base section: registers the id as a scroll anchor and reports the active
 * chapter as it crosses the middle band of the viewport.
 */
export default function Section({ id, className, children }: Props) {
  useLayoutEffect(() => {
    const st = ScrollTrigger.create({
      trigger: `#${id}`,
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: (self) => {
        if (self.isActive) setActiveChapter(id)
      },
    })
    return () => st.kill()
  }, [id])

  return (
    <section id={id} className={className}>
      {children}
    </section>
  )
}
