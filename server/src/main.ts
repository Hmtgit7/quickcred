import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const nodeEnv = configService.get<string>('app.nodeEnv');
  const corsOrigin = configService.get<string>('app.corsOrigin');
  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api';

  // Security headers
  app.use(helmet());

  // Cookie parsing (for refresh token in httpOnly cookie)
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global API prefix
  app.setGlobalPrefix(apiPrefix);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw on unknown properties
      transform: true, // Auto-transform to DTO types
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // Swagger — dev only
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('QuickCred API')
      .setDescription('Loan Management System — REST API documentation')
      .setVersion('1.0')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User profile & management')
      .addTag('loans', 'Loan lifecycle management')
      .addTag('payments', 'Payment recording & tracking')
      .addTag('documents', 'File upload & management')
      .addTag('notifications', 'In-app notification centre')
      .addTag('analytics', 'Dashboard analytics & KPIs')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    new Logger('Bootstrap').log(`📚 Swagger docs: http://localhost:${port}/${apiPrefix}/docs`);
  }

  await app.listen(port);
  new Logger('Bootstrap').log(
    `🚀 QuickCred API running on http://localhost:${port}/${apiPrefix} [${nodeEnv}]`
  );
}

void bootstrap();
