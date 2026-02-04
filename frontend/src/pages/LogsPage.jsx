import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, Calendar, DollarSign, Package } from 'lucide-react';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs');
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      toast.error('Could not load history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center gap-3 mb-8 mt-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
            <FileText className="w-8 h-8" />
        </div>
        <div>
            <h1 className="text-3xl font-bold">Scan History</h1>
            <p className="text-base-content/60">View all your previously scanned receipts</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50 text-base-content/70">
              <tr>
                <th>Date</th>
                <th>Merchant</th>
                <th>Items Count</th>
                <th>Total Amount</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16">
                    <div className="flex flex-col items-center text-gray-400">
                        <FileText size={48} className="mb-2 opacity-30" />
                        <span className="text-lg">No receipts found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover">
                    <td>
                        <div className="flex items-center gap-2 font-medium">
                            <Calendar className="w-4 h-4 text-primary/70" />
                            {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                        </div>
                    </td>
                    <td>
                        <div className="font-bold text-lg">{log.merchantName || 'Unknown Merchant'}</div>
                        <div className="text-xs opacity-50">{log.receiptId || 'No ID'}</div>
                    </td>
                    <td>
                        <div className="badge badge-ghost gap-1">
                            <Package size={12} />
                            {log.items ? log.items.length : 0}
                        </div>
                    </td>
                    <td>
                        <div className="font-mono font-bold text-primary text-lg">
                            {log.currency} {log.total}
                        </div>
                    </td>
                    <td>
                      <div className="badge badge-outline capitalize">{log.paymentMethod}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;