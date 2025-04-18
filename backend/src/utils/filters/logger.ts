import * as winston from 'winston';

export const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message, stack }) =>
        `${timestamp} [${level.toUpperCase()}] ${message}\n${stack ?? ''}`,
    ),
  ),
  transports: [new winston.transports.File({ filename: 'logs/errors.log' })],
});
