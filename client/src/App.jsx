import { useState } from 'react'
import TrustBanner from './components/TrustBanner.jsx'
import OperatorPanel from './components/OperatorPanel.jsx'
import ChatPanel from './components/ChatPanel.jsx'

export default function App() {
  const [activePersona, setActivePersona] = useState('Default Assistant')

  return (
    <div className="app">
      <TrustBanner />
      <div className="panels">
        <OperatorPanel onApply={setActivePersona} />
        <ChatPanel activePersona={activePersona} />
      </div>
    </div>
  )
}
