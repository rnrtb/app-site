import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/zen-maru-gothic/400.css'
import '@fontsource/zen-maru-gothic/500.css'
import '@fontsource/zen-maru-gothic/700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
