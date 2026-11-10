import { createRoot } from 'react-dom/client'
import App from './App'
import { registerGSAP } from './lib/gsap'
import './styles/tokens.css'
import './styles/global.css'

registerGSAP()

createRoot(document.getElementById('root')!).render(<App />)
