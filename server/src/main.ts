import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import next from 'next';
import path from 'path';
import type { RequestHandler } from 'express';
import { AppModule } from './app.module';

interface NextApp {
  prepare(): Promise<void>;
  getRequestHandler(): RequestHandler;
}

interface NextFactory {
  (options: { dev: boolean; dir: string }): NextApp;
}

async function bootstrap() {
  const dev = process.env.NODE_ENV !== 'production';
  const defaultNextDir = path.resolve(__dirname, '..', '..', 'client');
  const nextDir = process.env.NEXT_DIR ?? defaultNextDir;

  const createNext = next as unknown as NextFactory;
  const nextApp = createNext({ dev, dir: nextDir });
  const handle = nextApp.getRequestHandler();

  await nextApp.prepare();

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api');
  await app.init();

  // Fallback: let Next handle all non-/api routes and static assets
  server.use((req, res, next) => {
    void handle(req, res, next);
  });

  const port = process.env.PORT ?? 3000;
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

void bootstrap();
