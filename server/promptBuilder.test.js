import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { buildSystemPrompt } from './promptBuilder.js'

test('returns default prompt for empty config', () => {
  assert.equal(buildSystemPrompt({}), 'You are a helpful assistant.')
})

test('includes persona name', () => {
  const result = buildSystemPrompt({ persona: 'German Tutor' })
  assert.ok(result.includes('German Tutor'))
})

test('includes German language constraint', () => {
  const result = buildSystemPrompt({ language: 'de' })
  assert.ok(result.includes('German'))
})

test('includes French language constraint', () => {
  const result = buildSystemPrompt({ language: 'fr' })
  assert.ok(result.includes('French'))
})

test('no language constraint for "any"', () => {
  const result = buildSystemPrompt({ language: 'any' })
  assert.ok(!result.includes('respond in'))
})

test('includes blocked topics', () => {
  const result = buildSystemPrompt({ blockedTopics: 'politics, religion' })
  assert.ok(result.includes('politics, religion'))
})

test('includes concise tone instruction', () => {
  const result = buildSystemPrompt({ tone: 'concise' })
  assert.ok(result.includes('concise'))
})

test('builds full prompt from all fields', () => {
  const result = buildSystemPrompt({
    persona: 'Legal Assistant',
    language: 'en',
    blockedTopics: 'politics',
    tone: 'concise'
  })
  assert.ok(result.includes('Legal Assistant'))
  assert.ok(result.includes('English'))
  assert.ok(result.includes('politics'))
  assert.ok(result.includes('concise'))
})
