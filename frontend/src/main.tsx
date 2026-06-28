import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { ContextMessageProvider } from 'lcano-react-ui'
import App from './App'
import { jornadaTheme } from './theme'
import './index.css'

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${p => p.theme.colors.primary};
    color: ${p => p.theme.colors.white};
    font-family: 'Inter', system-ui, sans-serif;
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
    <ThemeProvider theme={jornadaTheme}>
      <GlobalStyle />
      <ContextMessageProvider>
        <App />
      </ContextMessageProvider>
    </ThemeProvider>
  </React.StrictMode>
)
