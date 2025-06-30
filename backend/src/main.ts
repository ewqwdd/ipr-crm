import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './utils//filters/all-executions.filter';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { getQueueToken } from '@nestjs/bull';
import { adminExpressMiddleware } from './utils/middleware/adminExpress.middleware';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const isDev = configService.get<number>('DEV');
  const origin = configService.get<string>('ORIGIN') ?? 'http://localhost:5173';

  app.enableCors({
    origin: [origin],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const mailQueue = app.get(getQueueToken('mail'));

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/api/admin/queues');

  createBullBoard({
    queues: [new BullAdapter(mailQueue)],
    serverAdapter: serverAdapter,
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(
    '/api/admin/queues',
    adminExpressMiddleware,
    serverAdapter.getRouter(),
  );
  app.use(
    '/prometheus',
    adminExpressMiddleware,
    createProxyMiddleware({
      target: 'http://localhost:9090',
      changeOrigin: true,
      ws: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
