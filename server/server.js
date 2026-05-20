import 'dotenv/config'
import express from 'express'
import OpenAI from 'openai'
import { buildSystemPrompt } from './promptBuilder.js'

const app = express()
app.use(express.json())

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
})

let operatorConfig = {
  persona: '',
  language: 'any',
  blockedTopics: '',
  tone: 'professional'
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/config', (req, res) => {
  const { persona, language, blockedTopics, tone } = req.body
  operatorConfig = {
    persona: persona || '',
    language: language || 'any',
    blockedTopics: blockedTopics || '',
    tone: tone || 'professional'
  }
  res.json({ ok: true })
})

app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body
  if (!message?.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const systemPrompt = buildSystemPrompt(operatorConfig)
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ]

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      stream: true,
      max_tokens: 1024
    })

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content || ''
      if (token) res.write(`data: ${token}\n\n`)
    }
    res.write('data: [DONE]\n\n')
  } catch (err) {
    res.write(`data: [ERROR] ${err.message}\n\n`)
  } finally {
    res.end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
