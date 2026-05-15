import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.init();

  const port = process.env.PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`NestJS API listening on http://localhost:${port}`);
  });
}

void bootstrap();
