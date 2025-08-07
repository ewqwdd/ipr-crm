import { Prisma } from '@prisma/client';

export const findAllRateInclude: Prisma.Rate360FindManyArgs['include'] = {
  evaluators: {
    select: {
      userId: true,
      type: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      username: true,
    },
  },
  spec: {
    select: {
      id: true,
      name: true,
    },
  },
  team: {
    select: {
      id: true,
      name: true,
      curatorId: true,
    },
  },
  comments: {
    select: {
      comment: true,
      competencyId: true,
      userId: true,
    },
  },
  userRates: {
    include: {
      indicator: true,
    },
    where: {
      approved: true,
    },
  },
  competencyBlocks: {
    include: {
      competencies: {
        include: {
          indicators: true,
        },
      },
    },
  },
  plan: true,
};

export type RateTeamFiltersType = {
  name?: string;
  parentTeam?: RateTeamFiltersType | null;
};
