import 'dotenv/config'
import express from 'express'

const app = express()
app.use(express.json())

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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
