import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.fto';
import { UsersService } from './users.service';
import { AdminGuard } from 'src/utils/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update-user.dto';
import path from 'path';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.usersService.findAll({ page, limit });
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(Number(id));
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('id') id: number,
    // @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      const filePath = path.join(__dirname, '..', '..', 'public', file.filename)
    //   updateUserDto.avatar = filePath
    }

}
}
