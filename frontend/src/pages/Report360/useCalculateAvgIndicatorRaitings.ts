import { EvaulatorType } from '@/entities/rates/types/types';
import { useMemo } from 'react';

type IndicatorId = number;

type RateEveloper = {
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
};

export type FinalRatings = Record<
  IndicatorId,
  { CURATOR: number; TEAM_MEMBER: number; SUBORDINATE: number }
>;

// Функция: Создаёт карту userId → type
const createUserTypeMap = (rateEvelopers: RateEveloper[]) =>
  rateEvelopers.reduce((acc, { userId, type }) => {
    acc.set(userId, type);
    return acc;
  }, new Map());

// Функция: Группирует оценки по indicatorId и userType
const groupRatingsByIndicator = (
  userRates: UserRate[],
  userTypeMap: Map<number, string>,
): Map<number, IndicatorRatings> => {
  const indicatorRatings = new Map();

  userRates.forEach(({ userId, indicatorId, rate }) => {
    const userType = userTypeMap.get(userId) || 'SUBORDINATE';

    if (!indicatorRatings.has(indicatorId)) {
      indicatorRatings.set(indicatorId, {
        CURATOR: [],
        TEAM_MEMBER: [],
        SUBORDINATE: [],
      });
    }

    indicatorRatings.get(indicatorId)[userType].push(rate);
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
      },
    ]),
  );
};

const calculateFinalRatings = (
  assessors: RateEveloper[],
  userRates: UserRate[],
): FinalRatings => {
  const userTypeMap = createUserTypeMap(assessors);
  const indicatorRatings = groupRatingsByIndicator(userRates, userTypeMap);
  return calculateAverageRatings(indicatorRatings);
};

export const useCalculateAvgIndicatorRaitings = (
  assessors?: RateEveloper[],
  userRates?: UserRate[],
): FinalRatings => {
  return useMemo(() => {
    if (!assessors?.length || !userRates?.length) return {};
    return calculateFinalRatings(assessors, userRates) as FinalRatings;
  }, [assessors, userRates]);
};
