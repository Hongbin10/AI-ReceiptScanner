import React from 'react';
import { Routes, Route } from 'react-router';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LogsPage from './pages/LogsPage';

const App = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content font-sans">
      <Navbar />
      <div className="py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logs" element={<LogsPage />} />
        </Routes>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
