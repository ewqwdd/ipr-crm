import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const isDev = configService.get<number>('DEV');

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
