import type { IValidationRule, IValidationService } from '../interfaces';

// Email validation rule
export class EmailValidationRule implements IValidationRule<string> {
    validate(email: string): { isValid: boolean; message: string } {
        if (!email) {
            return { isValid: false, message: 'Email is required' };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        return {
            isValid,
            message: isValid ? '' : 'Please enter a valid email address',
        };
    }
}

// Password validation rule
export class PasswordValidationRule implements IValidationRule<string> {
    private minLength: number;
    private requireUppercase: boolean;
    private requireLowercase: boolean;
    private requireNumbers: boolean;
    private requireSpecialChars: boolean;

    constructor(options: {
        minLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
    } = {}) {
        this.minLength = options.minLength || 8;
        this.requireUppercase = options.requireUppercase !== false;
        this.requireLowercase = options.requireLowercase !== false;
        this.requireNumbers = options.requireNumbers !== false;
        this.requireSpecialChars = options.requireSpecialChars || false;
    }

    validate(password: string): { isValid: boolean; message: string } {
        if (!password) {
            return { isValid: false, message: 'Password is required' };
        }

        if (password.length < this.minLength) {
            return {
                isValid: false,
                message: `Password must be at least ${this.minLength} characters long`,
            };
        }

        if (this.requireLowercase && !/[a-z]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one lowercase letter',
            };
        }

        if (this.requireUppercase && !/[A-Z]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one uppercase letter',
            };
        }

        if (this.requireNumbers && !/\d/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one number',
            };
        }

        if (this.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return {
                isValid: false,
                message: 'Password must contain at least one special character',
            };
        }

        return { isValid: true, message: '' };
    }
}

// Required field validation rule
export class RequiredValidationRule implements IValidationRule<any> {
    validate(value: any): { isValid: boolean; message: string } {
        const isValid = value !== undefined &&
            value !== null &&
            value !== '' &&
            (!Array.isArray(value) || value.length > 0);

        return {
            isValid,
            message: isValid ? '' : 'This field is required',
        };
    }
}

// Validation service implementation
export class ValidationService implements IValidationService {
    private rules: Map<string, IValidationRule<any>> = new Map();

    addRule<T>(name: string, rule: IValidationRule<T>): void {
        this.rules.set(name, rule);
    }

    validate<T>(ruleName: string, value: T): { isValid: boolean; message: string } {
        const rule = this.rules.get(ruleName);
        if (!rule) {
            throw new Error(`Validation rule '${ruleName}' not found`);
        }
        return rule.validate(value);
    }

    validateObject(data: Record<string, any>, rules: Record<string, string>): Record<string, string> {
        const errors: Record<string, string> = {};

        Object.entries(rules).forEach(([field, ruleName]) => {
            const result = this.validate(ruleName, data[field]);
            if (!result.isValid) {
                errors[field] = result.message;
            }
        });

        return errors;
    }
}

// Create and export default validation service
export const validationService = new ValidationService();
validationService.addRule('email', new EmailValidationRule());
validationService.addRule('password', new PasswordValidationRule());
validationService.addRule('required', new RequiredValidationRule());