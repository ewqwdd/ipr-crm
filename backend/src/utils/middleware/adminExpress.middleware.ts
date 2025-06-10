import { JwtService } from '@nestjs/jwt';
import { CookieService } from '../cookie/cookie.service';
import { NextFunction, Request, Response } from 'express';

const jwtService = new JwtService({ secret: process.env.SECRET_KEY });

export function adminExpressMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies[CookieService.tokenKey];
    if (!token) throw new Error('Необходима авторизация');
    const decodedToken = jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });
    if (!decodedToken || decodedToken.role !== 'admin')
      throw new Error('Недостаточно прав');
    next();
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
}
