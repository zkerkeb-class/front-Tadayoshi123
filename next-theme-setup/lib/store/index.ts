import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import dashboardSlice from "./slices/dashboardSlice"
import aiSlice from "./slices/aiSlice"
import metricsSlice from "./slices/metricsSlice"
import paymentSlice from "./slices/paymentSlice"
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    ai: aiSlice,
    metrics: metricsSlice,
    payment: paymentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
