import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { CookieService } from 'src/utils/cookie/cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const token = req.cookies?.[CookieService.tokenKey];

    if (!token) {
      throw new UnauthorizedException('Почта или пароль указаны неверно');
    }
    const decodedToken = this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });
    if (!decodedToken) {
      throw new UnauthorizedException('Почта или пароль указаны неверно');
    }

    req['session'] = decodedToken;

    return true;
  }
}
