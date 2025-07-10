import React, { useState } from 'react';
import axios from 'axios';

const SnifferControls: React.FC = () => {
  const [sniffing, setSniffing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const startSniffer = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post<{ status: string; message: string }>('http://127.0.0.1:8000/sniffer/start-sniffer');
      if (res.data?.status?.toLowerCase().includes("started")) {
        setSniffing(true);
        setMessage("Sniffer started successfully.");
      } else {
        setError(res.data?.message || "Sniffer could not be started.");
      }
    } catch (err) {
      console.error("Start sniffer failed", err);
      setError("Error starting sniffer.");
    } finally {
      setLoading(false);
    }
  };

  const stopSniffer = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await axios.post<{ status: string; message: string }>('http://127.0.0.1:8000/sniffer/stop-sniffer');
      if (res.data?.status?.toLowerCase().includes("stopped")) {
        setSniffing(false);
        setMessage("Sniffer stopped successfully.");
      } else {
        setError(res.data?.message || "Sniffer could not be stopped.");
      }
    } catch (err) {
      console.error("Stop sniffer failed", err);
      setError("Error stopping sniffer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="flex gap-4">
        <button
          onClick={startSniffer}
          className="bg-green-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          disabled={sniffing || loading}
        >
          {loading && !sniffing ? "Starting..." : "Start Sniffing"}
        </button>
        <button
          onClick={stopSniffer}
          className="bg-red-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
          disabled={!sniffing || loading}
        >
          {loading && sniffing ? "Stopping..." : "Stop Sniffing"}
        </button>
      </div>

      {error && <p className="text-red-500 font-medium">{error}</p>}
      {message && <p className="text-green-500 font-medium">{message}</p>}
    </div>
  );
};

export default SnifferControls;
