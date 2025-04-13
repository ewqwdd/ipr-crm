import type {
  QuestionType,
  TestCreate,
  Question,
  Test,
  TestOption,
  AssignedTest,
} from '@/entities/test/types/types';
import { questionTypes } from '@/entities/test/types/types';
import TestSettings from './ui/TesCreate/TestSettings/TestSettings';
import TestQuestion from './ui/TestAssesment/TestQuestion';
import { testCreateTabs } from './constants';

export type {
  QuestionType,
  TestCreate,
  Question,
  Test,
  TestOption,
  AssignedTest,
};
export { questionTypes, TestSettings, TestQuestion, testCreateTabs };
