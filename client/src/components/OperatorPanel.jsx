import { useState } from 'react'
import { buildPreviewPrompt } from '../utils/promptPreview.js'

const DEFAULT_CONFIG = {
  persona: '',
  language: 'any',
  blockedTopics: '',
  tone: 'professional'
}

export default function OperatorPanel({ onApply }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [applied, setApplied] = useState(false)

  function update(field, value) {
    setConfig(prev => ({ ...prev, [field]: value }))
    setApplied(false)
  }

  async function handleApply() {
    await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    setApplied(true)
    onApply(config.persona.trim() || 'Default Assistant')
  }

  return (
    <div className="operator-panel">
      <div className="panel-title">⚙ Trust Level 2 — Operator</div>

      <div className="field-group">
        <label className="field-label">Persona name</label>
        <input
          className="field-input"
          placeholder="e.g. German Tutor, Legal Assistant"
          value={config.persona}
          onChange={e => update('persona', e.target.value)}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Language</label>
        <select className="field-select" value={config.language} onChange={e => update('language', e.target.value)}>
          <option value="any">Any language</option>
          <option value="en">English only</option>
          <option value="de">German only</option>
          <option value="fr">French only</option>
        </select>
      </div>

      <div className="field-group">
        <label className="field-label">Blocked topics (comma-separated)</label>
        <input
          className="field-input"
          placeholder="e.g. politics, religion, competitors"
          value={config.blockedTopics}
          onChange={e => update('blockedTopics', e.target.value)}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Tone</label>
        <select className="field-select" value={config.tone} onChange={e => update('tone', e.target.value)}>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="concise">Concise</option>
        </select>
      </div>

      <div>
        <div className="prompt-preview-label">Generated system prompt (live preview)</div>
        <textarea
          className="prompt-preview"
          readOnly
          value={buildPreviewPrompt(config)}
        />
      </div>

      <button className="btn-apply" onClick={handleApply}>
        Apply Config ↓
      </button>
      {applied && <div className="applied-badge">✓ Config applied — chat reset</div>}
    </div>
  )
}
