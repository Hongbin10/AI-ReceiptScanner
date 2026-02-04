import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, CheckCircle, ShoppingBag, Loader2 } from 'lucide-react';

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!file) {
      toast.error('Please select a receipt image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();
      setResult(data.data);
      toast.success('Receipt scanned successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="text-center mb-10 mt-4">
        <h1 className="text-4xl font-extrabold mb-3 text-base-content">Scan Your Receipt</h1>
        <p className="text-base-content/60 text-lg">Upload an image and let AI extract the details instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Upload Section */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h2 className="card-title mb-4">Upload Image</h2>
            
            <div className="form-control w-full">
              <input 
                type="file" 
                className="file-input file-input-bordered file-input-primary w-full" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {preview ? (
              <div className="mt-6 rounded-xl overflow-hidden border border-base-300 relative h-80 bg-base-200 flex justify-center items-center">
                <img 
                  src={preview} 
                  alt="Receipt Preview" 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            ) : (
              <div className="mt-6 h-80 border-2 border-dashed border-base-300 rounded-xl flex flex-col items-center justify-center text-base-content/40 bg-base-50/50">
                <Upload size={48} className="mb-2 opacity-50" />
                <p>No image selected</p>
              </div>
            )}

            <div className="card-actions justify-end mt-6">
              <button 
                className="btn btn-primary w-full text-lg" 
                onClick={handleScan}
                disabled={loading || !file}
              >
                {loading ? (
                  <><Loader2 className="animate-spin" /> Scanning...</>
                ) : (
                  <><Upload size={20} /> Scan Receipt</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="card bg-base-100 shadow-xl border border-base-200 h-full">
          <div className="card-body">
            <h2 className="card-title flex justify-between mb-4">
              Analysis Result
              {result && <div className="badge badge-success gap-1 text-white p-3"><CheckCircle size={14} /> Success</div>}
            </h2>

            {!result ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-base-content/40 border-2 border-dashed border-base-300 rounded-xl bg-base-50/50">
                <ShoppingBag size={64} className="mb-4 opacity-30" />
                <p className="text-lg">Scan a receipt to see extracted details</p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title text-xs uppercase font-bold tracking-wider opacity-60">Total Amount</div>
                        <div className="stat-value text-primary text-2xl mt-1">{result.currency} {result.total}</div>
                        <div className="stat-desc mt-1 font-medium">{result.date ? new Date(result.date).toLocaleDateString() : 'No Date'}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg p-4">
                        <div className="stat-title text-xs uppercase font-bold tracking-wider opacity-60">Merchant</div>
                        <div className="stat-value text-lg mt-1 truncate" title={result.merchantName}>{result.merchantName || 'Unknown'}</div>
                        <div className="stat-desc mt-1">
                            <span className="badge badge-outline badge-sm">{result.paymentMethod}</span>
                        </div>
                    </div>
                </div>

                <div className="divider my-0">Items</div>

                {/* Items Table */}
                <div className="overflow-x-auto bg-base-50 rounded-lg border border-base-200 max-h-[400px]">
                  <table className="table table-sm table-pin-rows">
                    <thead>
                      <tr className="bg-base-200">
                        <th>Item Description</th>
                        <th className="text-center">Qty</th>
                        <th className="text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.items && result.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-base-100">
                          <td>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs opacity-50 badge badge-ghost badge-sm mt-1">{item.category}</div>
                          </td>
                          <td className="text-center font-mono">{item.quantity}</td>
                          <td className="text-right font-mono font-medium">{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;