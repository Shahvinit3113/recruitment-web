import type { BaseEntity, ApiResponse } from "./index";

export interface templateItem extends BaseEntity {
    Name: string;
    Description: string;
}

// Strongly typed response
export type TemplateResponse = ApiResponse<templateItem>;
