// src/store/slices/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { httpClient, tokenService } from "@/api";

interface LoginCredentials {
    Email: string;
    Password: string;
}

interface LoginResponse {
    Status: number;
    Message: string;
    Model: {
        AccessToken: string;
        RefreshToken: string;
        [key: string]: any;
    };
}

interface AuthState {
    user: LoginResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await httpClient.post<LoginResponse>("/auth/login", credentials);

            if (response.Status === 200) {
                const { AccessToken, RefreshToken } = response.Model;

                tokenService.setTokens(AccessToken, RefreshToken);
            }

            return response;
        } catch (error: any) {
            return rejectWithValue(error?.response?.data || { Message: "Login failed" });
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            tokenService.clearTokens();
            toast.info("Logged out");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                toast.success(action.payload?.Message || "Login successful");
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Login failed";
                toast.error(state.error);
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
