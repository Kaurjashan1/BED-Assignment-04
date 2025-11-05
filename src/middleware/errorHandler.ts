import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Utility function to handle logging of non-operational errors.
 * Non-operational errors (isOperational: false) represent crashes (e.g., programming bugs, DB connection failure).
 */
const logError = (error: Error | ApiError): void => {
    // Log the error details including stack trace for critical, non-operational errors
    if (error instanceof ApiError && !error.isOperational) {
        console.error('CRITICAL NON-OPERATIONAL ERROR:', error.name, error.message);
        console.error(error.stack);
        // In a real application, you would integrate with a centralized logging service (e.g., Sentry, Winston) here.
    }
    // Log all other errors (including operational ones) for visibility
    if (isProduction) {
        // Log less detail in production for operational errors
        console.warn(`[${error.name || 'Error'}] - ${error.message}`);
    } else {
        // Log full stack in development
        console.error(error);
    }
};

/**
 * Global error handling middleware for Express.
 * Catches all errors, formats a consistent response, and handles logging.
 *
 * NOTE: Express error handlers MUST have exactly four arguments (err, req, res, next).
 */
export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
    logError(err); // Centralized logging

    // 1. Determine Response Status Code and Payload
    let error: ApiError;

    if (ApiError.isApiError(err)) {
        // Operational errors (4xx codes, expected issues)
        error = err;
    } else {
        // Non-operational or unexpected errors (500)
        error = ApiError.internalServerError(
            isProduction
                ? 'An unexpected error occurred.' // Generic message in production
                : err.message // Specific message in development
        );
    }

    // 2. Format the standardized error response
    const responseBody = {
        timestamp: new Date().toISOString(),
        status: error.statusCode,
        error: error.name,
        message: error.message,
        // Only include stack trace in development mode for debugging
        ...(isProduction ? {} : { stack: error.stack }),
    };

    // 3. Send the response
    res.status(error.statusCode).json(responseBody);

    // If a critical, non-operational error occurred in production, consider triggering a graceful shutdown.
    // if (!error.isOperational && isProduction) {
    //     process.exit(1);
    // }
};