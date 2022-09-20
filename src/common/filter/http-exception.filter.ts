import {
  Catch,
  HttpException,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { Logger } from '../interceptors/logger.interceptor';

@Catch(HttpException)
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const logFormat = `
    -----------------------------------------------------------------------
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${
      exception.toString() +
      `（${exceptionResponse?.msg || exception.message}）`
    }
    -----------------------------------------------------------------------
        `;
    Logger.info(logFormat);
    response.status(status).json({
      code: exceptionResponse.code || status,
      data: null,
      msg: exceptionResponse?.msg || exception.message,
    });
  }
}
