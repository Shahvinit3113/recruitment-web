import type { AxiosRequestConfig } from 'axios';

export interface ITokenService {
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    setTokens(accessToken: string, refreshToken: string, expiresIn: number): void;
    clearTokens(): void;
    isTokenExpired(): boolean;
}

export interface ApiError {
    message: string;
    code: string;
    status: number;
    details: any;
}

export interface IErrorHandler {
    handle(error: any): ApiError;
    showErrorToast(error: ApiError): void;
    getValidationErrors(error: ApiError): Record<string, string>;
}

export interface IHttpClient {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
    delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
    uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T>;
}

export interface IValidationRule<T> {
    validate(value: T): { isValid: boolean; message: string };
}

export interface IValidationService {
    addRule<T>(name: string, rule: IValidationRule<T>): void;
    validate<T>(ruleName: string, value: T): { isValid: boolean; message: string };
    validateObject(data: Record<string, any>, rules: Record<string, string>): Record<string, string>;
}