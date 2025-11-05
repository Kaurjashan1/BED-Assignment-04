import { Request, Response } from 'express';
import { NotFoundError } from '../../../errors/customErrors';

// Hardcoded data structure for high-risk applications
const applications = [
    {
        id: 'LA9001',
        borrowerName: 'Alice Johnson',
        amount: 150000,
        riskScore: 85, // High Risk
        status: 'Pending',
        submittedAt: '2024-10-25T10:00:00Z'
    },
    {
        id: 'LA9002',
        borrowerName: 'Bob Smith',
        amount: 50000,
        riskScore: 78, // Medium-High Risk
        status: 'Pending',
        submittedAt: '2024-10-25T11:30:00Z'
    },
    {
        id: 'LA9003',
        borrowerName: 'Charlie Brown',
        amount: 400000,
        riskScore: 92, // Extremely High Risk
        status: 'Pending',
        submittedAt: '2024-10-26T09:15:00Z'
    }
];

/**
 * GET /api/v1/loans
 * Retrieves a list of all high-risk loan applications.
 * (Hardcoded response for now)
 */
export const getApplications = (req: Request, res: Response): void => {
    // Note: In later steps, this will filter applications based on user roles.
    res.status(200).json({
        message: 'Successfully retrieved all high-risk loan applications (hardcoded).',
        count: applications.length,
        data: applications
    });
};

/**
 * GET /api/v1/loans/:id
 * Retrieves a specific loan application by ID.
 * (Hardcoded response for now)
 */
export const getApplicationById = (req: Request, res: Response): void => {
    const { id } = req.params;
    const application = applications.find(app => app.id === id);

    if (application) {
        res.status(200).json({
            message: `Successfully retrieved application ${id}.`,
            data: application
        });
    } else {
        throw new NotFoundError(`Application ID ${id} not found.`);
    }
};

/**
 * POST /api/v1/loans/approve/:id
 * Approves a specific loan application.
 * (Hardcoded success response for now)
 */
export const approveApplication = (req: Request, res: Response): void => {
    const { id } = req.params;
    // Simulate updating the status in a database
    res.status(200).json({
        message: `Application ${id} approved successfully. (Action simulated - status not permanently updated)`,
        action: 'APPROVED',
        applicationId: id
    });
};

/**
 * POST /api/v1/loans/reject/:id
 * Rejects a specific loan application.
 * (Hardcoded success response for now)
 */
export const rejectApplication = (req: Request, res: Response): void => {
    const { id } = req.params;
    // Simulate updating the status in a database
    res.status(200).json({
        message: `Application ${id} rejected successfully. (Action simulated - status not permanently updated)`,
        action: 'REJECTED',
        applicationId: id
    });
};