import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware';
import eventRoutes from './routes/event.routes';
import loginRoutes from './routes/loginRoutes';

const app = express();

// Configure CORS with specific options
app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-User-Name'], // Add your custom headers here
    credentials: true
}));

app.use(express.json());

// Mount routes with /api prefix
app.use('/api', eventRoutes);

app.use('/api', loginRoutes);

// Global error handler - should be last
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});