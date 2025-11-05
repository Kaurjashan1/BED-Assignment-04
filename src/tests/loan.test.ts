import request from 'supertest';
import app from '../app';

// The ID of a known application from the hardcoded list in loanController
const TEST_APP_ID = 'LA9001';
const NON_EXISTENT_ID = 'LA9999';

describe('Loan Application API Endpoints (Unsecured)', () => {
    // Test 1: Health Check / Root Route
    it('GET / should return the service status', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body.service).toBe('Loan Application API');
    });

    // Test 2: Retrieve All Applications
    it('GET /api/v1/loans should retrieve a list of all applications', async () => {
        const response = await request(app).get('/api/v1/loans');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toContain('retrieved all high-risk loan applications');
        expect(response.body.data).toBeInstanceOf(Array);
        // Ensure at least one application is returned from the hardcoded list
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    // Test 3: Retrieve a Specific Application (Success)
    it('GET /api/v1/loans/:id should retrieve a specific application', async () => {
        const response = await request(app).get(`/api/v1/loans/${TEST_APP_ID}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.data.id).toBe(TEST_APP_ID);
        expect(response.body.data).toHaveProperty('borrowerName');
    });

    // Test 4: Retrieve a Specific Application (Not Found)
    it('GET /api/v1/loans/:id should return 404 for a non-existent ID', async () => {
        const response = await request(app).get(`/api/v1/loans/${NON_EXISTENT_ID}`);
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toContain('not found');
    });

    // Test 5: Approve Application
    it('POST /api/v1/loans/approve/:id should simulate approval', async () => {
        const response = await request(app).post(`/api/v1/loans/approve/${TEST_APP_ID}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.action).toBe('APPROVED');
        expect(response.body.applicationId).toBe(TEST_APP_ID);
    });

    // Test 6: Reject Application
    it('POST /api/v1/loans/reject/:id should simulate rejection', async () => {
        const response = await request(app).post(`/api/v1/loans/reject/${TEST_APP_ID}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.action).toBe('REJECTED');
        expect(response.body.applicationId).toBe(TEST_APP_ID);
    });
});