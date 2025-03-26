import type { QuestionType, TestCreate } from '@/entities/test/types/types';
import { questionTypes } from '@/entities/test/types/types';
import TestSettings from './ui/TesCreate/TestSettings/TestSettings';
import TestAccess from './ui/TesCreate/TestAccess/TestAccess';

export type { QuestionType, TestCreate };
export { questionTypes, TestSettings, TestAccess };
