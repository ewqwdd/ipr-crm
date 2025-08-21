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
            id: true,
          },
        },
        meetDate: true,
        teamId: true,
      },
    },
    tasks: true,
    spec: true,
    planCurators: {
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    },
  };

export type FindAllIprType = Prisma.IndividualGrowthPlanGetPayload<{
  include: {
    user: {
      include: {
        deputyRelationsAsDeputy: {
          select: {
            user: {
              select: {
                id: true;
                username: true;
                avatar: true;
              };
            };
          };
        };
      };
    };
    rate360: {
      select: {
        team: {
          select: {
            name: true;
          };
        };
        meetDate: true;
      };
    };
    tasks: true;
    spec: true;
    planCurators: {
      include: {
        user: {
          select: {
            id: true;
            username: true;
            avatar: true;
          };
        };
      };
    };
  };
}>;
