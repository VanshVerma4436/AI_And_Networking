import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, AlertTriangle, Activity, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

import StatCard from './StatCard';
import TrafficTable from './TrafficTable';
import ThreatsList from './ThreatsList';
import TrafficDistributionChart from './TrafficDistributionChart';
import TimeSeriesChart from './TimeSeriesChart';
import NetworkSniffer from './NetworkSniffer';
import ScrollReveal from '../animations/ScrollReveal';
import { NetworkStat } from '../../types';

interface WSMessage {
  fwd: number;
  bwd: number;
  label?: string;
  timestamp?: number;
  src_ip?: string;
  dst_ip?: string;
}

interface TrafficEntry extends WSMessage {
  id: string;
}

interface ThreatEntry {
  src_ip: string;
  dst_ip: string;
  label: string;
  timestamp: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<NetworkStat[]>([]);
  const [traffic, setTraffic] = useState<TrafficEntry[]>([]);
  const [threats, setThreats] = useState<ThreatEntry[]>([]);
  const [labelCounts, setLabelCounts] = useState<{ [label: string]: number }>({});

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/traffic")


    socket.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        const fwd = Number(data.fwd || 0);
        const bwd = Number(data.bwd || 0);
        const total = fwd + bwd;
        const label = data.label || 'unknown';

        const newEntry: TrafficEntry = {
          id: Date.now().toString(),
          ...data,
        };

        setStats([
          { name: 'Forward Packets', value: fwd, unit: 'pkts', delta: randomDelta(), percentage: (fwd / 2000) * 100 },
          { name: 'Backward Packets', value: bwd, unit: 'pkts', delta: randomDelta(), percentage: (bwd / 2000) * 100 },
          { name: 'Total Traffic', value: total, unit: 'bytes', delta: randomDelta(20), percentage: (total / 4000) * 100 },
        ]);

        setTraffic((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep max 50
        if (label !== 'Normal') {
          setThreats((prev) => [{ src_ip: data.src_ip!, dst_ip: data.dst_ip!, label, timestamp: Date.now() }, ...prev.slice(0, 19)]);
        }

        setLabelCounts((prev) => ({
          ...prev,
          [label]: (prev[label] || 0) + 1,
        }));
      } catch (err) {
        console.error('WebSocket parsing error:', err);
      }
    };

    socket.onerror = (e) => console.error('WebSocket error:', e);
    socket.onclose = () => console.warn('WebSocket closed');

    return () => socket.close();
  }, []);

  const randomDelta = (range = 10): number => Math.floor(Math.random() * range - range / 2);

  const handleRestart = async () => {
    try {
      const res = await fetch('http://localhost:8000/sniffer/restart', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to restart sniffer');
      console.log('Sniffer restarted');
    } catch (err) {
      console.error('Restart error:', err);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <section id="dashboard" className="py-16 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Network Dashboard</h2>
            <p className="text-text-secondary">Real-time analysis and monitoring</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="mt-4 md:mt-0 px-4 py-2 bg-surface-dark border border-blue/20 text-white rounded-lg flex items-center gap-2 hover:bg-blue/10 transition-colors duration-300 interactive"
          >
            <RefreshCw size={16} />
            <span>Restart Sniffer</span>
          </motion.button>
        </div>

        {/* Live Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <StatCard key={`${stat.name}-${i}`} stat={stat} index={i} />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mb-8">
            <NetworkSniffer />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ScrollReveal direction="left">
            <div className="bg-surface-dark rounded-xl p-5 border border-blue/10">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={20} className="text-light-blue" />
                <h3 className="text-xl font-semibold text-white">Live Traffic Stream</h3>
              </div>
              <TimeSeriesChart title="Live Traffic Stream" type="area" />
            </div>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ScrollReveal direction="up">
            <TrafficDistributionChart
              title="Traffic Label Distribution"
              data={Object.entries(labelCounts).map(([label, count]) => ({ label, value: count }))}
            />
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ScrollReveal className="lg:col-span-2">
            <div className="bg-surface-dark rounded-xl p-5 border border-blue/10">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 size={20} className="text-light-blue" />
                <h3 className="text-xl font-semibold text-white">Recent Traffic</h3>
              </div>
              <TrafficTable data={traffic} />
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="bg-surface-dark rounded-xl p-5 border border-blue/10">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={20} className="text-alert-red" />
                <h3 className="text-xl font-semibold text-white">Active Threats</h3>
              </div>
              <ThreatsList threats={threats} />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
