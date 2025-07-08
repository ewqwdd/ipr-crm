import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserStoreSchema } from './types/types';
import { teamsApi } from '@/shared/api/teamsApi';
import { usersApi } from '@/shared/api/usersApi/usersApi';

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
    setUser: (
      state,
      action: PayloadAction<UserStoreSchema['user'] | User | null>,
    ) => {
      if (!action.payload) {
        state.user = null;
        return;
      }
      const user = action.payload as UserStoreSchema['user'];
      console.debug('setUser', user);
      if (!user!.teamAccess) {
        user!.teamAccess = state.user?.teamAccess ?? [];
      }

      state.user = user;
      state.isMounted = true;
      state.isAdmin = action.payload?.role.name === 'admin';
    },
    setNotificationRead: (state, action: PayloadAction<number[]>) => {
      if (state.user) {
        state.user.notifications = state.user.notifications.map(
          (notification) => {
            if (action.payload.includes(notification.id)) {
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
    setNotifications: (state, action: PayloadAction<User['notifications']>) => {
      if (state.user) {
        state.user.notifications = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      teamsApi.endpoints.getTeams.matchFulfilled,
      (state, action) => {
        const { teamAccess } = action.payload;
        if (state.user) {
          state.user.teamAccess = teamAccess;
        }
      },
    );
    builder.addMatcher(
      usersApi.endpoints.setDeputy.matchFulfilled,
      (state, action) => {
        if (
          state.user &&
          action.meta.arg.originalArgs.userId === state.user.id
        ) {
          state.user.deputyRelationsAsUser.push({
            deputy: action.payload.deputy,
          });
        } else if (
          state.user &&
          action.meta.arg.originalArgs.deputyId === state.user.id
        ) {
          state.user.deputyRelationsAsDeputy.push({
            user: action.payload.user,
          });
        }
      },
    );
    builder.addMatcher(
      usersApi.endpoints.removeDeputy.matchFulfilled,
      (state, action) => {
        if (
          state.user &&
          state.user.id === action.meta.arg.originalArgs.userId
        ) {
          state.user.deputyRelationsAsUser =
            state.user.deputyRelationsAsUser.filter(
              (deputy) =>
                deputy.deputy.id !== action.meta.arg.originalArgs.deputyId,
            );
        } else if (
          state.user &&
          state.user.id === action.meta.arg.originalArgs.deputyId
        ) {
          state.user.deputyRelationsAsDeputy =
            state.user.deputyRelationsAsDeputy.filter(
              (deputy) =>
                deputy.user.id !== action.meta.arg.originalArgs.userId,
            );
        }
      },
    );
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
