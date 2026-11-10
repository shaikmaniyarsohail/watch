export interface Chapter {
  id: string
  index: string
  label: string
}

/** Ordered chapters — mirrors the section ids rendered in App. */
export const CHAPTERS: Chapter[] = [
  { id: 'entrance', index: '00', label: 'Entrance' },
  { id: 'museum', index: '01', label: 'The Museum' },
  { id: 'encounter', index: '02', label: 'First Encounter' },
  { id: 'collection', index: '03', label: 'The Collection' },
  { id: 'dial', index: '04', label: '01 · The Dial' },
  { id: 'hands', index: '05', label: '02 · The Hands' },
  { id: 'movement', index: '06', label: '03 · The Movement' },
  { id: 'case', index: '07', label: '04 · The Case' },
  { id: 'crystal', index: '08', label: '05 · The Crystal' },
  { id: 'bracelet', index: '09', label: '06 · The Bracelet' },
  { id: 'engineering', index: '10', label: 'Engineering' },
  { id: 'exploded', index: '11', label: 'Exploded View' },
  { id: 'reveal', index: '12', label: 'Final Reveal' },
]
