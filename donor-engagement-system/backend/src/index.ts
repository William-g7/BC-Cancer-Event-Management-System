import express from 'express';
import eventRoutes from './routes/event.routes';

const app = express();

// Mount routes with /api prefix
app.use('/api', eventRoutes); 