import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as winston from 'winston';

@Injectable()
export class AdminLoggerInterceptor implements NestInterceptor {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.File({
          filename: 'logs/admin.log',
        }),
      ],
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.session;

    if (user && user.role === 'admin') {
      const logMessage = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        user: user.id || user.email || user,
        body: req.body,
      };

      this.logger.info('Admin Request', logMessage);
    }

    return next.handle().pipe(tap(() => {}));
  }
}
