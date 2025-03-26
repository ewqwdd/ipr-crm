import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CreateQuestion,
  TestCreate,
  TestCreateStoreSchema,
} from './types/types';

const initialState: TestCreateStoreSchema = {
  errors: {},
  startDate: new Date(),
  questions: [],
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
      state.questions[index].options?.push({ value: '' });
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
    setErrors(state, action: PayloadAction<TestCreateStoreSchema['errors']>) {
      state.errors = action.payload;
    },
    setQuestionError(
      state,
      action: PayloadAction<{ index: number; error: string }>,
    ) {
      state.questions[action.payload.index].error = action.payload.error;
    },
    clear(state) {
      Object.keys(state).forEach((key) => {
        delete state[key as keyof TestCreateStoreSchema];
      });
      state.errors = {};
      state.questions = [];
      state.startDate = new Date();
    },
  },
});

export const testCreateActions = testCreateSlice.actions;
export const testCreateReducer = testCreateSlice.reducer;
