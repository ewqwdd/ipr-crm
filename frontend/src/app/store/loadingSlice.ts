import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const selectLoading = (state: { loading: { isLoading: boolean } }) =>
  state.loading.isLoading;
export const { showLoading, hideLoading } = loadingSlice.actions;
export const loadingReducer = loadingSlice.reducer;
