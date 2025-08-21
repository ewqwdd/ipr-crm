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

export type ExportTeamsPayload = Prisma.TeamGetPayload<{
  select: {
    id: true;
    name: true;
    parentTeam: {
      select: {
        id: true;
        name: true;
        parentTeam: {
          select: {
            id: true;
            name: true;
            parentTeam: {
              select: {
                id: true;
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>[];

export type ExportCaseRatesPayload = Prisma.Rate360GetPayload<{
  include: {
    cases: true;
    userRates: {
      include: {
        user: {
          select: {
            username: true;
            id: true;
            avatar: true;
          };
        };
      };
    };
    evaluators: {
      include: {
        user: {
          select: {
            username: true;
            id: true;
            avatar: true;
          };
        };
      };
    };
    user: {
      select: {
        username: true;
        id: true;
        avatar: true;
      };
    };
    comments: {
      include: {
        user: {
          select: {
            username: true;
            id: true;
            avatar: true;
          };
        };
      };
    };
    author: {
      select: {
        username: true;
        id: true;
        avatar: true;
      };
    };
  };
}>;
