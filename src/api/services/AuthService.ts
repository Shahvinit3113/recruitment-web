// src/api/services/AuthService.ts
import { httpClient } from '../container/DIContainer';
import type { LoginApiResponse, LoginRequest } from '../types/auth';

export class AuthService {
    async login(data: LoginRequest): Promise<LoginApiResponse> {
        return await httpClient.post<LoginApiResponse>('/login', data);
    }

    async logout(): Promise<void> {
        await httpClient.post('/auth/logout');
    }

    // async refreshToken(refreshToken: string): Promise<LoginApiResponse> {
    //     return await httpClient.post<LoginApiResponse>('/auth/refresh', { refreshToken });
    // }

    // async getCurrentUser(): Promise<LoginApiResponse['user']> {
    //     return await httpClient.get<LoginApiResponse['user']>('/auth/me');
    // }
}

// Export singleton instance
export const authService = new AuthService();
