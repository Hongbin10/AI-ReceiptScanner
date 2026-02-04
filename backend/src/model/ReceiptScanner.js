import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'],
    default: 'Other'
  }
});

const receiptSchema = new mongoose.Schema({
  receiptId: { type: String },
  merchantName: { type: String },
  customerName: { type: String },
  date: { type: Date },
  tax: { type: Number },
  discount: { type: Number },
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'creditCard', 'debitCard', 'eMoney'], 
    default: 'cash' 
  },
  currency: { type: String, default: 'USD' },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now }
});

const Receipt = mongoose.model('Receipt', receiptSchema);

export default Receipt;import multer from 'multer';

// 使用内存存储，方便直接将 Buffer 传给 OpenAI
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制 10MB
  }
});