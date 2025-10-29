import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { IHttpClient, ITokenService, IErrorHandler } from '../interfaces';

/** Utility to safely get environment variables in Vite or Node environments */
const getEnvVar = (key: string, defaultValue: string = ''): string => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return (import.meta.env[key] as string) || defaultValue;
    }
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || defaultValue;
    }
    return defaultValue;
};

export class HttpClient implements IHttpClient {
    private instance: AxiosInstance;
    private tokenService: ITokenService;
    private errorHandler: IErrorHandler;
    private isRefreshing = false;
    private refreshQueue: ((token: string) => void)[] = [];

    constructor(
        tokenService: ITokenService,
        errorHandler: IErrorHandler,
        baseURL: string = getEnvVar('VITE_API_BASE_URL', '')
    ) {
        this.tokenService = tokenService;
        this.errorHandler = errorHandler;

        this.instance = axios.create({
            baseURL,
            timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000')),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        this.setupInterceptors();
    }

    /** Configure Axios interceptors for auth + logging */
    private setupInterceptors(): void {
        const isDev = getEnvVar('MODE', 'production') === 'development';
        const enableLogging = getEnvVar('VITE_ENABLE_API_LOGGING', 'false') === 'true';

        // ✅ Request Interceptor
        this.instance.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = this.tokenService.getAccessToken();
                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                if (isDev && enableLogging) {
                    console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
                        data: config.data,
                        params: config.params,
                    });
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // ✅ Response Interceptor
        this.instance.interceptors.response.use(
            (response) => {
                if (isDev && enableLogging) {
                    console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, {
                        status: response.status,
                        data: response.data,
                    });
                }
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                // 🧱 Handle 401 Unauthorized
                if (error.response?.status === 401) {
                    // If refresh request itself failed → logout immediately
                    if (originalRequest.url?.includes('/auth/refresh')) {
                        this.tokenService.clearTokens();
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    // Prevent infinite retry loops
                    if (originalRequest._retry) {
                        this.tokenService.clearTokens();
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    originalRequest._retry = true;

                    try {
                        const newAccessToken = await this.queueRefreshToken();
                        if (newAccessToken && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        }
                        return this.instance(originalRequest);
                    } catch (refreshError: any) {
                        // If refresh also failed, log out
                        if (refreshError.response?.status === 401) {
                            this.tokenService.clearTokens();
                            window.location.href = '/login';
                        }
                        return Promise.reject(refreshError);
                    }
                }

                // 🔥 Handle other errors
                const handledError = this.errorHandler.handle(error);
                return Promise.reject(handledError);
            }
        );
    }

    /** 🔄 Refresh Token Logic (with concurrency control) */
    private async queueRefreshToken(): Promise<string> {
        if (this.isRefreshing) {
            return new Promise((resolve) => {
                this.refreshQueue.push(resolve);
            });
        }

        this.isRefreshing = true;

        try {
            const refreshToken = this.tokenService.getRefreshToken();
            if (!refreshToken) throw new Error('No refresh token available');

            const response = await this.instance.post('/auth/refresh', { refreshToken });

            const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;
            this.tokenService.setTokens(accessToken, newRefreshToken, expiresIn);

            // Resolve all queued requests with new token
            this.refreshQueue.forEach((cb) => cb(accessToken));
            this.refreshQueue = [];

            return accessToken;
        } catch (error) {
            this.tokenService.clearTokens();
            throw error;
        } finally {
            this.isRefreshing = false;
        }
    }

    /** Extracts data safely from API responses */
    private extractData<T>(responseData: any): T {
        if (responseData?.data !== undefined) {
            return responseData.data;
        }
        return responseData;
    }

    // --- 🌐 Standard HTTP Methods ---
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.get(url, config);
        return this.extractData(response.data);
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.post(url, data, config);
        return this.extractData(response.data);
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.put(url, data, config);
        return this.extractData(response.data);
    }

    async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.patch(url, data, config);
        return this.extractData(response.data);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.instance.delete(url, config);
        return this.extractData(response.data);
    }

    /** 📤 File Upload Helper */
    async uploadFile<T>(
        url: string,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<T> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await this.instance.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(progress);
                }
            },
        });

        return this.extractData(response.data);
    }
}
