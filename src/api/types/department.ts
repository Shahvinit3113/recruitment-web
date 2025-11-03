import type { BaseEntity, ApiResponse } from "./index";

export interface departmentItem extends BaseEntity {
    Name: string;
    Description: string;
}

// Strongly typed response
export type DepartmentResponse = ApiResponse<departmentItem>;
