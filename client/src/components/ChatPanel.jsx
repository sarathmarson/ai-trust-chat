import { useChat } from '../hooks/useChat.js'
import MessageList from './MessageList.jsx'
import MessageInput from './MessageInput.jsx'

export default function ChatPanel({ activePersona }) {
  const { messages, isStreaming, sendMessage, clearMessages } = useChat()

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-title">
          💬 Trust Level 3 — User
          <span className="persona-badge">{activePersona}</span>
        </div>
        <button className="btn-clear" onClick={clearMessages}>Clear</button>
      </div>
      <MessageList messages={messages} />
      <MessageInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  )
}
