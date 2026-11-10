import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { ScrollTrigger } from '../lib/gsap'
import { assetUrl, useAsset } from '../lib/assets'
import { useReducedMotion } from '../lib/useReducedMotion'
import { useVideoSeek } from '../lib/useVideoSeek'

interface Props {
  assetId: string
  /** Scroll distance driving the scrub, e.g. '300vh'. */
  ratio?: string
  className?: string
  label?: string
  /** Overlay content rendered inside the sticky pin (quotes, captions). */
  children?: ReactNode
}

/**
 * Scroll-scrubbed video in a sticky viewport (per skill 29):
 * currentTime is driven by ScrollTrigger progress through an rAF-coalesced
 * seek queue; the file loads lazily when the wrapper approaches.
 */
export default function ScrubVideo({ assetId, ratio = '300vh', className, label, children }: Props) {
  const asset = useAsset(assetId)
  const reduced = useReducedMotion()
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const seek = useVideoSeek(videoRef)

  useEffect(() => {
    if (reduced) return
    const video = videoRef.current
    const wrap = wrapRef.current
    if (!video || !wrap) return
    video.pause()

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => seek(self.progress),
      onRefresh: (self) => seek(self.progress),
    })

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (video.readyState === 0) video.load()
            io.disconnect()
          }
        }
      },
      { rootMargin: '60% 0px' },
    )
    io.observe(wrap)

    return () => {
      st.kill()
      io.disconnect()
    }
  }, [reduced, seek])

  const style = { '--scrub-h': ratio } as CSSProperties

  if (reduced) {
    return (
      <div ref={wrapRef} className={`scrub scrub--static${className ? ` ${className}` : ''}`} style={style}>
        <div className="scrub__pin">
          <img className="scrub__media" src={assetUrl(asset.poster!)} alt={asset.scene} loading="lazy" />
          {label && <span className="scrub__tag label">{label}</span>}
          {children}
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className={`scrub${className ? ` ${className}` : ''}`} style={style}>
      <div className="scrub__pin">
        <video
          ref={videoRef}
          className="scrub__media"
          src={assetUrl(asset.file)}
          poster={asset.poster ? assetUrl(asset.poster) : undefined}
          preload="none"
          muted
          playsInline
          disablePictureInPicture
          aria-label={asset.scene}
        />
        {label && <span className="scrub__tag label">{label}</span>}
        {children}
      </div>
    </div>
  )
}
