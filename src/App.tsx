import { useEffect, useState } from 'react'
import { AssetContext, type Manifest } from './lib/assets'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { useReducedMotion } from './lib/useReducedMotion'
import Nav from './components/Nav'
import Entrance from './components/sections/Entrance'
import Museum from './components/sections/Museum'
import FirstEncounter from './components/sections/FirstEncounter'
import Collection from './components/sections/Collection'
import Anatomy from './components/sections/Anatomy'
import Engineering from './components/sections/Engineering'
import ExplodedView from './components/sections/ExplodedView'
import FinalReveal from './components/sections/FinalReveal'
import Footer from './components/Footer'

export default function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [failed, setFailed] = useState(false)
  const reduced = useReducedMotion()

  useSmoothScroll(!reduced)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}assets/manifest.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`manifest ${r.status}`)
        return r.json() as Promise<Manifest>
      })
      .then(setManifest)
      .catch(() => setFailed(true))
  }, [])

  useEffect(() => {
    if (!manifest) return
    // Pinned sections measure once media/fonts settle; refresh after mount.
    const t = window.setTimeout(() => window.dispatchEvent(new Event('load')), 100)
    return () => window.clearTimeout(t)
  }, [manifest])

  if (failed) {
    return (
      <div className="boot boot--error">
        <p className="label">THE MUSEUM IS CLOSED</p>
        <p className="boot__detail">The asset manifest could not be loaded. Try refreshing the page.</p>
      </div>
    )
  }

  if (!manifest) {
    return (
      <div className="boot">
        <p className="label boot__label">OPENING THE VAULT</p>
      </div>
    )
  }

  return (
    <AssetContext.Provider value={manifest}>
      <Nav />
      <main>
        <Entrance />
        <Museum />
        <FirstEncounter />
        <Collection />
        <Anatomy />
        <Engineering />
        <ExplodedView />
        <FinalReveal />
      </main>
      <Footer />
    </AssetContext.Provider>
  )
}
