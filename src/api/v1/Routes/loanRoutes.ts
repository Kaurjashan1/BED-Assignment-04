import { Router } from 'express';
import {
    getApplications,
    getApplicationById,
    approveApplication,
    rejectApplication
} from '../controllers/loanController';

const router = Router();

// Base URL: /api/v1/loans

// GET: Retrieve all high-risk applications
router.get('/', getApplications);

// GET: Retrieve a specific application by ID
router.get('/:id', getApplicationById);

// POST: Approve a specific application (will require auth/authz later)
router.post('/approve/:id', approveApplication);

// POST: Reject a specific application (will require auth/authz later)
router.post('/reject/:id', rejectApplication);

export default router;