import { Prisma } from '@prisma/client';

export const findAllIprInclude: Prisma.IndividualGrowthPlanFindManyArgs['include'] =
  {
    user: {
      include: {
        deputyRelationsAsDeputy: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    },
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
