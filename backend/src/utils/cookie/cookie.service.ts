import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static tokenKey = 'token';

  async setToken(res: Response, token: string) {
    const isDev = process.env.DEV === 'true';
    return await res.cookie(CookieService.tokenKey, token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: isDev ? 'none' : 'strict',
      secure: true,
    });
  }

  async removeToken(res: Response) {
    res.clearCookie(CookieService.tokenKey);
  }
}
