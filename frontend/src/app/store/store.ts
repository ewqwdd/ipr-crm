import { userReducer } from '@/entities/user'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({ user: userReducer })

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
