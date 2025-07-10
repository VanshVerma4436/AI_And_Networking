import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, ArrowDown, ArrowUp, Search } from 'lucide-react';
import { TrafficData } from '../../types';

interface TrafficTableProps {
  data: TrafficData[];
}

const TrafficTable: React.FC<TrafficTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<keyof TrafficData>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [liveTraffic, setLiveTraffic] = useState<TrafficData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/traffic');
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const ts = msg.timestamp || Date.now();
      const timestamp = ts.toString().length < 13 ? ts * 1000 : ts;

      const newTraffic: TrafficData = {
        id: Date.now().toString(),
        source: 'Live',
        destination: 'System',
        protocol: 'LIVE',
        type: msg.label,
        size: msg.fwd + msg.bwd,
        timestamp,
        status:
          msg.label === 'BENIGN'
            ? 'normal'
            : msg.label === 'DoS'
            ? 'blocked'
            : 'suspicious',
      };

      setLiveTraffic((prev) => [newTraffic, ...prev.slice(0, 99)]);
    };
    return () => socket.close();
  }, []);

  const handleSort = (field: keyof TrafficData) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const allData = useMemo(() => [...liveTraffic, ...data], [liveTraffic, data]);

  const filteredData = allData.filter((item) =>
    [item.source, item.destination, item.type]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="mt-6 w-full">
      <div className="flex items-center mb-4 gap-2 bg-surface-dark p-3 rounded-lg border border-blue/10">
        <Search size={16} className="text-blue" />
        <input
          type="text"
          placeholder="Search by source, destination, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-white placeholder:text-text-secondary focus:outline-none w-full"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full overflow-x-auto"
      >
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-text-secondary text-xs border-b border-blue/10">
              {(['timestamp', 'source', 'destination', 'protocol', 'type', 'size', 'status'] as const).map((field) => (
                <th key={field} className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort(field)}>
                  <div className="flex items-center gap-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    {sortField === field &&
                      (sortDirection === 'asc' ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((traffic, index) => (
              <motion.tr
                key={traffic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.01 }}
                className={`text-sm border-b border-blue/5 ${
                  traffic.status === 'suspicious'
                    ? 'bg-alert-orange/10'
                    : traffic.status === 'blocked'
                    ? 'bg-alert-red/10'
                    : ''
                }`}
              >
                <td className="px-4 py-3">{new Date(traffic.timestamp).toLocaleTimeString()}</td>
                <td className="px-4 py-3 font-mono text-xs text-white">{traffic.source}</td>
                <td className="px-4 py-3 font-mono text-xs text-white">{traffic.destination}</td>
                <td className="px-4 py-3 text-text-secondary">{traffic.protocol}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded bg-blue/20 text-light-blue">
                    {traffic.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {traffic.size < 1000
                    ? `${traffic.size} B`
                    : `${(traffic.size / 1000).toFixed(1)} KB`}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs">
                    {traffic.status === 'normal' && (
                      <span className="bg-success-green/20 text-success-green px-2 py-1 rounded-full flex items-center gap-1">
                        <Shield size={12} /> Normal
                      </span>
                    )}
                    {traffic.status === 'suspicious' && (
                      <span className="bg-alert-orange/20 text-alert-orange px-2 py-1 rounded-full flex items-center gap-1">
                        <AlertTriangle size={12} /> Suspicious
                      </span>
                    )}
                    {traffic.status === 'blocked' && (
                      <span className="bg-alert-red/20 text-alert-red px-2 py-1 rounded-full flex items-center gap-1">
                        <Shield size={12} /> Blocked
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default TrafficTable;
