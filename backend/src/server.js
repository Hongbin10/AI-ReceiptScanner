import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import receiptRoutes from './routes/receiptRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', receiptRoutes); // All routes mounted under /api  

// Root route for convenience
app.get('/', (req, res) => {
  res.redirect('/api');
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});