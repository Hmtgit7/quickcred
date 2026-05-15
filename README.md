# Quickcred - Monorepo

## 📁 Project Structure

```
quickcred/
├── client/           # Next.js 16 Frontend (Vercel)
│   ├── app/          # App Router
│   ├── public/       # Static assets
│   └── package.json
│
├── server/           # NestJS 11 Backend API (Render)
│   ├── src/          # Source code
│   ├── test/         # E2E tests
│   └── package.json
│
├── Dockerfile        # Multi-stage build for NestJS
├── pnpm-workspace.yaml
└── package.json      # Root workspace config
```

## 🚀 Deployment Architecture

**Frontend**: Deployed on **Vercel**
- URL: `https://quickcred.vercel.app`
- Framework: Next.js 16 with React 19
- Environment: `NEXT_PUBLIC_API_URL` → Backend URL

**Backend**: Deployed on **Render**
- URL: `https://quickcred-api.onrender.com`
- Framework: NestJS 11
- Endpoint: `GET /api`

## 💻 Local Development

### Prerequisites
- Node.js 20+
- pnpm 10+

### Setup
```bash
# Install dependencies (all workspaces)
pnpm install

# Run both frontend & backend in parallel
pnpm dev

# Frontend only (port 3000)
pnpm --filter client dev

# Backend only (port 3000)
pnpm --filter server start:dev
```

## 🔨 Build & Test

```bash
# Build both
pnpm build

# Test backend
pnpm --filter server test

# Test backend (watch)
pnpm --filter server test:watch

# E2E tests
pnpm --filter server test:e2e
```

## 🐳 Docker

```bash
# Build image
docker build -t quickcred:latest .

# Run container
docker run -p 3000:3000 -e CORS_ORIGIN="*" quickcred:latest
```

## 📦 Package Management

This is a **pnpm monorepo** with:
- Shared root `pnpm-lock.yaml`
- Workspace-specific `package.json`
- Shared dev dependencies at root
- Git hooks via Husky

```bash
# Install all dependencies
pnpm install

# Add package to specific workspace
pnpm --filter client add react
pnpm --filter server add axios

# Add dev dependency to root
pnpm add -D -w prettier eslint
```

## 🔧 Code Quality

- **Linter**: ESLint 9
- **Formatter**: Prettier
- **Pre-commit hooks**: Husky
  - Auto-lint staged files
  - Conventional commit validation
  - Security scanning via Dependabot

## 🌍 Environment Variables

### Backend (Render)
```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://quickcred.vercel.app
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://quickcred-api.onrender.com
```

## 📝 API Endpoints

```
GET /api              - Test endpoint returns "Hello World!"
```

## 🚀 Deployment Steps

### Backend to Render
1. Push to GitHub
2. Render auto-deploys on push (configured with Dockerfile)
3. Set environment variables in Render dashboard

### Frontend to Vercel
1. Connect GitHub repo to Vercel
2. Set root directory: `client`
3. Environment: `NEXT_PUBLIC_API_URL=<backend-url>`
4. Auto-deploys on push

## 📚 Tech Stack

| Layer | Technology | Version |
|-------|-----------|----------|
| Frontend | Next.js | 16.2.6 |
| Frontend | React | 19.2.4 |
| Backend | NestJS | 11.0.1 |
| Backend | Express | Built-in |
| Runtime | Node.js | 20 |
| Package Manager | pnpm | 10.33.0 |
| Container | Docker | Alpine |

## 📄 License

UNLICENSED (Private)

---

**Quick Links**
- [Next.js Docs](https://nextjs.org)
- [NestJS Docs](https://nestjs.com)
- [pnpm Workspace](https://pnpm.io/workspaces) Monorepo

This repository contains a Next.js frontend (`client`) and a NestJS backend (`server`) served together from a single process so the app is available at `/` and the API at `/api`.

Quick commands

```bash
pnpm install
pnpm build
# run server in production (serves client and API)
pnpm start

# local dev (run client and server separately)
pnpm --filter client dev
pnpm --filter server start:dev
```

Husky & lint-staged

Husky is configured to run `lint-staged` on pre-commit. To finish setup after cloning:

```bash
pnpm install
pnpm -w dlx husky-init --yes
pnpm -w dlx husky install
```

Docker

Build and run the single image which contains both frontend and backend:

```bash
docker build -t quickcred:latest .
docker run -p 3000:3000 -e NODE_ENV=production quickcred:latest
```

Render deploy

Use the checked-in [render.yaml](render.yaml) blueprint to deploy one Docker service with a single public URL:

```bash
render deploy
```

If you deploy from the Render dashboard, point it at this repository and let it use the root [Dockerfile](Dockerfile). The app will be available at `/`, and the API will be available at `/api`.

CI/CD

- Dependabot checks are configured in `.github/dependabot.yml`.
- Basic CI is in `.github/workflows/ci.yml` and runs install, build and server tests.

If you want, I can:
- Commit these changes and create a branch
- Add a deployment GitHub Action (Render, DigitalOcean App Platform, or AWS)
