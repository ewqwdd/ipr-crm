import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as winston from 'winston';
import * as path from 'path';

@Injectable()
export class AdminLoggerInterceptor implements NestInterceptor {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', // Уровень логирования
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss', // Формат времени
        }),
        winston.format.json(), // Формат JSON
      ),
      transports: [
        new winston.transports.File({
          filename: path.join(__dirname, 'logs', 'admin.log'), // Путь к файлу логов
        }),
      ],
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.session;

    if (user && Array.isArray(user.roles) && user.roles.includes('admin')) {
      const logMessage = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        user: user.id || user.email || user,
        body: req.body,
      };

      this.logger.info('Admin Request', logMessage); // Логируем сообщение
    }

    return next.handle().pipe(
      tap(() => {
        // Можно добавить логирование после обработки запроса
      }),
    );
  }
}
