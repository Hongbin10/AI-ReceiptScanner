import Receipt from '../model/ReceiptScanner.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 内部辅助函数：调用 OpenAI 分析图片
const analyzeImageWithOpenAI = async (buffer, mimetype) => {
  const base64Image = buffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64Image}`;

  const prompt = `
    Analyze this receipt image and extract the following information in strict JSON format.
    Do not include any markdown formatting (like \`\`\`json). Just return the raw JSON object.
    
    JSON Structure:
    {
        "receiptId": "Receipt ID or Number (string, omit if not found)",
        "merchantName": "Merchant Name (string, omit if not found)",
        "customerName": "Customer Name (string, omit if not found)",
        "date": "Date (YYYY-MM-DD)",
        "tax": "Tax amount (number, omit if not found)",
        "discount": "Discount amount (number, omit if not found)",
        "total": "Total amount (number)",
        "paymentMethod": "Payment Method (enum: 'cash', 'creditCard', 'debitCard', 'eMoney'; default 'cash')",
        "currency": "Currency Code (e.g., USD)",
        "items": [
            {
                "name": "Item Name (string)",
                "price": "Line Total Price (number)",
                "quantity": "Quantity (number)",
                "category": "Category (enum: 'Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other')"
            }
        ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 请确保您的账号可以使用 gpt-4o 或 gpt-4-turbo
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
    // 清理可能存在的 Markdown 代码块标记
    const jsonString = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to analyze receipt image.");
  }
};

// 1. 上传并分析 API
export const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // 调用 LLM 分析
    const receiptData = await analyzeImageWithOpenAI(req.file.buffer, req.file.mimetype);
    
    // 存入数据库
    const newReceipt = new Receipt(receiptData);
    await newReceipt.save();

    res.status(201).json({
      message: 'Receipt processed successfully',
      data: newReceipt
    });
  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ message: 'Error processing receipt', error: error.message });
  }
};

// 2. 获取所有收据日志 API
export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching receipts', error: error.message });
  }
};

// 3. 主页/欢迎 API
export const getHome = (req, res) => {
  res.json({ 
    message: "Welcome to AI Receipt Scanner API",
    endpoints: {
      upload: "POST /api/upload (Body: form-data with 'receipt' file)",
      logs: "GET /api/logs"
    }
  });
};