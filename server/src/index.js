/**
 * OpportunityOS Express Server Entrypoint
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { seedDatabase } from '../prisma/seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration for Vercel production frontend and local development
const allowedOrigins = [
  'https://opportunity-os-virid.vercel.app',
  'http://localhost:5173',
  'http://localhost:3001',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback to true for maximum compatibility
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-auth-token']
}));

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

// Server startup & Database initialization
app.listen(PORT, async () => {
  console.log(`🚀 OpportunityOS Server listening on port ${PORT}`);
  try {
    await seedDatabase(false);
  } catch (err) {
    console.warn('Startup database auto-seed note:', err?.message || err);
  }
});

