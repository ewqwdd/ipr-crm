import { userReducer } from '@/entities/user';
import { rate360Api } from '@/shared/api/rate360Api';
import { skillsApi } from '@/shared/api/skillsApi';
import { teamsApi } from '@/shared/api/teamsApi';
import { universalApi } from '@/shared/api/universalApi';
import { usersApi } from '@/shared/api/usersApi';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { modalReducer } from './modalSlice';
import { ratesReducer } from '@/entities/rates';
import { iprApi } from '@/shared/api/iprApi';
import { boardReducer } from '@/entities/ipr';
import { loadingReducer } from './loadingSlice';

const rootReducer = combineReducers({
  user: userReducer,
  modal: modalReducer,
  loading: loadingReducer,
  rates: ratesReducer,
  board: boardReducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [universalApi.reducerPath]: universalApi.reducer,
  [teamsApi.reducerPath]: teamsApi.reducer,
  [rate360Api.reducerPath]: rate360Api.reducer,
  [skillsApi.reducerPath]: skillsApi.reducer,
  [iprApi.reducerPath]: iprApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(universalApi.middleware)
      .concat(teamsApi.middleware)
      .concat(rate360Api.middleware)
      .concat(skillsApi.middleware)
      .concat(iprApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
