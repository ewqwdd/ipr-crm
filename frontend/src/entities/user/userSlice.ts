import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserStoreSchema } from './types/types';

const initialState: UserStoreSchema = {
  user: null,
  isMounted: false,
  isAdmin: false,
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
      state.isAdmin = action.payload?.role.name === 'admin';
    },
    setNotificationRead: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.notifications = state.user.notifications.map(
          (notification) => {
            if (notification.id === action.payload) {
              return { ...notification, watched: true };
            }
            return notification;
          },
        );
      }
    },
    setIsAdmin: (state, action: PayloadAction<boolean>) => {
      state.isAdmin = action.payload;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
