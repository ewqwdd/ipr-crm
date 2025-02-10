import type { Rate, AddRateDto } from './types/types';
import { ratesReducer, ratesActions } from './model/rateSlice';
import AddEvaluatorModal from './ui/AddEvaluatorModal/AddEvaluatorModal';
import RateStatsModal from './ui/RateStatsModal/RateStatsModal';
import { rateTypeNames } from './model/rateTypeNames';
import EvaluateModal from './ui/EvaluateModal/EvaluateModal';

export type { Rate, AddRateDto };

export { ratesReducer, ratesActions, AddEvaluatorModal, RateStatsModal, rateTypeNames, EvaluateModal };
