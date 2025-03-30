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
  id: number;
  value: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
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

export interface CreateQuestion extends Omit<Question, 'id' | 'options'> {
  error?: string;
  options?: Omit<TestOption, 'id'>[];
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

export interface Answer {
  textAnswer?: string;
  numberAnswer?: string;
  optionAnswer?: number[];
}

export interface TestAssesmentStoreSchema {
  screen: number;
  answers: Record<number, Answer>;
}
export interface Test {
  id: number;
  hidden?: boolean;
  name?: string;
  description?: string;
  passedMessage?: string;
  failedMessage?: string;
  showScoreToUser?: boolean;

  startDate?: Date;
  endDate?: Date;
  access?: TestAccessType;
  anonymous?: boolean;

  testQuestions: Question[];

  limitedByTime?: boolean;
  timeLimit?: number;
  minimumScore?: number;
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
}
