# multi-stage build for monorepo (client: Next.js, server: Nest)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN pnpm --filter client build
RUN pnpm --filter server build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_DIR=/app/client
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/.next ./client/.next
COPY --from=build /app/client/public ./client/public
COPY --from=deps /app/node_modules ./node_modules
COPY server/package.json ./server/package.json
WORKDIR /app/server
EXPOSE 3000
CMD ["node","dist/main.js"]
