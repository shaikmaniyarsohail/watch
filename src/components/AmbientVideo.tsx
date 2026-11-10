import { useEffect, useRef } from 'react'
import { assetUrl, useAsset } from '../lib/assets'
import { useReducedMotion } from '../lib/useReducedMotion'

interface Props {
  assetId: string
  className?: string
  /** Fill the parent absolutely (hero backgrounds) instead of a framed block. */
  fill?: boolean
}

/**
 * Ambient video: muted, looping, plays only while near the viewport and
 * pauses off-screen. Lazy (preload="none" — nothing downloads until play).
 * Under reduced motion, the poster still is shown instead.
 */
export default function AmbientVideo({ assetId, className, fill }: Props) {
  const asset = useAsset(assetId)
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (reduced) return
    const video = videoRef.current
    if (!video) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void video.play().catch(() => {})
          else video.pause()
        }
      },
      { rootMargin: '20% 0px' },
    )
    io.observe(video)
    return () => {
      io.disconnect()
      video.pause()
    }
  }, [reduced])

  const cls = `ambient${fill ? ' ambient--fill' : ''}${className ? ` ${className}` : ''}`

  if (reduced) {
    return (
      <figure className={cls}>
        <img src={assetUrl(asset.poster!)} alt={asset.scene} loading="lazy" />
      </figure>
    )
  }

  return (
    <figure className={cls}>
      <video
        ref={videoRef}
        className="ambient__video"
        src={assetUrl(asset.file)}
        poster={asset.poster ? assetUrl(asset.poster) : undefined}
        preload="none"
        muted
        loop
        playsInline
        disablePictureInPicture
        aria-label={asset.scene}
      />
    </figure>
  )
}
