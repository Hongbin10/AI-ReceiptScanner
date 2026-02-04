import express from 'express';
import { uploadReceipt, getReceipts, getHome } from '../controllers/receiptController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getHome); // Home page
router.post('/upload', upload.single('receipt'), uploadReceipt); // Upload and analyze
router.get('/logs', getReceipts); // Logs page

export default router;