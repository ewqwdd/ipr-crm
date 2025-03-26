export const questionTypes = ['SINGLE', 'MULTIPLE', 'NUMBER', 'TEXT'] as const;

export const testAccessTypes = ['PUBLIC', 'PRIVATE', 'LINK_ONLY'];

export const questionTypeLabels: Record<QuestionType, string> = {
  SINGLE: 'Единичний вибор',
  MULTIPLE: 'Мультивыбор',
  NUMBER: 'Число',
  TEXT: 'Короткий текст',
};

export type QuestionType = (typeof questionTypes)[number];
export type TestAccessType = (typeof testAccessTypes)[number];

export interface TestOption {
  value: string;
  isCorrect?: boolean;
}

export interface Question {
  type: QuestionType;
  label: string;
  description?: string;
  options?: TestOption[];
  maxLength?: number;
  maxNumber?: number;
  minNumber?: number;
  required: boolean;
  numberCorrectValue?: number;
  textCorrectValue?: string;
  allowDecimal?: boolean;
}

export interface CreateQuestion extends Question {
  error?: string;
}

export interface TestCreate {
  name?: string;
  description?: string;
  passedMessage?: string;
  failedMessage?: string;
  showScoreToUser?: boolean;

  startDate?: Date;
  endDate?: Date;
  access?: TestAccessType;
  anonymous?: boolean;

  questions: CreateQuestion[];

  limitedByTime?: boolean;
  timeLimit?: number;
  minimumScore?: number;
}

export interface TestCreateStoreSchema extends TestCreate {
  errors: Partial<Record<keyof TestCreate, string>>;
}

export interface Test {
  name?: string;
  description?: string;
  passedMessage?: string;
  failedMessage?: string;
  showScoreToUser?: boolean;

  startDate?: Date;
  endDate?: Date;
  access?: TestAccessType;
  anonymous?: boolean;

  questions: Question[];

  limitedByTime?: boolean;
  timeLimit?: number;
  minimumScore?: number;
}
