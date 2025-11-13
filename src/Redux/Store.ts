import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import organizationReducer from "./Slices/Organization/organization";
import settingsReducer from "./Slices/settingsSlice";
import taskReducer from "./Slices/Task/task";
import positionReducer from "./Slices/Position/position";
import departmentReducer from "./Slices/Department/department";
import templateReducer from "./Slices/Template/template";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    settings: settingsReducer,
    task: taskReducer,
    position: positionReducer,
    department: departmentReducer,
    template: templateReducer,
  },
});

// 🔹 Typed hooks support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
