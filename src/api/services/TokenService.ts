//TokenService.ts
import type { ITokenService } from '../interfaces';

export class TokenService implements ITokenService {
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    getTokenExpiry(): number | null {
        const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
        return expiry ? parseInt(expiry, 10) : null;
    }

    /**
     * Stores tokens in localStorage.
     * If `expiresIn` (in seconds) is provided, also stores expiry timestamp.
     */
    setTokens(accessToken: string, refreshToken: string, expiresIn?: number): void {
        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);

        if (expiresIn) {
            const expiryTime = Date.now() + expiresIn * 1000;
            localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
        }
    }

    clearTokens(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }

    isTokenExpired(): boolean {
        const expiry = this.getTokenExpiry();
        if (!expiry) return false;
        return Date.now() > expiry;
    }

    isAuthenticated(): boolean {
        const accessToken = this.getAccessToken();
        if (!accessToken) return false;
        if (this.isTokenExpired()) return false;
        return true;
    }
}
