import { useState } from 'react'
import TrustBanner from './components/TrustBanner.jsx'
import OperatorPanel from './components/OperatorPanel.jsx'

export default function App() {
  const [activePersona, setActivePersona] = useState('Default Assistant')

  return (
    <div className="app">
      <TrustBanner />
      <div className="panels">
        <OperatorPanel onApply={setActivePersona} />
        <div style={{ padding: '20px', color: '#475569' }}>Chat panel coming soon…</div>
      </div>
    </div>
  )
}
