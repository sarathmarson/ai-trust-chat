import { useEffect, useRef } from 'react'

export default function MessageList({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="message-list">
        <div className="empty-state">
          <div className="icon">💬</div>
          <div>Configure the operator panel on the left, then start chatting</div>
        </div>
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.role}`}>
          <div className={`message-bubble${msg.streaming ? ' streaming-cursor' : ''}`}>
            {msg.content || (msg.streaming ? '' : '…')}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
