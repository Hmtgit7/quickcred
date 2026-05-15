import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;
        message = (res['message'] as string) || message;
        // class-validator returns an array of messages
        if (Array.isArray(res['message'])) {
          errors = res['message'];
          message = 'Validation failed';
        }
      }
    } else if (exception instanceof Error) {
      // Handle MongoDB duplicate key
      if ((exception as NodeJS.ErrnoException).name === 'MongoServerError') {
        const err = exception as { code?: number; keyPattern?: Record<string, unknown> };
        if (err.code === 11000) {
          status = HttpStatus.CONFLICT;
          const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field';
          message = `A record with this ${field} already exists`;
        }
      }
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
