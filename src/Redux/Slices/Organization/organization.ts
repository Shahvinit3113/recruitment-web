import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { httpClient } from "@/api";
import type { AxiosRequestConfig } from "axios";
import { TokenService } from "@/api/services/TokenService";

interface OrganizationRequest {
    PageSize: number;
    PageIndex: number;
    SortBy?: string | null;
}

interface OrganizationItem {
    [key: string]: any;
}

interface OrganizationResponse {
    IsSuccess: boolean;
    Status: number;
    Message: string;
    Model: {
        PageSize: number;
        PageIndex: number;
        SortBy?: string | null;
        TotalRecords: number;
        Records: OrganizationItem[];
    };
}

interface OrganizationState {
    data: OrganizationItem[];
    totalCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: OrganizationState = {
    data: [],
    totalCount: 0,
    loading: false,
    error: null,
};

export const fetchAllOrganizations = createAsyncThunk(
    "organization/fetchAllOrganizations",
    async (params: OrganizationRequest, { rejectWithValue }) => {
        try {
            const tokenService = new TokenService();
            const token = tokenService.getAccessToken();

            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
            };

            const response = await httpClient.post<OrganizationResponse>(
                "/organization/All",
                params,
                config
            );

            const result = (response as any).data ?? response;

            if (!result.IsSuccess || result.Status !== 200) {
                throw new Error(result.Message || "Failed to fetch organization data");
            }

            return result.Model;
        } catch (error: any) {
            console.error("Fetch failed:", error);
            return rejectWithValue(
                error?.response?.data || { Message: "Request failed" }
            );
        }
    }
);

export const createOrganization = createAsyncThunk(
    "organization/createOrganization",
    async (data: any, { rejectWithValue }) => {
        try {
            const tokenService = new TokenService();
            const token = tokenService.getAccessToken();

            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
            };

            const response = await httpClient.post("/organization", data, config);

            const result = (response as any).data ?? response;

            if (!result.IsSuccess || result.Status !== 201) {
                throw new Error(result.Message || "Failed to create organization");
            }

            return result;
        } catch (error: any) {
            console.error("Organization creation failed:", error);
            return rejectWithValue(
                error?.response?.data || { Message: "Organization creation failed" }
            );
        }
    }
);

export const updateOrganization = createAsyncThunk(
    "organization/updateOrganization",
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const tokenService = new TokenService();
            const token = tokenService.getAccessToken();

            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
            };

            const response = await httpClient.put(
                `/organization/${id}`,
                data,
                config
            );

            const result = (response as any).data ?? response;

            if (!result.IsSuccess) {
                throw new Error(result.Message || "Failed to update organization");
            }

            return result;
        } catch (error: any) {
            console.error("Organization update failed:", error);
            return rejectWithValue(
                error?.response?.data || { Message: "Organization update failed" }
            );
        }
    }
);

export const deleteOrganization = createAsyncThunk(
    "organization/deleteOrganization",
    async (id: string, { rejectWithValue }) => {
        try {
            const tokenService = new TokenService();
            const token = tokenService.getAccessToken();

            const config: AxiosRequestConfig = {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "application/json",
                },
            };

            const response = await httpClient.delete(
                `/organization/${id}`,
                config
            );

            const result = (response as any).data ?? response;

            if (!result.IsSuccess) {
                throw new Error(result.Message || "Failed to delete organization");
            }

            return result;
        } catch (error: any) {
            console.error("Organization deletion failed:", error);
            return rejectWithValue(
                error?.response?.data || { Message: "Organization deletion failed" }
            );
        }
    }
);

const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        clearOrganizations(state) {
            state.data = [];
            state.totalCount = 0;
            toast.info("Organization data cleared");
        },
    },
    extraReducers: (builder) => {
        builder
            /* 🔹 Fetch Organizations */
            .addCase(fetchAllOrganizations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrganizations.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.Result.Records;
                state.totalCount = action.payload.TotalRecords;
                toast.success("Organizations loaded successfully");
            })
            .addCase(fetchAllOrganizations.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to load organizations";
                toast.error(state.error);
            })

            /* 🔹 Create Organization */
            .addCase(createOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrganization.fulfilled, (state) => {
                state.loading = false;
                toast.success("Organization created successfully");
            })
            .addCase(createOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to create organization";
                toast.error(state.error);
            })

            /* 🔹 Update Organization */
            .addCase(updateOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrganization.fulfilled, (state) => {
                state.loading = false;
                toast.success("Organization updated successfully");
            })
            .addCase(updateOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to update organization";
                toast.error(state.error);
            })

            /* 🔹 Delete Organization */
            .addCase(deleteOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrganization.fulfilled, (state) => {
                state.loading = false;
                toast.success("Organization deleted successfully");
            })
            .addCase(deleteOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as any)?.Message || "Failed to delete organization";
                toast.error(state.error);
            });
    },
});

export const { clearOrganizations } = organizationSlice.actions;
export default organizationSlice.reducer;