# AI Receipt Scanner

A full-stack web application that uses AI to automatically extract and structure receipt data from uploaded images. Built with React, Node.js, Express, MongoDB, and OpenAI's vision API.

## Features

- **AI-Powered Receipt Scanning**: Upload receipt images and automatically extract key information
- **Structured Data Extraction**: Extracts merchant name, date, items, quantities, prices, total amount, payment method, and discount
- **Smart Date Validation**: Strict date format validation (DD/MM/YYYY or DD.MM.YYYY) with fallback to null for invalid dates
- **Responsive UI**: Clean, modern interface with DaisyUI components and Tailwind CSS
- **Scan History**: View all previously scanned receipts with expandable item details
- **Real-time Processing**: Fast image upload and processing with loading indicators
- **Error Handling**: Comprehensive error handling with user-friendly toast notifications

## Tech Stack

### Frontend
- React 19 with Vite
- Tailwind CSS + DaisyUI for styling
- React Router for navigation
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- OpenAI API for image analysis
- Multer for file upload handling
- CORS enabled for cross-origin requests

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI-Receipt Scanner
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/receipt-scanner
   OPENAI_API_KEY=your-openai-api-key-here
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Development Mode

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

### Production Mode

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

## API Endpoints

### POST /api/upload
Upload and analyze a receipt image
- **Request**: Multipart form data with `receipt` field containing image file
- **Response**: Structured receipt data including items, total, merchant info, etc.

### GET /api/logs
Retrieve all scanned receipts
- **Response**: Array of receipt objects with full details

## Data Structure

### Receipt Object
```json
{
  "merchantName": "Store Name",
  "date": "DD/MM/YYYY",
  "total": 99.99,
  "currency": "$",
  "paymentMethod": "card|cash",
  "discount": 5.00,
  "items": [
    {
      "name": "Item Name",
      "quantity": 2,
      "price": 49.99,
      "category": "Category"
    }
  ]
}
```


## File Structure

```
AI-Receipt Scanner/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

