import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FileText, Calendar, DollarSign, Package, ChevronDown, ChevronUp } from 'lucide-react';

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState(new Set());

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

  const toggleRowExpansion = (logId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
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
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-16">
                    <div className="flex flex-col items-center text-gray-400">
                        <FileText size={48} className="mb-2 opacity-30" />
                        <span className="text-lg">No receipts found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log._id}>
                    <tr className="hover cursor-pointer" onClick={() => toggleRowExpansion(log._id)}>
                      <td>
                        <div className="flex items-center gap-2 font-medium">
                            <Calendar className="w-4 h-4 text-primary/70" />
                            {log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-lg">{log.merchantName || 'Unknown Merchant'}</div>
                      </td>
                      <td>
                        <div className="badge badge-ghost gap-1">
                            <Package size={12} />
                            {log.items ? log.items.length : 0}
                        </div>
                      </td>
                      <td>
                        <div className="font-mono font-bold text-primary text-lg">
                            {log.currency} {parseFloat(log.total).toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <div className="badge badge-outline capitalize">{log.paymentMethod}</div>
                      </td>
                      <td>
                        <div className="flex items-center justify-end">
                          {expandedRows.has(log._id) ? (
                            <ChevronUp className="w-5 h-5 text-primary" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-primary" />
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRows.has(log._id) && (
                      <tr>
                        <td colSpan="6" className="bg-base-200/30 p-0">
                          <div className="p-6 border-l-4 border-primary">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                              <Package className="w-5 h-5 text-primary" />
                              Purchased Items
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="table table-sm">
                                <thead>
                                  <tr className="bg-base-300">
                                    <th>Item</th>
                                    <th className="text-center">Category</th>
                                    <th className="text-center">Quantity</th>
                                    <th className="text-right">Price</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {log.items && log.items.map((item, idx) => (
                                    <tr key={idx} className="hover">
                                      <td>
                                        <div className="font-medium">{item.name}</div>
                                      </td>
                                      <td className="text-center">
                                        <span className="badge badge-ghost badge-sm">{item.category}</span>
                                      </td>
                                      <td className="text-center font-mono">{item.quantity}</td>
                                      <td className="text-right font-mono font-medium">{log.currency} {parseFloat(item.price).toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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