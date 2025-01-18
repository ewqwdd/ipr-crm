import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static tokenKey = 'token';

  async setToken(res: Response, token: string) {
    return await res.cookie(CookieService.tokenKey, token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  async removeToken(res: Response) {
    res.clearCookie(CookieService.tokenKey);
  }
}
