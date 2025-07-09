import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { PasswordService } from 'src/utils/password/password';
import { S3Service } from 'src/utils/s3/s3.service';
import { CreateProductsService } from './create-products.service';
import { UsersAccessService } from './users-access.service';
import { MailModule } from 'src/mail/mail.module';
import { RedisService } from 'src/utils/redis/redis.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [UsersController],
  imports: [MailModule, FilesModule],
  providers: [
    UsersService,
    PrismaService,
    PasswordService,
    S3Service,
    CreateProductsService,
    UsersAccessService,
    RedisService,
  ],
  exports: [UsersService, UsersAccessService],
})
export class UsersModule {}
