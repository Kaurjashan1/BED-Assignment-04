import express from 'express';
import morgan from 'morgan';
import loanRoutes from './api/v1/Routes/loanRoutes';

// Create the Express application instance
const app = express();
const PORT = process.env.PORT || 3000;

// =========================================================================
// Middleware Setup
// =========================================================================

// 1. HTTP Request Logger (Morgan)
// The 'dev' format provides concise, color-coded output for development use.
app.use(morgan('dev'));

// 2. Body Parser
// Allows Express to parse JSON bodies from incoming requests.
app.use(express.json());

// =========================================================================
// API Routes Setup
// =========================================================================

// Root Route for version 1 of the API (All loan routes are mounted here)
app.use('/api/v1/loans', loanRoutes);

// Simple health check route
app.get('/', (req, res) => {
    res.status(200).json({ 
        service: 'Loan Application API', 
        status: 'running',
        version: 'v1'
    });
});

// =========================================================================
// Server Initialization
// =========================================================================

// Start the server only if the file is run directly (not imported for testing)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`\n=================================================`);
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`API Docs: http://localhost:${PORT}/api/v1/loans`);
        console.log(`=================================================\n`);
    });
}

// Export the app instance for testing purposes
export default app;