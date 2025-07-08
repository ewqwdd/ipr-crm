export const questionTypes = ['SINGLE', 'MULTIPLE', 'NUMBER', 'TEXT'] as const;

export const testAccessTypes = ['PUBLIC', 'PRIVATE', 'LINK_ONLY'];

export const questionTypeLabels: Record<QuestionType, string> = {
  SINGLE: 'Единичний выбор',
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
  score?: number;
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
  score?: number;
  photoUrl?: string;
}

interface CreateOption extends Omit<TestOption, 'id'> {
  id?: number;
}

export interface CreateQuestion extends Omit<Question, 'id' | 'options'> {
  id?: number;
  correctRequired?: boolean;
  error?: string;
  options?: CreateOption[];
  maxMinToggle?: boolean;
}

export interface TestCreate {
  id?: number;
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
  shuffleQuestions?: boolean;
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
  errors: Record<number, string>;
  answerLoading: number[];
}
export interface Test {
  id: number;
  hidden?: boolean;
  name?: string;
  archived?: boolean;
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
  shuffleQuestions?: boolean;

  usersAssigned: AssignedTest[];
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
  startDate: string;
  endDate: string | null;
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
