import type { Rate, AddRateDto } from './types/types';
import { ratesReducer, ratesActions } from './model/rateSlice';
import AddEvaluatorModal from './ui/AddEvaluatorModal/AddEvaluatorModal';

export type { Rate, AddRateDto };

export { ratesReducer, ratesActions, AddEvaluatorModal };
