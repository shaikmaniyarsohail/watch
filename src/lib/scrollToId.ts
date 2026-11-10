import Lenis from 'lenis'

let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
  lenis = instance
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 3) })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
