import { Prisma } from '@prisma/client';
import { FindAllIprType } from 'src/ipr/ipr.types';

export type ExportIprPayload = FindAllIprType[];

export type ExportRatesPayload = (Prisma.Rate360GetPayload<{
  include: {
    user: {
      select: {
        username: true;
      };
    };
  };
}> & { progress: number })[];
