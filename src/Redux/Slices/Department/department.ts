import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { httpClient } from "@/api";
import type { AxiosRequestConfig } from "axios";
import { TokenService } from "@/api/services/TokenService";
import type { Result } from "@/api/types";
import type {
    departmentItem,
    DepartmentResponse,
} from "@/api/types/department";

// 🔹 Request payloads
export interface DepartmentRequest {
    PageIndex: number;
    PageSize: number;
    SortBy?: string | null;
    Filter?: string | null;
}

export interface CreateDepartmentRequest {
    Name: string;
    Description: string;
}

export interface UpdateDepartmentRequest extends CreateDepartmentRequest {
    Uid: string;
}

// 🔹 Redux state
export interface DepartmentState {
    data: departmentItem[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: DepartmentState = {
    data: [],
    totalCount: 0,
    loading: false,
    error: null,
};

// 🔹 Fetch All Departments
export const fetchAllDepartments = createAsyncThunk<
    Result<departmentItem>,
    DepartmentRequest,
    { rejectValue: { Message: string } }
>("department/fetchAll", async (params, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<DepartmentResponse>(
            "/department/all",
            params,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to fetch departments");
        }

        return result.Model.Result;
    } catch (error: any) {
        console.error("Fetch departments failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Request failed" }
        );
    }
});

// 🔹 Create Department
export const createDepartment = createAsyncThunk<
    departmentItem,
    CreateDepartmentRequest,
    { rejectValue: { Message: string } }
>("department/create", async (payload, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<DepartmentResponse>(
            "/department",
            payload,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to create department");
        }

        const createdDepartment = result.Model?.Entity || result.Model;
        toast.success("Department created successfully");
        return createdDepartment as departmentItem;
    } catch (error: any) {
        console.error("Create department failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to create department" }
        );
    }
});

// 🔹 Update Department
export const updateDepartment = createAsyncThunk<
    departmentItem,
    UpdateDepartmentRequest,
    { rejectValue: { Message: string } }
>("department/update", async (payload, { rejectWithValue }) => {
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

        const response = await httpClient.put<DepartmentResponse>(
            `/department/${Uid}`,
            updateData,
            config
        );
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to update department");
        }

        const updatedDepartment = result.Model?.Entity || result.Model;
        toast.success("Department updated successfully");
        return updatedDepartment as departmentItem;
    } catch (error: any) {
        console.error("Update department failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to update department" }
        );
    }
});

// 🔹 Delete Department
export const deleteDepartment = createAsyncThunk<
    string, // ✅ Return deleted department Uid
    string, // ✅ Payload = Uid
    { rejectValue: { Message: string } }
>("department/delete", async (Uid, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        };

        const response = await httpClient.delete(`/department/${Uid}`, config);
        const result = response as any;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to delete department");
        }

        toast.success("Department deleted successfully");
        return Uid;
    } catch (error: any) {
        console.error("Delete department failed:", error);
        return rejectWithValue(
            error?.response?.data || { Message: "Failed to delete department" }
        );
    }
});

// 🔹 Slice
const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {
        clearDepartments(state) {
            state.data = [];
            state.totalCount = 0;
            toast.info("Department data cleared");
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllDepartments.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.Records;
                state.totalCount = action.payload.TotalRecords;
                toast.success("Departments loaded successfully");
            })
            .addCase(fetchAllDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to load departments";
                toast.error(state.error);
            })

            // Create Department
            .addCase(createDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.data.unshift(action.payload);
                toast.success("Department added to list");
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to create department";
                toast.error(state.error);
            })

            // Update Department
            .addCase(updateDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex(
                    (d) => d.Uid === action.payload.Uid
                );
                if (index !== -1) state.data[index] = action.payload;
                toast.success("Department updated in list");
            })
            .addCase(updateDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to update department";
                toast.error(state.error);
            })

            // Delete Department
            .addCase(deleteDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter((d) => d.Uid !== action.payload);
                toast.success("Department removed from list");
            })
            .addCase(deleteDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to delete department";
                toast.error(state.error);
            });
    },
});

export const { clearDepartments } = departmentSlice.actions;
export default departmentSlice.reducer;
