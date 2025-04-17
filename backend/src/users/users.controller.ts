import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/utils/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.fto';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import { extname } from 'path';
import { S3Service } from 'src/utils/s3/s3.service';
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { InviteUserDTO } from './dto/invite-user.dto';
import { InviteAcceptDTO } from './dto/invite-accept.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createUserDto.avatar = await this.s3Service.uploadImageBufferToS3(
        file.buffer,
        createUserDto.username + Date.now() + extname(file.originalname),
        'users',
        file.mimetype,
      );
    }
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @Query('page', {
      transform: (value) => (value ? Number(value) : undefined),
    })
    page: number,
    @Query('limit', {
      transform: (value) => (value ? Number(value) : undefined),
    })
    limit: number,
  ) {
    return this.usersService.findAll({ page, limit });
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(Number(id));
  }

  @Put('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @SessionInfo() sessionInfo: GetSessionInfoDto,
  ) {
    if (file) {
      updateUserDto.avatar = await this.s3Service.uploadImageBufferToS3(
        file.buffer,
        updateUserDto.username + Date.now() + extname(file.originalname),
        'users',
        file.mimetype,
      );
    }
    const id = sessionInfo.id;
    await this.usersService.update(id, updateUserDto);
    const user = await this.usersService.findOne(id);
    return user;
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      updateUserDto.avatar = await this.s3Service.uploadImageBufferToS3(
        file.buffer,
        updateUserDto.username + Date.now() + extname(file.originalname),
        'users',
        file.mimetype,
      );
    }
    await this.usersService.update(id, updateUserDto);
    return { message: 'Пользователь обновлен.' };
  }

  @Post('/invite')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async invite(@Body() data: InviteUserDTO) {
    return this.usersService.invite(data);
  }

  @Post('/invite-accept')
  @HttpCode(HttpStatus.OK)
  async inviteAccept(@Body() data: InviteAcceptDTO) {
    return this.usersService.passwordReset(data.code, data.password);
  }

  @Post('/password-reset')
  @HttpCode(HttpStatus.OK)
  async passwordReset(@Body() data: InviteAcceptDTO) {
    return this.usersService.passwordReset(data.code, data.password);
  }
}
