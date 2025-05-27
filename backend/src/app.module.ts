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
import { MailService } from './utils/mailer/mailer';
import { IprModule } from './ipr/ipr.module';
import { NotificationModule } from './notification/notification.module';
import { TestModule } from './test/test.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SurveyModule } from './survey/survey.module';
import { SupportModule } from './support/support.module';
import { ProfileStructureFolderModule } from './profile-structure-folder/profile-constructor-folder.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminLoggerInterceptor } from './utils/interceptors/admin-interceptor';

console.log(join(__dirname, '..', '..', 'frontend', 'dist'));

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    UsersModule,
    UniversalModule,
    TeamsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'dist'), // Путь к папке сборки фронтенда
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
  ],
  providers: [
    PrismaService,
    CookieService,
    MailService,
    JwtService,
    PasswordService,
    S3Service,
    {
      provide: APP_INTERCEPTOR,
      useClass: AdminLoggerInterceptor,
    },
  ],
})
export class AppModule {}
