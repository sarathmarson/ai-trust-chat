export function buildSystemPrompt({ persona, language, blockedTopics, tone } = {}) {
  const parts = []

  if (persona?.trim()) {
    parts.push(`You are ${persona.trim()}.`)
  } else {
    parts.push('You are a helpful assistant.')
  }

  const langMap = { en: 'English', de: 'German', fr: 'French' }
  if (language && language !== 'any' && langMap[language]) {
    parts.push(`Always respond in ${langMap[language]} only.`)
  }

  if (blockedTopics?.trim()) {
    parts.push(`Never discuss: ${blockedTopics.trim()}.`)
  }

  const toneMap = {
    casual: 'Keep your tone casual and friendly.',
    concise: 'Keep your responses concise — 2-3 sentences maximum.'
  }
  if (toneMap[tone]) parts.push(toneMap[tone])

  return parts.join(' ')
}
