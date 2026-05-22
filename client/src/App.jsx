import { useState, useEffect } from 'react'
import TrustBanner from './components/TrustBanner.jsx'
import OperatorPanel from './components/OperatorPanel.jsx'
import ChatPanel from './components/ChatPanel.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

const VALID_THEMES = ['light', 'grey', 'dark']

function getInitialTheme() {
  const saved = localStorage.getItem('ai-trust-chat-theme')
  if (saved && VALID_THEMES.includes(saved)) return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [activePersona, setActivePersona] = useState('Default Assistant')
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    localStorage.setItem('ai-trust-chat-theme', theme)
  }, [theme])

  return (
    <div className="app" data-theme={theme}>
      <header className="app-header">
        <span className="app-header-title">AI Trust Level Chat</span>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </header>
      <TrustBanner />
      <div className="panels">
        <OperatorPanel onApply={setActivePersona} />
        <ChatPanel activePersona={activePersona} />
      </div>
    </div>
  )
}
