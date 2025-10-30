// src/api/types/index.ts

// 🔹 Common Base Entity used across all modules
export interface BaseEntity {
    Uid: string;
    CreatedOn: string;
    CreatedBy: string;
    UpdatedOn: string;
    UpdatedBy: string;
    IsDeleted: number;
    IsActive: number;
    DeletedOn: string | null;
    OrgId: string;
}

// 🔹 Generic Result Wrapper (reusable for any entity)
export interface Result<T> {
    PageIndex: number;
    PageSize: number;
    TotalRecords: number;
    Records: T[];
}

// 🔹 Generic Model Wrapper
export interface Model<T> {
    Entity: any | null;
    Result: Result<T>;
}

// 🔹 Generic API Response
export interface ApiResponse<T> {
    IsSuccess: boolean;
    Status: number;
    Message: string;
    Model: Model<T>;
}

// 🔹 Optional: PaginatedResponse (if you still use older pattern)
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// 🔹 Optional: Common API Error structure
export interface ApiError {
    message: string;
    code: string;
    status: number;
    details?: any;
}
