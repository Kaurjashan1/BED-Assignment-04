import { ApiError } from './ApiError';
import { HTTP_STATUS } from '../utils/httpStatusCodes';

/**
 * 400 Bad Request Error: Used for validation failures, missing required data, or malformed requests.
 */
export class BadRequestError extends ApiError {
    constructor(message: string = 'The request could not be understood due to malformed syntax.') {
        super(
            'BadRequestError',
            HTTP_STATUS.BAD_REQUEST,
            message,
            true
        );
    }
}

/**
 * 401 Unauthorized Error: Used when authentication fails (missing or invalid token/credentials).
 */
export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Authentication credentials were missing or invalid.') {
        super(
            'UnauthorizedError',
            HTTP_STATUS.UNAUTHORIZED,
            message,
            true
        );
    }
}

/**
 * 403 Forbidden Error: Used when the user is authenticated but lacks necessary permissions (authorization failure).
 */
export class ForbiddenError extends ApiError {
    constructor(message: string = 'You do not have permission to access this resource.') {
        super(
            'ForbiddenError',
            HTTP_STATUS.FORBIDDEN,
            message,
            true
        );
    }
}

/**
 * 404 Not Found Error: Used when the requested resource does not exist.
 */
export class NotFoundError extends ApiError {
    constructor(message: string = 'The requested resource was not found.') {
        super(
            'NotFoundError',
            HTTP_STATUS.NOT_FOUND,
            message,
            true
        );
    }
}

/**
 * 409 Conflict Error: Used when the request could not be completed because it conflicts with the current state of the resource.
 */
export class ConflictError extends ApiError {
    constructor(message: string = 'The request could not be completed due to a conflict with the current state of the resource.') {
        super(
            'ConflictError',
            HTTP_STATUS.CONFLICT,
            message,
            true
        );
    }
}