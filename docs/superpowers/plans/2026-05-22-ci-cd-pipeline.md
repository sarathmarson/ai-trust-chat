# CI/CD Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two GitHub Actions workflows to ai-trust-chat — a CI workflow that runs tests and build checks on every push/PR, and a release workflow that deploys the frontend to GitHub Pages on version tags.

**Architecture:** Two YAML workflow files under `.github/workflows/`. The CI workflow runs `npm ci`, `npm test`, and `npm run build` on every push and PR. The release workflow runs on `v*.*.*` tags, builds the Vite frontend, and deploys `client/dist/` to GitHub Pages using `peaceiris/actions-gh-pages`. `vite.config.js` gets a `base` option so assets load correctly on GitHub Pages (`/ai-trust-chat/` path prefix).

**Tech Stack:** GitHub Actions, ubuntu-latest runner, Node.js 20, peaceiris/actions-gh-pages@v3, built-in GITHUB_TOKEN.

---

## File Map

| File | Change |
|---|---|
| `.github/workflows/ci.yml` | Create — test + build on every push/PR |
| `.github/workflows/release.yml` | Create — deploy to GitHub Pages on version tag |
| `vite.config.js` | Modify — add `base` for production builds |

---

## Task 1: Update vite.config.js for GitHub Pages

**Files:**
- Modify: `C:\Users\Sarath Marson\ai-trust-chat\vite.config.js`

GitHub Pages serves the app at `https://sarathmarson.github.io/ai-trust-chat/` — note the `/ai-trust-chat/` prefix. Without a `base` setting, Vite generates asset paths starting with `/` which break on GitHub Pages. We set `base` to `/ai-trust-chat/` in production and `/` in development.

- [ ] **Step 1: Update `vite.config.js`**

Replace the entire file with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'client',
  base: process.env.NODE_ENV === 'production' ? '/ai-trust-chat/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
})
```

- [ ] **Step 2: Verify dev server still works**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm run dev
```

Expected: Dev server starts on http://localhost:5173, app loads normally. No visual difference — `base: '/'` applies in dev mode.

Stop the server (Ctrl+C).

- [ ] **Step 3: Verify production build works**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
npm run build
```

Expected output:
```
vite v5.x.x building for production...
✓ built in ...ms
```

Check that `client/dist/` folder was created:
```bash
ls client/dist/
```

Expected: `index.html`, `assets/` folder present.

- [ ] **Step 4: Commit**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git add vite.config.js
git commit -m "chore: set vite base path for GitHub Pages deployment"
```

---

## Task 2: Add CI workflow

**Files:**
- Create: `C:\Users\Sarath Marson\ai-trust-chat\.github\workflows\ci.yml`

This workflow runs on every push to any branch and on every pull request. It installs dependencies, runs the 8 node:test unit tests, and runs the Vite production build. If either fails, GitHub shows a red ❌ on the commit.

- [ ] **Step 1: Create `.github/workflows/` directory and `ci.yml`**

```yaml
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: ['**']

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

- [ ] **Step 2: Commit and push to trigger CI**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions CI workflow (test + build)"
git push personal main
git push company main
```

- [ ] **Step 3: Verify CI runs on GitHub**

Go to `https://github.com/sarathmarson/ai-trust-chat/actions`

Expected:
- A workflow run named `CI` appears
- All 3 steps pass: Checkout → Install → Test → Build
- Green ✅ appears on the latest commit

If it fails, read the logs — most common issue is Node version mismatch or missing `npm ci` lock file.

---

## Task 3: Add release workflow (deploy to GitHub Pages)

**Files:**
- Create: `C:\Users\Sarath Marson\ai-trust-chat\.github\workflows\release.yml`

This workflow only runs when you push a tag matching `v*.*.*`. It builds the frontend and deploys `client/dist/` to the `gh-pages` branch using `peaceiris/actions-gh-pages`. GitHub Pages then serves whatever is on that branch.

- [ ] **Step 1: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./client/dist
```

- [ ] **Step 2: Commit and push**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git add .github/workflows/release.yml
git commit -m "ci: add release workflow — deploy to GitHub Pages on version tag"
git push personal main
git push company main
```

- [ ] **Step 3: Enable GitHub Pages in repo settings**

1. Go to `https://github.com/sarathmarson/ai-trust-chat/settings/pages`
2. Under **Source** → select **Deploy from a branch**
3. Branch → select **gh-pages** → folder **/ (root)**
4. Click **Save**

Note: The `gh-pages` branch doesn't exist yet — it gets created automatically when the release workflow runs for the first time.

- [ ] **Step 4: Trigger the first release**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git tag v1.0.0
git push personal v1.0.0
```

- [ ] **Step 5: Verify deployment**

1. Go to `https://github.com/sarathmarson/ai-trust-chat/actions`
2. A workflow run named `Release` appears — wait for it to complete (≈2 minutes)
3. Go to `https://github.com/sarathmarson/ai-trust-chat/settings/pages`
4. A live URL appears: `https://sarathmarson.github.io/ai-trust-chat`
5. Open the URL — the app UI loads with the dark theme, trust banner, and operator panel

Expected: UI renders correctly. Chat input is visible. (Chat won't work — no backend — that's expected.)

---

## Task 4: Verify full CI/CD cycle end to end

No new files — this task confirms everything works together.

- [ ] **Step 1: Make a small change and push to verify CI**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
```

Open `README.md` and add one line at the bottom:
```markdown
## CI/CD

[![CI](https://github.com/sarathmarson/ai-trust-chat/actions/workflows/ci.yml/badge.svg)](https://github.com/sarathmarson/ai-trust-chat/actions/workflows/ci.yml)
```

```bash
git add README.md
git commit -m "docs: add CI status badge to README"
git push personal main
git push company main
```

- [ ] **Step 2: Verify badge appears on GitHub**

Go to `https://github.com/sarathmarson/ai-trust-chat`

Expected: A green **CI passing** badge appears at the bottom of the README — clickable, links to the Actions page.

- [ ] **Step 3: Release v1.0.1 to confirm release pipeline still works**

```bash
cd "C:\Users\Sarath Marson\ai-trust-chat"
git tag v1.0.1
git push personal v1.0.1
```

Go to `https://github.com/sarathmarson/ai-trust-chat/actions` — Release workflow runs and deploys updated version to GitHub Pages.

- [ ] **Step 4: Final smoke check**

Confirm all three are green:
- [ ] `https://github.com/sarathmarson/ai-trust-chat/actions` — CI workflow green on latest commit
- [ ] `https://sarathmarson.github.io/ai-trust-chat` — app loads in browser
- [ ] README shows CI badge
