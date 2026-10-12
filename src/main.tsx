import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {ThemeProvider} from "./ThemeContext.tsx";
import './index.css'
import App from './App.tsx'
import "@fortawesome/fontawesome-free/css/all.min.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
    <App />
    </ThemeProvider>
  </StrictMode>,
)