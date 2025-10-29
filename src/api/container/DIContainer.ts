import { HttpClient } from '../implementations/HttpClient';
import { ErrorHandler } from '../services/ErrorHandler';
import { TokenService } from '../services/TokenService';

const getEnvVar = (key: string, defaultValue: string = ''): string => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return (import.meta.env[key] as string) || defaultValue;
    }
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || defaultValue;
    }
    return defaultValue;
};


const tokenService = new TokenService();
const errorHandler = new ErrorHandler();

export const httpClient = new HttpClient(
    tokenService,
    errorHandler,
    getEnvVar('VITE_API_BASE_URL', 'https://recrutment-api.onrender.com/api')
);

export { tokenService, errorHandler };
