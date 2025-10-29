import type { ApiError, IErrorHandler } from '../interfaces';

export class ErrorHandler implements IErrorHandler {
    handle(error: any): ApiError {
        // Normalize an error to ApiError format
        if (error.response && error.response.data) {
            const data = error.response.data;
            return {
                message: data.message || 'An error occurred',
                code: data.code || 'UNKNOWN',
                status: error.response.status,
                details: data.details || null,
            };
        }

        // Handle network errors
        if (error.request) {
            return {
                message: 'Network error. Please check your connection.',
                code: 'NETWORK_ERROR',
                status: 0,
                details: null,
            };
        }

        return {
            message: error.message || 'An unknown error occurred',
            code: 'UNKNOWN',
            status: 500,
            details: null,
        };
    }

    showErrorToast(error: ApiError): void {
        // Basic example: replace with your toast/notification system integration
        console.error('Error:', error);
        // Example with a toast library:
        // toast.error(error.message);
    }

    getValidationErrors(error: ApiError): Record<string, string> {
        // Extract validation errors if available (customize based on backend response)
        return error.details?.validationErrors || {};
    }
}