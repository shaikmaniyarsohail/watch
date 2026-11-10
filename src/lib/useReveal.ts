import { useEffect, type RefObject } from 'react'
import { gsap } from './gsap'
import { useReducedMotion } from './useReducedMotion'

interface Options {
  start?: string
  stagger?: number
}

/**
 * Reveals every [data-reveal] descendant with a fade/rise when the scope
 * enters the viewport. gsap.from keeps elements visible without JS
 * (progressive enhancement) and reverts cleanly on unmount.
 */
export function useReveal(
  scopeRef: RefObject<HTMLElement | null>,
  opts: Options = {},
) {
  const reduced = useReducedMotion()
  const { start = 'top 78%', stagger = 0.12 } = opts

  useEffect(() => {
    if (reduced) return
    const scope = scopeRef.current
    if (!scope) return
    const els = scope.querySelectorAll('[data-reveal]')
    if (!els.length) return

    const ctx = gsap.context(() => {
      gsap.from(els, {
        autoAlpha: 0,
        y: 26,
        duration: 1.1,
        ease: 'power3.out',
        stagger,
        scrollTrigger: { trigger: scope, start, once: true },
      })
    }, scope)
    return () => ctx.revert()
  }, [reduced, scopeRef, start, stagger])
}
