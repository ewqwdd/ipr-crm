import { userReducer } from '@/entities/user'
import { rate360Api } from '@/shared/api/rate360Api'
import { teamsApi } from '@/shared/api/teamsApi'
import { universalApi } from '@/shared/api/universalApi'
import { usersApi } from '@/shared/api/usersApi'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  user: userReducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [universalApi.reducerPath]: universalApi.reducer,
  [teamsApi.reducerPath]: teamsApi.reducer,
  [rate360Api.reducerPath]: rate360Api.reducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware).concat(universalApi.middleware).concat(teamsApi.middleware).concat(rate360Api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
