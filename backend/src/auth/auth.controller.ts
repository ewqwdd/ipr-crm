import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieService } from 'src/utils/cookie/cookie.service';
import { SignInDto } from './dto/signin.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '../utils/guards/auth.guard';
import { SessionInfo } from './decorator/session-info.decorator';
import { GetSessionInfoDto } from './dto/get-session-info.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cookieService: CookieService,
    private jwtService: JwtService,
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

    if (user.role.name === 'admin' || user.teamCurator.length > 0) {
      return { redirect: '/admin' };
    }

    return user;
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async me(
    @SessionInfo() sessionInfo: GetSessionInfoDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const user = await this.authService.getSesssionInfo(Number(sessionInfo.id));
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const token = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        role: user.role.name,
      },
      {
        secret: process.env.SECRET_KEY,
      },
    );
    this.cookieService.setToken(res, token);

    const isAdmin = !!req.headers.admin

    if (
      !isAdmin &&
      (user.role.name === 'admin' || user.teamCurator.length > 0)
    ) {
      return { redirect: '/admin' };
    }

    return user;
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
    return { message: 'Вы вышли из системы' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body('email') email: string) {
    await this.authService.resetPassword(email);
    return;
  }
}
