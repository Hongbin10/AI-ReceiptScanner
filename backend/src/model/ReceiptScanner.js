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
  merchantName: { type: String },
  date: { type: Date },
  discount: { type: Number },
  total: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card'], 
    default: 'card' 
  },
  currency: { type: String, default: 'GBP' },
  items: [itemSchema],
  createdAt: { type: Date, default: Date.now }
});

const Receipt = mongoose.model('Receipt', receiptSchema);

// Virtual property to format total with 2 decimal places
receiptSchema.virtual('formattedTotal').get(function() {
  return (this.total || 0).toFixed(2);
});

export default Receipt;import multer from 'multer';

// Use in-memory storage to conveniently pass the Buffer directly to OpenAI 
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
    fileSize: 10 * 1024 * 1024 // Limit 10MB    
  }
});