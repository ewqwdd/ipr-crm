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
  SINGLE: 'Единичний выбор',
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
  answeredQuestions: AssignedAnsweredQuestion[];
  order?: number;
  photoUrl?: string;
}

interface CreateSurveyOption extends Omit<SurveyOption, 'id'> {
  id?: number;
}

export interface CreateSurveyQuestion
  extends Omit<SurveyQuestion, 'id' | 'options' | 'answeredQuestions'> {
  id?: number;
  error?: string;
  options?: CreateSurveyOption[];
  maxMinToggle?: boolean;
}

export interface SurveyCreate {
  id?: number;
  name?: string;
  description?: string;
  finishMessage?: string;

  startDate?: Date;
  endDate?: Date;
  access?: TestAccessType;
  anonymous?: boolean;

  surveyQuestions: CreateSurveyQuestion[];
}

export interface SurveyCreateStoreSchema extends SurveyCreate {
  errors: Partial<Record<keyof SurveyCreate, string>>;
}

export interface SurveyAnswer {
  textAnswer?: string;
  numberAnswer?: string;
  optionAnswer?: number[];
  scaleAnswer?: number;
  dateAnswer?: string;
  fileAnswer?: string;
  phoneAnswer?: string;
  timeAnswer?: string;
}

export type StoreAnswer = Omit<SurveyAnswer, 'fileAnswer'> & {
  fileAnswer?: File | true;
};
export interface SurveyAssesmentStoreSchema {
  screen: number;
  answers: Record<number, StoreAnswer>;
  errors: Record<number, string>;
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

  surveyQuestions: SurveyQuestion[];
  usersAssigned: AssignedSurvey[];
}

export interface AssignedAnsweredQuestion {
  assignedTestId: number;
  surveyQuestionId: number;
  numberAnswer?: number;
  textAnswer?: string;
  scaleAnswer?: number;
  dateAnswer?: Date;
  fileAnswer?: string;
  phoneAnswer?: string;
  timeAnswer?: string;
  options: { optionId: number; id: number; userAnsweredQuestion: number }[];
  userId: number;
}

export interface AssignedSurvey {
  id: number;
  userId: number;
  surveyId: number;
  startDate: string;
  endDate: string | null;
  finished: boolean;
  survey: Survey;
  answeredQUestions?: AssignedAnsweredQuestion[];
  user: {
    username: string;
    id: number;
    firstName?: string;
    lastName?: string;
  };
}
