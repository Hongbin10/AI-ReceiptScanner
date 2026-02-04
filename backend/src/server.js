import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = process.env.PORT || 5001;



connectDB().then(() => {
  app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
});