import { EvaulatorType } from '@/entities/rates/types/types';
import { useMemo } from 'react';

type IndicatorId = number;

type RateEvaluator = {
  userId: number;
  type: EvaulatorType;
  user: {
    username: string;
  };
};

type UserRate = {
  id: number;
  userId: number;
  rate360Id: number;
  rate: number;
  indicatorId: IndicatorId;
  comment?: string;
  approved: boolean;
};

type IndicatorRatings = {
  CURATOR: number[];
  TEAM_MEMBER: number[];
  SUBORDINATE: number[];
  SELF: number[];
};

export type FinalRatings = Record<
  IndicatorId,
  { CURATOR: number; TEAM_MEMBER: number; SUBORDINATE: number; SELF: number }
>;

// Функция: Создаёт карту userId → type
const createUserTypeMap = (rateEvaluators: RateEvaluator[]) =>
  rateEvaluators.reduce((acc, { userId, type }) => {
    acc.set(userId, type);
    return acc;
  }, new Map());

// Функция: Группирует оценки по indicatorId и userType
const groupRatingsByIndicator = (
  userRates: UserRate[],
  userTypeMap: Map<number, string>,
  currentUserId: number,
): Map<number, IndicatorRatings> => {
  const indicatorRatings = new Map();

  userRates.forEach(({ userId, indicatorId, rate }) => {
    const userType =
      userId === currentUserId
        ? 'SELF'
        : userTypeMap.get(userId) || 'SUBORDINATE';

    if (!indicatorRatings.has(indicatorId)) {
      indicatorRatings.set(indicatorId, {
        CURATOR: [],
        TEAM_MEMBER: [],
        SUBORDINATE: [],
        SELF: [],
      });
    }

    if (rate !== 0) {
      indicatorRatings.get(indicatorId)[userType].push(rate);
    }
  });

  return indicatorRatings;
};

// Функция: Рассчитывает средние оценки
const calculateAverageRatings = (
  indicatorRatings: Map<number, IndicatorRatings>,
): FinalRatings => {
  return Object.fromEntries(
    [...indicatorRatings.entries()].map(([indicatorId, ratings]) => [
      indicatorId,
      {
        CURATOR: ratings.CURATOR.length
          ? ratings.CURATOR.reduce((sum, r) => sum + r, 0) /
            ratings.CURATOR.length
          : 0,
        TEAM_MEMBER: ratings.TEAM_MEMBER.length
          ? ratings.TEAM_MEMBER.reduce((sum, r) => sum + r, 0) /
            ratings.TEAM_MEMBER.length
          : 0,
        SUBORDINATE: ratings.SUBORDINATE.length
          ? ratings.SUBORDINATE.reduce((sum, r) => sum + r, 0) /
            ratings.SUBORDINATE.length
          : 0,
        SELF: ratings.SELF.length
          ? ratings.SELF.reduce((sum, r) => sum + r, 0) / ratings.SELF.length
          : 0,
      },
    ]),
  );
};

const calculateFinalRatings = (
  assessors: RateEvaluator[],
  userRates: UserRate[],
  currentUserId: number,
): FinalRatings => {
  const userTypeMap = createUserTypeMap(assessors);
  const indicatorRatings = groupRatingsByIndicator(
    userRates,
    userTypeMap,
    currentUserId,
  );
  return calculateAverageRatings(indicatorRatings);
};

export const useCalculateAvgIndicatorRaitings = (
  assessors?: RateEvaluator[],
  userRates?: UserRate[],
  currentUserId?: number,
): FinalRatings => {
  return useMemo(() => {
    if (!userRates?.length || !currentUserId) return {};
    return calculateFinalRatings(
      assessors ?? [],
      userRates,
      currentUserId,
    ) as FinalRatings;
  }, [assessors, userRates, currentUserId]);
};
