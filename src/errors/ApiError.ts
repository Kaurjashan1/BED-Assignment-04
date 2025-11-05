import { HTTP_STATUS } from '../utils/httpStatusCodes';

/**
 * Base class for all custom application errors.
 * Ensures consistent structure (message, status code, logging flag) for all errors.
 */
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    /**
     * @param name The name of the error (e.g., 'NotFoundError').
     * @param statusCode The HTTP status code to return.
     * @param message The error message visible to the client.
     * @param isOperational Flag indicating if the error is expected/handled (true) or a crash (false).
     */
    constructor(
        name: string,
        statusCode: number,
        message: string,
        isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);

        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Capture stack trace, excluding constructor call from trace
        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Factory method to check if an error is an operational API error.
     */
    static isApiError(error: unknown): error is ApiError {
        return error instanceof ApiError;
    }

    /**
     * Helper to create a generic 500 server error response for unexpected issues.
     */
    static internalServerError(message: string = 'An internal server error occurred.') {
        return new ApiError(
            'InternalServerError',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            message,
            false // Non-operational: This indicates an unexpected crash
        );
    }
}