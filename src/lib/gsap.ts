import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function registerGSAP() {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger)
  // Keep native scrolling semantics; Lenis (when enabled) drives ScrollTrigger.update.
  gsap.ticker.lagSmoothing(0)
  registered = true
}

export { gsap, ScrollTrigger }
