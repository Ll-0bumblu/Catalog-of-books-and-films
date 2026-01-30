import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './client/App.jsx'
import Catalog from './client/pages/Catalog/Catalog.jsx'

createRoot(document.getElementById('main')).render(

  <StrictMode>
    <Catalog />
  </StrictMode>
)
