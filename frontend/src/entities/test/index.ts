import type {
  QuestionType,
  TestCreate,
  Question,
  Test,
  TestOption,
} from '@/entities/test/types/types';
import { questionTypes } from '@/entities/test/types/types';
import TestSettings from './ui/TesCreate/TestSettings/TestSettings';
import TestAccess from './ui/TesCreate/TestAccess/TestAccess';

export type { QuestionType, TestCreate, Question, Test, TestOption };
export { questionTypes, TestSettings, TestAccess };
