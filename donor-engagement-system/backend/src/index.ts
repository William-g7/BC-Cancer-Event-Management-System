import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware';
import eventRoutes from './routes/event.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes with /api prefix
app.use('/api', eventRoutes);

// Global error handler - should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});