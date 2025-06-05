import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/utils/db/prisma.service';
import { PasswordService } from 'src/utils/password/password';
import { S3Service } from 'src/utils/s3/s3.service';
import { MailService } from 'src/utils/mailer/mailer';
import { CreateProductsService } from './create-products.service';
import { UsersAccessService } from './users-access.service';
import { FilesService } from 'src/utils/files/files.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    PasswordService,
    S3Service,
    MailService,
    CreateProductsService,
    UsersAccessService,
    FilesService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
