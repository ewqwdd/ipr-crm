import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserStoreSchema } from './types/types';

const initialState: UserStoreSchema = {
  user: null,
  isMounted: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setMounted: (state, action: PayloadAction<boolean>) => {
      state.isMounted = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isMounted = true;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
