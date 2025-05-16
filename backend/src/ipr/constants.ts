import { Prisma } from '@prisma/client';

export const findAllIprInclude: Prisma.IndividualGrowthPlanFindManyArgs['include'] =
  {
    user: true,
    mentor: true,
    rate360: {
      select: {
        team: {
          select: {
            name: true,
          },
        },
      },
    },
    tasks: true,
    spec: true,
  };
