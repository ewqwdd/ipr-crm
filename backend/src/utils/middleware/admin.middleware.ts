import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CookieService } from '../cookie/cookie.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies[CookieService.tokenKey];
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      console.log('Decoded Token:', decodedToken);
      console.log('Token from cookies:', token);
      if (!decodedToken) {
        throw new UnauthorizedException('Почта или пароль указаны неверно');
      }
      next();
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}
