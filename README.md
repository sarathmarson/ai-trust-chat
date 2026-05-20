# AI Trust Level Chat

Interactive demo of Anthropic's three-tier trust model — built with React, Express, and Groq.

## Trust Levels in This App

| Level | Who | Where |
|---|---|---|
| L1 — Anthropic | Anthropic (via training) | Locked banner — always active |
| L2 — Operator | You (left panel) | Persona, language, blocked topics, tone |
| L3 — User | Chat user (right panel) | Messages within operator bounds |

## Setup

1. `npm install`
2. `cp .env.example .env` — add your Groq API key
3. `npm run dev`
4. Open http://localhost:5173

## Get a free Groq API key

https://console.groq.com → API Keys (no credit card needed)

## Try it

1. Set persona: `Customer Support Agent`
2. Set language: `English only`
3. Add blocked topics: `competitors, pricing`
4. Click **Apply Config**
5. Chat as a user — try asking about competitors and watch the operator rule take effect

## Stack

- React 18 + Vite (frontend)
- Express + Node.js (backend)
- Groq llama-3.3-70b-versatile (AI)
- Server-Sent Events (streaming)
