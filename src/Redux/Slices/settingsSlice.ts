import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";

interface SettingsState {
    componentSize: ComponentSize;
}

const initialState: SettingsState = {
    componentSize: "md",
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setComponentSize: (state, action: PayloadAction<ComponentSize>) => {
            state.componentSize = action.payload;
        },
    },
});

export const { setComponentSize } = settingsSlice.actions;
export default settingsSlice.reducer;