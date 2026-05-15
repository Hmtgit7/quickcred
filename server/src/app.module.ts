import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CloudinaryModule } from './libs/cloudinary/cloudinary.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Infrastructure
    ConfigModule,
    DatabaseModule,
    CloudinaryModule,

    // Rate limiting — 100 requests per 60s per IP globally
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    // Global rate limiter
    { provide: APP_GUARD, useClass: ThrottlerGuard },

    // Global exception filter
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },

    // Global response transformer
    { provide: APP_INTERCEPTOR, useClass: ResponseTransformInterceptor },
  ],
})
export class AppModule {}
