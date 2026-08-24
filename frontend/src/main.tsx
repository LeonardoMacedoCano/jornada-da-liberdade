import React from 'react'
import ReactDOM from 'react-dom/client'
import { createGlobalStyle } from 'styled-components'
import { ContextMessageProvider, ToastStackProvider } from 'lcano-react-ui'
import App from './App'
import { ThemeControlProvider } from './contexts/ThemeControlContext'
import './i18n'
import './index.css'

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
  }

  body {
    background-color: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.white};
    font-family: 'Inter', system-ui, sans-serif;
  }

  button {
    border: 0;
    outline: 0;
    cursor: pointer;
    background: none;
    color: inherit;
    font-family: inherit;
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
    <ThemeControlProvider>
      <GlobalStyle />
      <ContextMessageProvider>
        <ToastStackProvider>
          <App />
        </ToastStackProvider>
      </ContextMessageProvider>
    </ThemeControlProvider>
  </React.StrictMode>
)
