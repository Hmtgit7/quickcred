# multi-stage build for monorepo (client: Next.js, server: Nest)
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter client build
RUN pnpm --filter server build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_DIR=/app/client
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/.next ./client/.next
COPY --from=build /app/client/public ./client/public
COPY --from=build /app/node_modules ./node_modules
COPY server/package.json ./server/package.json
EXPOSE 3000
CMD ["node","server/dist/main.js"]
