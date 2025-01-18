import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieService } from 'src/utils/cookie/cookie.service';
import { SignInDto } from './dto/signin.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './decorator/session-info.decorator';
import { GetSessionInfoDto } from './dto/get-session-info.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    this.cookieService.setToken(res, token);
    return { ...user };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async me(@SessionInfo() sessionInfo: GetSessionInfoDto) {
    const user = await this.authService.getSesssionInfo(Number(sessionInfo.id));
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }
    return user;
  }
}
