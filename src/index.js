import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import reviewRoutes from './routes/reviews.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], 
  credentials: true 
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Books API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const port = process.env.PORT || 5000;

// Start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📚 Books API: http://localhost:${port}/api`);
  });
});