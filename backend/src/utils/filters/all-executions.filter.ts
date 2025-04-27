// all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { sendToTelegram } from '../telegram/telegram.utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    if (status >= 500) {
      const message = `[${request.method}] ${request.url} -> ${status}\n${JSON.stringify(
        errorResponse,
      )}`;
      const stack = exception instanceof Error ? exception.stack : undefined;
      const session = JSON.stringify({ session: request['session'] }, null, 2);
      const body = JSON.stringify({ body: request.body }, null, 2);
      this.logger.error(message, stack, session, body);
      sendToTelegram(message, stack ?? '', session, body);
    }

    response.status(status).json(errorResponse);
  }
}
