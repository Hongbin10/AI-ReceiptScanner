import Receipt from '../model/ReceiptScanner.js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

// Internal auxiliary function: Call OpenAI to analyze images
const analyzeImageWithOpenAI = async (buffer, mimetype) => {
  const base64Image = buffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64Image}`;

  const prompt = `
    Analyze this receipt image and extract the following information in strict JSON format.
    Do not include any markdown formatting (like \`\`\`json). Just return the raw JSON object.
    
    
    JSON Structure:
    {
        "merchantName": "Merchant Name (string, omit if not found)",
        "date": "Date (YYYY-MM-DD)",
        "discount": "Discount amount (number, omit if not found)",
        "total": "Total amount (number)",
        "paymentMethod": "Payment Method (enum: 'cash', 'card'; default 'card')",
        "currency": "Currency Code (e.g., )",
        "items": [
            {
                "name": "Item Name (string)",
                "price": "Line Total Price (number)",
                "quantity": "Quantity (number)",
                "category": "Category (enum: 'Food','Utilities', 'Entertainment', 'Health', 'Other')"
            }
        ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL, // ensure your account can use gpt-4o or gpt-4-turbo
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content.trim();
    // Remove possible Markdown code block markers
    const jsonString = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to analyze receipt image.");
  }
};

// 1. Upload and analyze API        
export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Call LLM to analyze the image
    const receiptData = await analyzeImageWithOpenAI(req.file.buffer, req.file.mimetype);
    
    // Validate date format - must be DD/MM/YYYY or DD.MM.YYYY format
    const isValidDate = (dateStr) => {
      if (!dateStr) return false;
      // Check for DD/MM/YYYY or DD.MM.YYYY format
      const regex = /^(0[1-9]|[12][0-9]|3[01])[\/\.](0[1-9]|1[012])[\/\.](19|20)\d\d$/;
      return regex.test(dateStr);
    };

    // Normalize payment method: if it contains 'card', use 'card'; otherwise use 'cash'
    const normalizedData = {
      ...receiptData,
      paymentMethod: receiptData.paymentMethod?.toLowerCase().includes('card') ? 'card' : 'cash',
      // Set date to null if not in required format
      date: isValidDate(receiptData.date) ? receiptData.date : null
    };

    // Save to database
    const newReceipt = new Receipt(normalizedData);
    const savedReceipt = await newReceipt.save();

    // Format the response with 2 decimal places
    const plainReceipt = savedReceipt.toObject();
    const responseData = {
      ...plainReceipt,
      total: parseFloat(plainReceipt.total).toFixed(2),
      items: plainReceipt.items.map(item => ({
        ...item,
        name: item.name, // 兜底空值
        quantity: item.quantity, // 确保是数字且兜底
        price: parseFloat(item.price).toFixed(2)
      }))
    };

    res.status(201).json({
      message: 'Receipt processed successfully',
      data: responseData
    });
  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ message: error.message || 'An unknown server error occurred.' });
  }
};

// 2. Get all receipt logs API
export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching receipts', error: error.message });
  }
};

// 3. Home/Welcome API
export const getHome = (req, res) => {
  res.json({ 
    message: "Welcome to AI Receipt Scanner API",
    endpoints: {
      upload: "POST /api/upload (Body: form-data with 'receipt' file)",
      logs: "GET /api/logs"
    }
  });
};