import { useEffect, useState } from 'react'

type Listener = (id: string) => void

let current = 'entrance'
const listeners = new Set<Listener>()

export function setActiveChapter(id: string) {
  if (!id || id === current) return
  current = id
  listeners.forEach((l) => l(id))
}

export function useActiveChapter(): string {
  const [id, setId] = useState(current)
  useEffect(() => {
    const l: Listener = (v) => setId(v)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return id
}
