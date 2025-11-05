import request from 'supertest';
import app from '../app';
import {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError
} from '../errors/customErrors';

describe('Error Handling System', () => {

    // --- Custom Error Class Tests ---

    describe('Custom Error Classes', () => {
        it('BadRequestError should have status 400', () => {
            const error = new BadRequestError('Invalid input provided.');
            expect(error.name).toBe('BadRequestError');
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe('Invalid input provided.');
            expect(error.isOperational).toBe(true);
        });

        it('UnauthorizedError should have status 401', () => {
            const error = new UnauthorizedError('Missing token.');
            expect(error.name).toBe('UnauthorizedError');
            expect(error.statusCode).toBe(401);
            expect(error.message).toBe('Missing token.');
            expect(error.isOperational).toBe(true);
        });

        it('ForbiddenError should have status 403', () => {
            const error = new ForbiddenError('Role check failed.');
            expect(error.name).toBe('ForbiddenError');
            expect(error.statusCode).toBe(403);
            expect(error.message).toBe('Role check failed.');
            expect(error.isOperational).toBe(true);
        });

        it('NotFoundError should have status 404', () => {
            const error = new NotFoundError('Resource not found.');
            expect(error.name).toBe('NotFoundError');
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe('Resource not found.');
            expect(error.isOperational).toBe(true);
        });

        it('ConflictError should have status 409', () => {
            const error = new ConflictError('Record already exists.');
            expect(error.name).toBe('ConflictError');
            expect(error.statusCode).toBe(409);
            expect(error.message).toBe('Record already exists.');
            expect(error.isOperational).toBe(true);
        });
    });

    // --- Error Middleware Tests ---

    describe('Global Error Handler Middleware', () => {

        // Test for 404 handler integration (Operational Error)
        it('Should handle 404 routes and return a standardized error format', async () => {
            const response = await request(app).get('/api/v1/non-existent-route');
            
            expect(response.statusCode).toBe(404);
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body.status).toBe(404);
            expect(response.body.error).toBe('NotFoundError');
            expect(response.body.message).toContain('Route GET /api/v1/non-existent-route not found.');
            expect(response.body).toHaveProperty('stack'); // Stack trace expected in non-production mode
        });
        
        // Test for 404 error thrown by a controller (Operational Error)
        it('Should handle controller-thrown NotFoundError with standard format', async () => {
            // Note: LA9999 is a non-existent ID handled by the controller
            const response = await request(app).get('/api/v1/loans/LA9999');
            
            expect(response.statusCode).toBe(404);
            expect(response.body.status).toBe(404);
            expect(response.body.error).toBe('NotFoundError');
            expect(response.body.message).toContain('Application ID LA9999 not found.');
        });

        // Test for unexpected errors (Non-Operational Error - 500)
        // To test this, we'll temporarily create a route that throws a standard JS Error
        it('Should handle unexpected standard errors (500 Internal Server Error)', async () => {
            // Temporarily add a route to force an unexpected crash
            app.get('/test/crash', (req, res, next) => {
                next(new Error('Database connection failed.')); // Simulates an unexpected crash
            });

            const response = await request(app).get('/test/crash');
            
            // Check that the response defaults to 500 and the correct error structure
            expect(response.statusCode).toBe(500);
            expect(response.body.status).toBe(500);
            expect(response.body.error).toBe('InternalServerError');
            // Message should be specific in development mode
            expect(response.body.message).toBe('Database connection failed.');

            // Clean up the temporary route (important to not affect other tests)
            app._router.stack = app._router.stack.filter((layer: any) => {
                return layer.route ? layer.route.path !== '/test/crash' : true;
            });
        });
    });
});