import { useCallback, useEffect, useRef, type RefObject } from 'react'

const FRAME = 1 / 24 // source footage frame length
const TOLERANCE = FRAME / 2

/**
 * rAF-coalesced seeking for scroll-scrubbed video (per skill 29):
 * never writes currentTime more than once per frame, waits for in-flight
 * seeks, and snaps to frame boundaries. No React state per frame.
 */
export function useVideoSeek(videoRef: RefObject<HTMLVideoElement | null>) {
  const state = useRef({ raf: 0, seeking: false, target: 0 })

  const flush = useCallback(() => {
    const s = state.current
    s.raf = 0
    const video = videoRef.current
    if (!video || video.readyState < 2 || s.seeking) return
    const dur = video.duration
    if (!isFinite(dur) || dur <= 0) return
    const t = Math.min(Math.max(s.target, 0), dur - FRAME)
    if (Math.abs(video.currentTime - t) < TOLERANCE) return
    s.seeking = true
    video.currentTime = t
  }, [videoRef])

  const schedule = useCallback(
    (progress: number) => {
      const s = state.current
      s.target = progress
      if (!s.raf) s.raf = requestAnimationFrame(flush)
    },
    [flush],
  )

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const s = state.current
    const onSeeked = () => {
      s.seeking = false
      if (!s.raf && Math.abs(video.currentTime - s.target) > TOLERANCE) {
        s.raf = requestAnimationFrame(flush)
      }
    }
    video.addEventListener('seeked', onSeeked)
    return () => {
      video.removeEventListener('seeked', onSeeked)
      if (s.raf) cancelAnimationFrame(s.raf)
      s.raf = 0
      video.pause()
    }
  }, [videoRef, flush])

  return schedule
}
