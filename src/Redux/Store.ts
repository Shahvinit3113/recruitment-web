import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import organizationReducer from "./Slices/Organization/organization";
import settingsReducer from "./Slices/settingsSlice";
import taskReducer from "./Slices/Task/task";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    settings: settingsReducer,
    task: taskReducer,
  },
});

// 🔹 Typed hooks support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
