import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CreateSurveyQuestion,
  Survey,
  SurveyCreate,
  SurveyCreateStoreSchema,
} from './types/types';

const initialState: SurveyCreateStoreSchema = {
  errors: {},
  startDate: new Date(),
  surveyQuestions: [],
};

const ifMaxMinToggle = (question: CreateSurveyQuestion) => {
  if (question.type === 'NUMBER') {
    return !!question.maxNumber || !!question.minNumber;
  }
  return false;
};

const surveyCreateSlice = createSlice({
  name: 'surveyCreate',
  initialState,
  reducers: {
    setField<T extends keyof SurveyCreate>(
      state: SurveyCreateStoreSchema,
      action: PayloadAction<{ field: T; value: SurveyCreateStoreSchema[T] }>,
    ) {
      state[action.payload.field] = action.payload.value;
      state.errors[action.payload.field] = undefined;
    },
    setError(
      state,
      action: PayloadAction<{
        field: keyof SurveyCreateStoreSchema['errors'];
        error?: string;
      }>,
    ) {
      state.errors[action.payload.field] = action.payload.error;
    },
    addQuestion(state) {
      state.surveyQuestions.push({
        type: 'SINGLE',
        label: '',
        required: false,
        scaleDots: 1,
      });
      state.errors.surveyQuestions = undefined;
    },
    setQuestionField<T extends keyof CreateSurveyQuestion>(
      state: SurveyCreateStoreSchema,
      action: PayloadAction<{
        field: T;
        value: CreateSurveyQuestion[T];
        index: number;
      }>,
    ) {
      const { field, index, value } = action.payload;
      state.surveyQuestions[index][field] = value;
      if (field === 'type') {
        if (value === 'SINGLE') {
          state.surveyQuestions[index].options = state.surveyQuestions[
            index
          ].options?.map((option) => ({ ...option, isCorrect: false }));
        } else if (value === 'NUMBER' || value === 'TEXT') {
          delete state.surveyQuestions[index].options;
        }
      }
      state.surveyQuestions[index].error = undefined;
      state.errors.surveyQuestions = undefined;
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
      if (!state.surveyQuestions[index]?.options?.[optionIndex]) return;
      state.surveyQuestions[index].options[optionIndex].value =
        action.payload.value;
      state.surveyQuestions[index].error = undefined;
      state.errors.surveyQuestions = undefined;
    },
    setErrors(state, action: PayloadAction<SurveyCreateStoreSchema['errors']>) {
      state.errors = action.payload;
    },
    setQuestionError(
      state,
      action: PayloadAction<{ index: number; error: string }>,
    ) {
      state.surveyQuestions[action.payload.index].error = action.payload.error;
    },
    deleteQuestion(state, action: PayloadAction<{ index: number }>) {
      const { index } = action.payload;
      if (state.surveyQuestions[index]) {
        state.surveyQuestions.splice(index, 1);
        state.errors.surveyQuestions = undefined;
      }
    },
    deleteOption(
      state,
      action: PayloadAction<{ index: number; optionIndex: number }>,
    ) {
      const { index, optionIndex } = action.payload;
      if (!state.surveyQuestions[index]?.options?.[optionIndex]) return;
      state.surveyQuestions[index].options.splice(optionIndex, 1);
    },
    addOption(state, action: PayloadAction<{ index: number }>) {
      const index = action.payload.index;
      if (!state.surveyQuestions[index].options) {
        state.surveyQuestions[index].options = [];
      }
      state.surveyQuestions[index].options?.push({ value: '' });
      state.surveyQuestions[index].error = undefined;
      state.errors.surveyQuestions = undefined;
    },
    clear(state) {
      Object.keys(state).forEach((key) => {
        delete state[key as keyof SurveyCreateStoreSchema];
      });
      state.errors = {};
      state.surveyQuestions = [];
      state.startDate = new Date();
    },
    init(state, action: PayloadAction<{ survey: Survey }>) {
      const { survey } = action.payload;
      state.id = survey.id;
      state.name = survey.name;
      state.description = survey.description;
      state.startDate = survey.startDate
        ? new Date(survey.startDate)
        : new Date();
      state.endDate = survey.endDate ? new Date(survey.endDate) : undefined;
      state.access = survey.access;
      state.anonymous = survey.anonymous;
      state.finishMessage = survey.finishMessage;

      state.surveyQuestions = survey.surveyQuestions.map((question) => ({
        ...question,
        error: undefined,
        maxMinToggle: ifMaxMinToggle(question),
        options: question.options?.map((option) => ({
          ...option,
        })),
      }));
    },
  },
});

export const surveyCreateReducer = surveyCreateSlice.reducer;
export const surveyCreateActions = surveyCreateSlice.actions;
