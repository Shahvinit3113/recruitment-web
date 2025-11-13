import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { httpClient } from "@/api";
import type { AxiosRequestConfig } from "axios";
import { TokenService } from "@/api/services/TokenService";
import type { Result } from "@/api/types";
import type { templateItem, TemplateResponse } from "@/api/types/template";

// 🔹 Request payloads
export interface TemplateRequest {
    PageIndex: number;
    PageSize: number;
    SortBy?: string | null;
    Filter?: string | null;
}

export interface CreateTemplateRequest {
    Name: string;
    Description: string;
    DepartmentId?: string;
    Status?: string;
}

export interface UpdatePositionRequest extends CreateTemplateRequest {
    Uid: string;
}

// 🔹 Redux state
export interface TemplateState {
    data: templateItem[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: TemplateState = {
    data: [],
    totalCount: 0,
    loading: false,
    error: null,
};

// 🔹 Fetch All Positions
export const fetchAllTemplates = createAsyncThunk<
    Result<templateItem>,
    TemplateRequest,
    { rejectValue: { Message: string } }
>("formtemplate/fetchAll", async (params, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<TemplateResponse>(
            "/formtemplate/all",
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

// 🔹 Create Template
export const createTemplate = createAsyncThunk<
    templateItem,
    CreateTemplateRequest,
    { rejectValue: { Message: string } }
>("formtemplate/create", async (payload, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<TemplateResponse>(
            "/formtemplate",
            payload,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to create template");
        }

        const createdPosition = result.Model?.Entity || result.Model;
        toast.success("Template created successfully");
        return createdPosition as templateItem;
    } catch (error: any) {
        console.error("Create template failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to create template" }
        );
    }
});

// 🔹 Update Template
export const updateTemplate = createAsyncThunk<
    templateItem,
    UpdatePositionRequest,
    { rejectValue: { Message: string } }
>("formtemplate/update", async (payload, { rejectWithValue }) => {
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

        const response = await httpClient.put<TemplateResponse>(
            `/formtemplate/${Uid}`,
            updateData,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to update template");
        }

        const updatedPosition = result.Model?.Entity || result.Model;
        toast.success("Template updated successfully");
        return updatedPosition as templateItem;
    } catch (error: any) {
        console.error("Update template failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to update template" }
        );
    }
});

// 🔹 Delete Template
export const deleteTemplate = createAsyncThunk<
    string,
    string,
    { rejectValue: { Message: string } }
>("formtemplate/delete", async (Uid, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        };

        const response = await httpClient.delete(`/formtemplate/${Uid}`, config);
        const result = response as any;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to delete template");
        }

        toast.success("Template deleted successfully");
        return Uid;
    } catch (error: any) {
        console.error("Delete template failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to delete template" }
        );
    }
});

// 🔹 Slice
const templateSlice = createSlice({
    name: "template",
    initialState,
    reducers: {
        clearPositions(state) {
            state.data = [];
            state.totalCount = 0;
            toast.info("Template data cleared");
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.Records;
                state.totalCount = action.payload.TotalRecords;
                toast.success("Positions loaded successfully");
            })
            .addCase(fetchAllTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to load positions";
                toast.error(state.error);
            })

            // Create Template
            .addCase(createTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.data.unshift(action.payload);
                toast.success("Template added to list");
            })
            .addCase(createTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to create template";
                toast.error(state.error);
            })

            // Update Template
            .addCase(updateTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex((p) => p.Uid === action.payload.Uid);
                if (index !== -1) state.data[index] = action.payload;
                toast.success("Template updated in list");
            })
            .addCase(updateTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to update template";
                toast.error(state.error);
            })

            // Delete Position
            .addCase(deleteTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter((p) => p.Uid !== action.payload);
                toast.success("Template removed from list");
            })
            .addCase(deleteTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to delete template";
                toast.error(state.error);
            });
    },
});

export const { clearPositions } = templateSlice.actions;
export default templateSlice.reducer;
