import { Injectable } from '@nestjs/common';

@Injectable()
export class ValidationsService {
  normalizeFormDataArray(obj: Record<string, any>, keys: string[]) {
    for (const key of keys) {
      if (obj[key] && !Array.isArray(obj[key])) {
        obj[key] = [obj[key]];
      }
    }
    return obj;
  }
}
