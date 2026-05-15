# NestJS API Server
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY server/package.json ./server/
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter server build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY server/package.json ./server/
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
COPY --from=build /app/server/dist ./server/dist
EXPOSE 3000
CMD ["node","server/dist/main.js"]
