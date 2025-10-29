export interface LoginRequest {
    Email: string;
    Password: string;
}

export interface LoginApiResponse {
    IsSuccess: boolean;
    Status: number;
    Message: string;
    Model: {
        UserId: string;
        AccessToken: string;
        RefreshToken: string;
    }
}

