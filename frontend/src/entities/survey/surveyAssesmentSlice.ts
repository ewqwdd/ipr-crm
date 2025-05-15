import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AssignedSurvey,
  StoreAnswer,
  SurveyAssesmentStoreSchema,
} from './types/types';

const initialState: SurveyAssesmentStoreSchema = {
  screen: -1,
  answers: {},
  errors: {},
};

const surveyAssesmentSlice = createSlice({
  name: 'surveyAssesment',
  initialState,
  reducers: {
    setScreen(state, action: PayloadAction<number>) {
      state.screen = action.payload;
    },
    setAnswer(
      state,
      action: PayloadAction<{ index: number; value: StoreAnswer }>,
    ) {
      state.answers[action.payload.index] = action.payload.value;
    },
    clear(state) {
      state.screen = -1;
      state.answers = {};
    },
    initAnswers(state, action: PayloadAction<AssignedSurvey>) {
      const { survey, answeredQUestions } = action.payload;
      state.answers =
        answeredQUestions?.reduce(
          (acc, question) => {
            const questionIndex = survey.surveyQuestions.findIndex(
              (q) => q.id === question.surveyQuestionId,
            );

            if (questionIndex !== -1) {
              acc[questionIndex] = {
                numberAnswer: question.numberAnswer?.toString(),
                textAnswer: question.textAnswer,
                optionAnswer: question.options.map((option) => option.optionId),
                dateAnswer: question.dateAnswer?.toString(),
                fileAnswer: question.fileAnswer ? true : undefined,
                phoneAnswer: question.phoneAnswer?.toString(),
                timeAnswer: question.timeAnswer?.toString(),
                scaleAnswer: question.scaleAnswer,
              };
            }
            return acc;
          },
          {} as Record<number, StoreAnswer>,
        ) ?? {};
    },
    setError(state, action: PayloadAction<{ index: number; error?: string }>) {
      if (action.payload.error === undefined) {
        delete state.errors[action.payload.index];
      } else {
        state.errors[action.payload.index] = action.payload.error;
      }
    },
  },
});

export const surveyAssesmentActions = surveyAssesmentSlice.actions;
export const surveyAssesmentReducer = surveyAssesmentSlice.reducer;
