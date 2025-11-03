//types/position.ts
import type { BaseEntity, ApiResponse } from "./index";

export interface positionItem extends BaseEntity {
    Name: string;
    Description: string;
    DepartmentId: string;
    Department: string;
    Status: 'active' | 'closed'
}

// Strongly typed response
export type PositionResponse = ApiResponse<positionItem>;
