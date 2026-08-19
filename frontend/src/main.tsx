import React from 'react'
import ReactDOM from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { ContextMessageProvider, ToastStackProvider } from 'lcano-react-ui'
import App from './App'
import { jornadaTheme, jornadaLightTheme } from './theme'
import { ThemeControlProvider } from './contexts/ThemeControlContext'
import './i18n'
import './index.css'

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.white};
    font-family: 'Inter', system-ui, sans-serif;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: ${p => p.theme.colors.tertiary} ${p => p.theme.colors.primary};
  }

  *::-webkit-scrollbar {
    width: 6px;
  }

  *::-webkit-scrollbar-track {
    background: ${p => p.theme.colors.primary};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${p => p.theme.colors.tertiary};
    border-radius: 3px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeControlProvider darkTheme={jornadaTheme} lightTheme={jornadaLightTheme}>
      <GlobalStyle />
      <ContextMessageProvider>
        <ToastStackProvider>
          <App />
        </ToastStackProvider>
      </ContextMessageProvider>
    </ThemeControlProvider>
  </React.StrictMode>
)
