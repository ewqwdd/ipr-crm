import type { Rate, AddRateDto } from './types/types';
import { ratesReducer, ratesActions } from './model/rateSlice';
import AddEvaluatorModal from './ui/AddEvaluatorModal/AddEvaluatorModal';
import RateStatsModal from './ui/RateStatsModal/RateStatsModal';

export type { Rate, AddRateDto };

export { ratesReducer, ratesActions, AddEvaluatorModal, RateStatsModal };
