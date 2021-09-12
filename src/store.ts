import { configureStore } from "@reduxjs/toolkit";
import rapReducer from "./features/rap/rapSlice";
import geocodeReducer from "./features/geocode/geocodeSlice";
import userReducer from "./features/user/userSlice";

export const store = createStore();

export function createStore() {
  return configureStore({
    reducer: {
      rap: rapReducer,
      geocode: geocodeReducer,
      user: userReducer,
    },
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
