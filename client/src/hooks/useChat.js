import { useState, useCallback } from 'react'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return

    const history = messages.map(({ role, content }) => ({ role, content }))
    const assistantPlaceholder = { role: 'assistant', content: '', streaming: true }

    setMessages(prev => [
      ...prev,
      { role: 'user', content: text },
      assistantPlaceholder
    ])
    setIsStreaming(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const lines = decoder.decode(value, { stream: true }).split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const token = line.slice(6)

          if (token === '[DONE]') break

          if (token.startsWith('[ERROR]')) {
            setMessages(prev => {
              const next = [...prev]
              next[next.length - 1] = { role: 'error', content: token.slice(8), streaming: false }
              return next
            })
            break
          }

          setMessages(prev => {
            const next = [...prev]
            next[next.length - 1] = {
              ...next[next.length - 1],
              content: next[next.length - 1].content + token
            }
            return next
          })
        }
      }
    } catch (err) {
      setMessages(prev => {
        const next = [...prev]
        next[next.length - 1] = { role: 'error', content: err.message, streaming: false }
        return next
      })
    } finally {
      setMessages(prev => {
        const next = [...prev]
        if (next[next.length - 1]?.streaming) {
          next[next.length - 1] = { ...next[next.length - 1], streaming: false }
        }
        return next
      })
      setIsStreaming(false)
    }
  }, [messages, isStreaming])

  const clearMessages = useCallback(() => setMessages([]), [])

  return { messages, isStreaming, sendMessage, clearMessages }
}
