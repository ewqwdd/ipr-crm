import { Injectable } from '@nestjs/common';
import { pbkdf2Sync } from 'crypto';

@Injectable()
export class PasswordService {
  getHash(password: string) {
    const hash = pbkdf2Sync(
      password,
      process.env.SECRET_SALT,
      1000,
      64,
      'sha512',
    ).toString('hex');
    return hash;
  }
}
