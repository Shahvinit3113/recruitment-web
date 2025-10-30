import type { BaseEntity, ApiResponse } from "./index";

export interface TaskItem extends BaseEntity {
    Name: string;
    Description: string;
    UserName: string;
    Stack: string;
    StartDate: string;
    EndDate: string;
    Status: string;
}

// Strongly typed response
export type TaskResponse = ApiResponse<TaskItem>;
