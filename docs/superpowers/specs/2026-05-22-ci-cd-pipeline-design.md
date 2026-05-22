# CI/CD Pipeline — Design Spec

**Date:** 2026-05-22
**Status:** Approved
**Project:** `C:\Users\Sarath Marson\ai-trust-chat\`

---

## Overview

Add two GitHub Actions workflows to the existing ai-trust-chat project:

1. **CI workflow** — runs on every push and PR: installs dependencies, runs tests, runs build check
2. **Release workflow** — runs when a version tag is pushed: builds the frontend and deploys to GitHub Pages

Learning goals:
- Understand how CI/CD pipelines work in practice
- See green/red status on commits and PRs
- Experience automated deployment to a live URL
- Mirror the same two-workflow pattern used in BIK's semantic-export project

---

## Workflows

### 1. `ci.yml` — Continuous Integration

**Triggers:** Every push to any branch + every pull request

**Steps:**
1. Checkout code
2. Set up Node.js 20
3. Install dependencies (`npm ci`)
4. Run tests (`npm test`) — 8 node:test unit tests for promptBuilder
5. Run build (`npm run build`) — Vite production build

**Outcome:**
- ✅ Green checkmark on commit if all steps pass
- ❌ Red cross if tests fail or build breaks
- PRs cannot be merged if CI is red (branch protection)

---

### 2. `release.yml` — Deploy to GitHub Pages

**Triggers:** Push of a version tag matching `v*.*.*` (e.g. `v1.0.0`, `v1.0.1`)

**Steps:**
1. Checkout code
2. Set up Node.js 20
3. Install dependencies (`npm ci`)
4. Build frontend (`npm run build`) — outputs to `client/dist/`
5. Deploy `client/dist/` to GitHub Pages via `peaceiris/actions-gh-pages`

**Outcome:**
- Live frontend URL: `https://sarathmarson.github.io/ai-trust-chat`
- Every version tag creates a new deployment
- Uses built-in `GITHUB_TOKEN` — no extra secrets needed

**Caveat:** GitHub Pages hosts static files only. The deployed version shows the UI but chat requires the local Express + Groq backend. Full app runs locally with `npm run dev`.

---

## Vite Base Path

GitHub Pages serves the app at `/ai-trust-chat/` (not `/`). The Vite config needs a `base` option set to `/ai-trust-chat/` for production builds so assets load correctly.

```js
// vite.config.js — add base for production
base: process.env.NODE_ENV === 'production' ? '/ai-trust-chat/' : '/'
```

---

## File Structure

```
.github/
  workflows/
    ci.yml          ← test + build on every push/PR
    release.yml     ← deploy to GitHub Pages on version tag
```

No other files in the project are changed except `vite.config.js` (base path).

---

## How to Trigger a Release

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions picks up the tag, builds, and deploys automatically.

---

## Branch Protection (optional but recommended)

In GitHub repo settings → Branches → Add rule for `main`:
- Require status checks to pass before merging
- Select `ci` as required check

This blocks merging broken code into main.

---

## Tech Stack

| Layer | Choice |
|---|---|
| CI runner | GitHub Actions (ubuntu-latest) |
| Node version | 20 |
| Deploy action | `peaceiris/actions-gh-pages@v3` |
| Auth | Built-in `GITHUB_TOKEN` (no extra secrets) |
| Hosting | GitHub Pages (free, static) |

---

## Out of Scope

- Backend deployment (Express + Groq requires a server — GitHub Pages is static only)
- Docker / containerisation (Option 3 territory)
- Slack / email notifications
- Multiple environments (staging vs production)
