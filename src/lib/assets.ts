import { createContext, useContext } from 'react'

export interface AssetEntry {
  id: string
  file: string
  kind: 'video' | 'image'
  format: string | null
  width: number | null
  height: number | null
  fps: number | null
  durationSec: number | null
  bitrateKbps: number | null
  bytes: number
  scene: string
  section: string
  poster: string | null
}

export interface Manifest {
  generatedAt: string
  source: string
  note: string
  sourceFps: number
  assets: AssetEntry[]
}

export const AssetContext = createContext<Manifest | null>(null)

const BASE = import.meta.env.BASE_URL

export function assetUrl(rel: string): string {
  return `${BASE}assets/${rel}`
}

export function useAssets(): Manifest {
  const m = useContext(AssetContext)
  if (!m) throw new Error('Asset manifest not loaded')
  return m
}

export function useAsset(id: string): AssetEntry {
  const m = useAssets()
  const a = m.assets.find((x) => x.id === id)
  if (!a) throw new Error(`Unknown asset id: ${id}`)
  return a
}
