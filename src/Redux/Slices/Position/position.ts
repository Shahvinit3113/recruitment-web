import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { httpClient } from "@/api";
import type { AxiosRequestConfig } from "axios";
import { TokenService } from "@/api/services/TokenService";
import type { Result } from "@/api/types";
import type { positionItem, PositionResponse } from "@/api/types/position";

// 🔹 Request payloads
export interface PositionRequest {
    PageIndex: number;
    PageSize: number;
    SortBy?: string | null;
    Filter?: string | null;
}

export interface CreatePositionRequest {
    Name: string;
    Description: string;
    DepartmentId?: string;
    Status?: string;
}

export interface UpdatePositionRequest extends CreatePositionRequest {
    Uid: string;
}

// 🔹 Redux state
export interface PositionState {
    data: positionItem[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: PositionState = {
    data: [],
    totalCount: 0,
    loading: false,
    error: null,
};

// 🔹 Fetch All Positions
export const fetchAllPositions = createAsyncThunk<
    Result<positionItem>,
    PositionRequest,
    { rejectValue: { Message: string } }
>("position/fetchAll", async (params, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<PositionResponse>(
            "/position/all",
            params,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to fetch positions");
        }

        return result.Model.Result;
    } catch (error: any) {
        console.error("Fetch positions failed:", error);
        return rejectWithValue(error?.response?.data || { Message: "Request failed" });
    }
});

// 🔹 Create Position
export const createPosition = createAsyncThunk<
    positionItem,
    CreatePositionRequest,
    { rejectValue: { Message: string } }
>("position/create", async (payload, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<PositionResponse>(
            "/position",
            payload,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to create position");
        }

        const createdPosition = result.Model?.Entity || result.Model;
        toast.success("Position created successfully");
        return createdPosition as positionItem;
    } catch (error: any) {
        console.error("Create position failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to create position" }
        );
    }
});

// 🔹 Update Position
export const updatePosition = createAsyncThunk<
    positionItem,
    UpdatePositionRequest,
    { rejectValue: { Message: string } }
>("position/update", async (payload, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const { Uid, ...updateData } = payload;

        const response = await httpClient.put<PositionResponse>(
            `/position/${Uid}`,
            updateData,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to update position");
        }

        const updatedPosition = result.Model?.Entity || result.Model;
        toast.success("Position updated successfully");
        return updatedPosition as positionItem;
    } catch (error: any) {
        console.error("Update position failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to update position" }
        );
    }
});

// 🔹 Delete Position
export const deletePosition = createAsyncThunk<
    string, // ✅ Return deleted position Uid
    string, // ✅ Payload = Uid
    { rejectValue: { Message: string } }
>("position/delete", async (Uid, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        };

        const response = await httpClient.delete(`/position/${Uid}`, config);
        const result = response as any;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to delete position");
        }

        toast.success("Position deleted successfully");
        return Uid;
    } catch (error: any) {
        console.error("Delete position failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to delete position" }
        );
    }
});

// 🔹 Slice
const positionSlice = createSlice({
    name: "position",
    initialState,
    reducers: {
        clearPositions(state) {
            state.data = [];
            state.totalCount = 0;
            toast.info("Position data cleared");
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllPositions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPositions.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.Records;
                state.totalCount = action.payload.TotalRecords;
                toast.success("Positions loaded successfully");
            })
            .addCase(fetchAllPositions.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to load positions";
                toast.error(state.error);
            })

            // Create Position
            .addCase(createPosition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPosition.fulfilled, (state, action) => {
                state.loading = false;
                state.data.unshift(action.payload);
                toast.success("Position added to list");
            })
            .addCase(createPosition.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to create position";
                toast.error(state.error);
            })

            // Update Position
            .addCase(updatePosition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePosition.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex((p) => p.Uid === action.payload.Uid);
                if (index !== -1) state.data[index] = action.payload;
                toast.success("Position updated in list");
            })
            .addCase(updatePosition.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to update position";
                toast.error(state.error);
            })

            // Delete Position
            .addCase(deletePosition.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePosition.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter((p) => p.Uid !== action.payload);
                toast.success("Position removed from list");
            })
            .addCase(deletePosition.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to delete position";
                toast.error(state.error);
            });
    },
});

export const { clearPositions } = positionSlice.actions;
export default positionSlice.reducer;
