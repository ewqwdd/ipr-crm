import {
  Body,
  Controller,
  Delete,
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
import { SessionInfo } from 'src/auth/decorator/session-info.decorator';
import { GetSessionInfoDto } from 'src/auth/dto/get-session-info.dto';
import { InviteUserDTO } from './dto/invite-user.dto';
import { InviteAcceptDTO } from './dto/invite-accept.dto';
import { CreateMultipleUsersDto } from './dto/create-multiple-users.dto';
import { FilesService } from 'src/utils/files/files.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      createUserDto.avatar = await this.filesService.uploadFile(
        file,
        'AVATARS',
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
      updateUserDto.avatar = await this.filesService.uploadFile(
        file,
        'AVATARS',
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
      updateUserDto.avatar = await this.filesService.uploadFile(
        file,
        'AVATARS',
      );
    }
    const user = await this.usersService.update(id, updateUserDto);
    return user;
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
    console.log('Invite accept data:', data);
    return this.usersService.passwordReset(data.code.trim(), data.password);
  }

  @Post('/password-reset')
  @HttpCode(HttpStatus.OK)
  async passwordReset(@Body() data: InviteAcceptDTO) {
    return this.usersService.passwordReset(data.code, data.password);
  }

  @Post('/import')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(@UploadedFile() file: Express.Multer.File) {
    return this.usersService.importUsers(file);
  }

  @Post('/multiple')
  @UseGuards(AdminGuard)
  async addUsers(@Body() data: CreateMultipleUsersDto) {
    return this.usersService.createMultipleUsers(data);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Post('/resend-invite/:id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async resendInvite(
    @Param('id', { transform: (id) => Number(id) }) id: number,
  ) {
    return this.usersService.resendInvite(id);
  }

  @Post('/resend-invite/all')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async resendAllInvites() {
    return this.usersService.resendInvitesAll();
  }
}
