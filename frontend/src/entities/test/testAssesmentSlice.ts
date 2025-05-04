import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Answer, AssignedTest, TestAssesmentStoreSchema } from './types/types';

const initialState: TestAssesmentStoreSchema = {
  screen: -1,
  answers: {},
  errors: {},
  answerLoading: [],
};

const testAssesmentSlice = createSlice({
  name: 'testAssesment',
  initialState,
  reducers: {
    setScreen(state, action: PayloadAction<number>) {
      state.screen = action.payload;
    },
    setAnswer(state, action: PayloadAction<{ index: number; value: Answer }>) {
      state.answers[action.payload.index] = action.payload.value;
    },
    clear(state) {
      state.screen = -1;
      state.answers = {};
    },
    initAnswers(state, action: PayloadAction<AssignedTest>) {
      const { test, answeredQUestions } = action.payload;
      state.answers = answeredQUestions.reduce(
        (acc, question) => {
          const questionIndex = test.testQuestions.findIndex(
            (q) => q.id === question.questionId,
          );
          if (questionIndex !== -1) {
            acc[questionIndex] = {
              numberAnswer: question.numberAnswer?.toString(),
              textAnswer: question.textAnswer,
              optionAnswer: question.options.map((option) => option.optionId),
            };
          }
          return acc;
        },
        {} as Record<number, Answer>,
      );
    },
    setError(state, action: PayloadAction<{ index: number; error?: string }>) {
      if (action.payload.error === undefined) {
        delete state.errors[action.payload.index];
      } else {
        state.errors[action.payload.index] = action.payload.error;
      }
    },
    addAnswerLoading(state, action: PayloadAction<number>) {
      state.answerLoading.push(action.payload);
    },
    removeAnswerLoading(state, action: PayloadAction<number>) {
      state.answerLoading = state.answerLoading.filter(
        (id) => id !== action.payload,
      );
    },
  },
});

export const testAssesmentActions = testAssesmentSlice.actions;
export const testAssesmentReducer = testAssesmentSlice.reducer;
