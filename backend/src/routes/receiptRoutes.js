import express from 'express';
import { uploadReceipt, getReceipts, getHome } from '../controllers/receiptController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getHome); // 主页
router.post('/upload', upload.single('receipt'), uploadReceipt); // 上传并分析
router.get('/logs', getReceipts); // 日志页

export default router;