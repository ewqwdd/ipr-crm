import { TestAccessType } from '@/entities/test/types/types';

export const surveyQuestionTypes = [
  'SINGLE',
  'MULTIPLE',
  'NUMBER',
  'TEXT',
  'SCALE',
  'DATE',
  'FILE',
  'PHONE',
  'TIME',
] as const;

export type SurveyQuestionType = (typeof surveyQuestionTypes)[number];

export const surveyQuestionTypeLabels: Record<SurveyQuestionType, string> = {
  SINGLE: 'Единичний вибор',
  MULTIPLE: 'Мультивыбор',
  NUMBER: 'Число',
  TEXT: 'Короткий текст',
  DATE: 'Дата',
  FILE: 'Файл',
  PHONE: 'Телефон',
  TIME: 'Время',
  SCALE: 'Шкала',
};

export interface SurveyOption {
  id: number;
  value: string;
}

export interface SurveyQuestion {
  id: number;
  type: SurveyQuestionType;
  label: string;
  description?: string;
  options?: SurveyOption[];
  maxLength?: number;
  maxNumber?: number;
  minNumber?: number;
  required: boolean;
  allowDecimal?: boolean;
  scaleDots?: number;
  scaleStart?: string;
  scaleEnd?: string;
}

interface CreateSurveyOption extends Omit<SurveyOption, 'id'> {
  id?: number;
}

export interface CreateSurveyQuestion
  extends Omit<SurveyQuestion, 'id' | 'options'> {
  id?: number;
  error?: string;
  options?: CreateSurveyOption[];
  maxMinToggle?: boolean;
}

export interface SurveyCreate {
  id?: number;
  name?: string;
  description?: string;
  passedMessage?: string;

  startDate?: Date;
  endDate?: Date;
  access?: TestAccessType;
  anonymous?: boolean;

  surveyQuestions: CreateSurveyQuestion[];
}

export interface SurveyCreateStoreSchema extends SurveyCreate {
  errors: Partial<Record<keyof SurveyCreate, string>>;
}

export interface Answer {
  textAnswer?: string;
  numberAnswer?: string;
  optionAnswer?: number[];
}

export interface TestAssesmentStoreSchema {
  screen: number;
  answers: Record<number, Answer>;
}
export interface Survey {
  id: number;
  name: string;
  description?: string;
  finishMessage?: string;

  startDate: Date;
  endDate?: Date;
  access: TestAccessType;
  anonymous: boolean;

  archived?: boolean;
  hidden?: boolean;

  surveyQuestions: SurveyQuestion[]; // аналогично surveyQuestions
  usersAssigned: AssignedTest[]; // ты не дал его тип, оставляю как есть
}

export interface AssignedAnsweredQuestion {
  assignedTestId: number;
  questionId: number;
  numberAnswer?: number;
  textAnswer?: string;
  options: { optionId: number; id: number; userAnsweredQuestion: number }[];
  userId: number;
}

export interface AssignedTest {
  id: number;
  userId: number;
  testId: number;
  rate360Id: number | null;
  startDate: string; // или `Date`, если ты парсишь в дату
  endDate: string | null; // или `Date | null`
  // result: any | null; // уточни тип, если знаешь структуру result
  finished: boolean;
  test: Test;
  score: number | null;
  questionsCount?: number;
  answeredQUestions: AssignedAnsweredQuestion[];
  user: {
    username: string;
    id: number;
    firstName?: string;
    lastName?: string;
  };
}
