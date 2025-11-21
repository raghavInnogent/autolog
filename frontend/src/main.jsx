import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'

async function init(){
  // start MSW mocks in dev when requested via VITE_USE_MOCKS
  if(import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true'){
    try{
      const mod = await import('./mocks/browser')
      if(mod && mod.startWorker){
        try{
          await mod.startWorker()
        }catch(e){
          console.warn('MSW worker failed to start', e)
        }
      }
    }catch(err){
      // dynamic import failed (msw may not be installed) — warn and continue
      console.warn('Failed to load MSW mocks, continuing without mocks', err)
    }
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

init()
