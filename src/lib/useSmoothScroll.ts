import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { registerLenis } from './scrollToId'

/**
 * Smooth scrolling via Lenis, driven by the GSAP ticker so ScrollTrigger and
 * Lenis share one clock (per skill 24). Disabled entirely under reduced motion.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    registerLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const settle = window.setTimeout(refresh, 400)

    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(settle)
      gsap.ticker.remove(tick)
      registerLenis(null)
      lenis.destroy()
      ScrollTrigger.refresh()
    }
  }, [enabled])
}
