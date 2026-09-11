/**
 * OpportunityOS Express Server Entrypoint
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'OpportunityOS API Engine',
    timestamp: new Date().toISOString()
  });
});

// Authentication & Admin Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// General API Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 OpportunityOS Server listening on http://localhost:${PORT}`);
});
