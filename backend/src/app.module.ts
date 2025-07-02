import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './utils/db/prisma.service';
import { CookieService } from './utils/cookie/cookie.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PasswordService } from './utils/password/password';
import { UniversalModule } from './universal/universal.module';
import { S3Service } from './utils/s3/s3.service';
import { TeamsModule } from './teams/teams.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Rate360Module } from './rate360/rate360.module';
import { ProfileConstructorModule } from './profile-constructor/profile-constructor.module';
import { IprModule } from './ipr/ipr.module';
import { NotificationModule } from './notification/notification.module';
import { TestModule } from './test/test.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SurveyModule } from './survey/survey.module';
import { SupportModule } from './support/support.module';
import { ProfileStructureFolderModule } from './profile-structure-folder/profile-constructor-folder.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminLoggerInterceptor } from './utils/interceptors/admin-interceptor';
import { BullModule } from '@nestjs/bull';
import { MailModule } from './mail/mail.module';
import { RedisService } from './utils/redis/redis.service';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UsersModule,
    UniversalModule,
    TeamsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    Rate360Module,
    ProfileConstructorModule,
    IprModule,
    NotificationModule,
    TestModule,
    ScheduleModule.forRoot(),
    SurveyModule,
    SupportModule,
    ProfileStructureFolderModule,
    MailModule,
    ExportModule,
  ],
  providers: [
    PrismaService,
    CookieService,
    JwtService,
    PasswordService,
    S3Service,
    RedisService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AdminLoggerInterceptor,
    },
  ],
})
export class AppModule {}
