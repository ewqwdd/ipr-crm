import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CreateQuestion,
  Test,
  TestCreate,
  TestCreateStoreSchema,
} from './types/types';

const initialState: TestCreateStoreSchema = {
  errors: {},
  startDate: new Date(),
  questions: [],
};

const ifCorrectRequired = (question: CreateQuestion) => {
  if (question.type === 'SINGLE' || question.type === 'MULTIPLE') {
    return question.options?.some((option) => option.isCorrect);
  }
  if (question.type === 'NUMBER') {
    return !!question.numberCorrectValue || question.numberCorrectValue === 0;
  }
  if (question.type === 'TEXT') {
    return !!question.textCorrectValue;
  }
  return false;
};

const ifMaxMinToggle = (question: CreateQuestion) => {
  if (question.type === 'NUMBER') {
    return !!question.maxNumber || !!question.minNumber;
  }
  if (question.type === 'TEXT') {
    return Number.isInteger(question.maxLength);
  }
  return false;
};

const testCreateSlice = createSlice({
  name: 'testCreate',
  initialState,
  reducers: {
    setField<T extends keyof TestCreate>(
      state: TestCreateStoreSchema,
      action: PayloadAction<{ field: T; value: TestCreateStoreSchema[T] }>,
    ) {
      state[action.payload.field] = action.payload.value;
      state.errors[action.payload.field] = undefined;
    },
    setError(
      state,
      action: PayloadAction<{
        field: keyof TestCreateStoreSchema['errors'];
        error?: string;
      }>,
    ) {
      state.errors[action.payload.field] = action.payload.error;
    },
    addQuestion(state) {
      state.questions.push({
        type: 'SINGLE',
        label: '',
        required: false,
        score: 0,
      });
      state.errors.questions = undefined;
    },
    setQuestionField<T extends keyof CreateQuestion>(
      state: TestCreateStoreSchema,
      action: PayloadAction<{
        field: T;
        value: CreateQuestion[T];
        index: number;
      }>,
    ) {
      const { field, index, value } = action.payload;
      state.questions[index][field] = value;
      if (field === 'type') {
        if (value === 'SINGLE') {
          state.questions[index].options = state.questions[index].options?.map(
            (option) => ({ ...option, isCorrect: false }),
          );
        } else if (value === 'NUMBER' || value === 'TEXT') {
          delete state.questions[index].options;
        }
      }
      state.questions[index].error = undefined;
      state.errors.questions = undefined;
    },
    setOptionName(
      state,
      action: PayloadAction<{
        index: number;
        optionIndex: number;
        value: string;
      }>,
    ) {
      const { index, optionIndex } = action.payload;
      if (!state.questions[index]?.options?.[optionIndex]) return;
      state.questions[index].options[optionIndex].value = action.payload.value;
      state.questions[index].error = undefined;
      state.errors.questions = undefined;
    },
    setOptionIsCorrect(
      state,
      action: PayloadAction<{
        index: number;
        optionIndex: number;
        value: boolean;
      }>,
    ) {
      const { index, optionIndex } = action.payload;
      if (!state.questions[index]?.options?.[optionIndex]) return;
      const options = state.questions[index].options;
      if (state.questions[index].type === 'SINGLE') {
        state.questions[index].options = options.map((option) => ({
          ...option,
          isCorrect: false,
        }));
        state.questions[index].error = undefined;
        state.errors.questions = undefined;
      }
      state.questions[index].options[optionIndex].isCorrect =
        action.payload.value;
    },
    deleteOption(
      state,
      action: PayloadAction<{ index: number; optionIndex: number }>,
    ) {
      const { index, optionIndex } = action.payload;
      if (!state.questions[index]?.options?.[optionIndex]) return;
      state.questions[index].options.splice(optionIndex, 1);
    },
    addOption(state, action: PayloadAction<{ index: number }>) {
      const index = action.payload.index;
      if (!state.questions[index].options) {
        state.questions[index].options = [];
      }
      state.questions[index].options?.push({ value: '', score: 0 });
      state.questions[index].error = undefined;
      state.errors.questions = undefined;
    },
    clearCorrectOptions(state, action: PayloadAction<number>) {
      const question = state.questions[action.payload];
      if (question.type === 'SINGLE' || question.type === 'MULTIPLE') {
        question.options = question.options?.map((option) => ({
          ...option,
          isCorrect: false,
        }));
      } else if (question.type === 'NUMBER') {
        delete question.numberCorrectValue;
      } else if (question.type === 'TEXT') {
        delete question.textCorrectValue;
      }
    },
    setOptionScore(
      state,
      action: PayloadAction<{
        questionIndex: number;
        optionIndex: number;
        value: number | undefined;
      }>,
    ) {
      const { questionIndex, optionIndex } = action.payload;
      if (!state.questions[questionIndex]?.options?.[optionIndex]) return;
      state.questions[questionIndex].options[optionIndex].score =
        action.payload.value;
      state.questions[questionIndex].error = undefined;
      state.errors.questions = undefined;
    },
    setErrors(state, action: PayloadAction<TestCreateStoreSchema['errors']>) {
      state.errors = action.payload;
    },
    setQuestionError(
      state,
      action: PayloadAction<{ index: number; error: string }>,
    ) {
      state.questions[action.payload.index].error = action.payload.error;
    },
    deleteQuestion(state, action: PayloadAction<{ index: number }>) {
      const { index } = action.payload;
      if (state.questions[index]) {
        state.questions.splice(index, 1);
        state.errors.questions = undefined;
      }
    },
    clear(state) {
      Object.keys(state).forEach((key) => {
        delete state[key as keyof TestCreateStoreSchema];
      });
      state.errors = {};
      state.questions = [];
      state.startDate = new Date();
    },
    init(state, action: PayloadAction<{ test: Test }>) {
      const { test } = action.payload;
      state.id = test.id;
      state.name = test.name;
      state.description = test.description;
      state.passedMessage = test.passedMessage;
      state.failedMessage = test.failedMessage;
      state.showScoreToUser = test.showScoreToUser;
      state.startDate = test.startDate ? new Date(test.startDate) : new Date();
      state.endDate = test.endDate ? new Date(test.endDate) : undefined;
      state.access = test.access;
      state.anonymous = test.anonymous;
      state.minimumScore = test.minimumScore;
      state.limitedByTime = test.limitedByTime;
      state.timeLimit = test.timeLimit;

      state.questions = test.testQuestions.map((question) => ({
        ...question,
        error: undefined,
        maxMinToggle: ifMaxMinToggle(question),
        correctRequired: ifCorrectRequired(question),
        options: question.options?.map((option) => ({
          ...option,
          isCorrect: option.isCorrect ?? false,
        })),
      }));
    },
    changeQuestionOrder: (
      state: TestCreateStoreSchema,
      action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>,
    ) => {
      const { sourceIndex, destinationIndex } = action.payload;
      if (
        sourceIndex < 0 ||
        destinationIndex < 0 ||
        sourceIndex >= state.questions.length ||
        destinationIndex >= state.questions.length ||
        sourceIndex === destinationIndex
      ) {
        return;
      }
      const [movedQuestion] = state.questions.splice(sourceIndex, 1);
      state.questions.splice(destinationIndex, 0, movedQuestion);
    },
  },
});

export const testCreateActions = testCreateSlice.actions;
export const testCreateReducer = testCreateSlice.reducer;
