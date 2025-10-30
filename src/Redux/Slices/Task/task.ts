import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { httpClient } from "@/api";
import type { AxiosRequestConfig } from "axios";
import { TokenService } from "@/api/services/TokenService";
import type { Result } from "@/api/types";
import type { TaskItem, TaskResponse } from "@/api/types/task";

// 🔹 Request payloads
export interface TaskRequest {
    PageIndex: number;
    PageSize: number;
    SortBy?: string | null;
    Filter?: string | null;
}

export interface CreateTaskRequest {
    Name: string;
    Description: string;
    UserName: string;
    Stack: string;
    StartDate: string;
    EndDate: string;
    Status: string;
}

export interface UpdateTaskRequest extends CreateTaskRequest {
    Uid: string;
}

// 🔹 Redux state
export interface TaskState {
    data: TaskItem[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: TaskState = {
    data: [],
    totalCount: 0,
    loading: false,
    error: null,
};

// 🔹 Fetch All Tasks
export const fetchAllTasks = createAsyncThunk<
    Result<TaskItem>,
    TaskRequest,
    { rejectValue: { Message: string } }
>("task/fetchAllTasks", async (params, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<TaskResponse>("/task/all", params, config);
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to fetch tasks");
        }

        return result.Model.Result;
    } catch (error: any) {
        console.error("Fetch failed:", error);
        return rejectWithValue(error?.response?.data || { Message: "Request failed" });
    }
});

// 🔹 Create Task
export const createTask = createAsyncThunk<
    TaskItem,
    CreateTaskRequest,
    { rejectValue: { Message: string } }
>("task/createTask", async (payload, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        };

        const response = await httpClient.post<TaskResponse>("/task", payload, config);
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to create task");
        }

        const createdTask = result.Model?.Entity || result.Model;
        toast.success("Task created successfully");
        return createdTask as TaskItem;
    } catch (error: any) {
        console.error("Create failed:", error);
        return rejectWithValue(error?.response?.data || { Message: "Failed to create task" });
    }
});

// 🔹 Update Task
export const updateTask = createAsyncThunk<
    TaskItem,
    UpdateTaskRequest,
    { rejectValue: { Message: string } }
>("task/updateTask", async (payload, { rejectWithValue }) => {
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

        const response = await httpClient.put<TaskResponse>(`/task/${Uid}`, updateData, config);
        const result = response;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to update task");
        }

        const updatedTask = result.Model?.Entity || result.Model;
        toast.success("Task updated successfully");
        return updatedTask as TaskItem;
    } catch (error: any) {
        console.error("Update failed:", error);
        return rejectWithValue(error?.response?.data || { Message: "Failed to update task" });
    }
});

// 🔹 Delete Task
export const deleteTask = createAsyncThunk<
    string, // ✅ Return deleted task Uid
    string, // ✅ Payload = Uid
    { rejectValue: { Message: string } }
>("task/deleteTask", async (Uid, { rejectWithValue }) => {
    try {
        const tokenService = new TokenService();
        const token = tokenService.getAccessToken();

        const config: AxiosRequestConfig = {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        };

        const response = await httpClient.delete(`/task/${Uid}`, config);
        const result = response as any;

        if (!result.IsSuccess || result.Status !== 200) {
            throw new Error(result.Message || "Failed to delete task");
        }

        toast.success("Task deleted successfully");
        return Uid; // ✅ return deleted ID
    } catch (error: any) {
        console.error("Delete failed:", error);
        return rejectWithValue(error?.response?.data || { Message: "Failed to delete task" });
    }
});

// 🔹 Slice
const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        clearTasks(state) {
            state.data = [];
            state.totalCount = 0;
            toast.info("Task data cleared");
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchAllTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.Records;
                state.totalCount = action.payload.TotalRecords;
                toast.success("Tasks loaded successfully");
            })
            .addCase(fetchAllTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to load tasks";
                toast.error(state.error);
            })

            // Create Task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.data.unshift(action.payload);
                toast.success("Task added to list");
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to create task";
                toast.error(state.error);
            })

            // Update Task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.data.findIndex((t) => t.Uid === action.payload.Uid);
                if (index !== -1) state.data[index] = action.payload;
                toast.success("Task updated in list");
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to update task";
                toast.error(state.error);
            })

            // Delete Task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.loading = false;
                state.data = state.data.filter((t) => t.Uid !== action.payload);
                toast.success("Task removed from list");
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as any)?.Message || "Failed to delete task";
                toast.error(state.error);
            });
    },
});

export const { clearTasks } = taskSlice.actions;
export default taskSlice.reducer;
