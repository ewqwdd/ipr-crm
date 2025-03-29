import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Answer, TestAssesmentStoreSchema } from './types/types';

const initialState: TestAssesmentStoreSchema = {
  screen: -1,
  answers: {},
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
  },
});

export const testAssesmentActions = testAssesmentSlice.actions;
export const testAssesmentReducer = testAssesmentSlice.reducer;
