import { configureStore } from '@reduxjs/toolkit';
import mowerReducer from './mowerSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    mower: mowerReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;