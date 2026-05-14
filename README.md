# Quickcred Monorepo

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
