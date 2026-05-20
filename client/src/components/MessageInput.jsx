import { useState } from 'react'

export default function MessageInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div className="message-input-row">
      <textarea
        className="message-input"
        placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
      />
      <button
        className="btn-send"
        onClick={submit}
        disabled={!text.trim() || disabled}
      >
        Send →
      </button>
    </div>
  )
}
