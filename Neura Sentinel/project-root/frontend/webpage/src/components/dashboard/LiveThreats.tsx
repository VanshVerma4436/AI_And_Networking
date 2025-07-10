import React, { useEffect, useState } from 'react';
import ThreatsList from './ThreatsList';

interface ThreatData {
  id: string;
  type: string;
  severity: string;
  status: string;
  source: string;
  destination: string;
  details: string;
  timestamp: number;
}

const mapSeverity = (label = ''): string => {
  const l = label.toUpperCase();
  if (l === 'BENIGN') return 'low';
  if (['DOS', 'DDOS'].includes(l)) return 'critical';
  if (['PORTSCAN', 'BRUTEFORCE'].includes(l)) return 'high';
  return 'medium';
};

const LiveThreats: React.FC = () => {
  const [threats, setThreats] = useState<ThreatData[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://127.0.0.1:8000/ws/traffic');

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const label = data.label?.toUpperCase();

        if (!label || label === 'BENIGN') return;

        const newThreat: ThreatData = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type: label,
          severity: mapSeverity(label),
          status: 'detected',
          source: data.src_ip || 'unknown',
          destination: data.dst_ip || 'unknown',
          details: `Detected ${label} traffic. Fwd=${data.fwd}, Bwd=${data.bwd}`,
          timestamp: data.timestamp || Date.now(),
        };

        setThreats((prev) => [newThreat, ...prev].slice(0, 20));
      } catch (err) {
        console.error('[WebSocket Threat Error]', err);
      }
    };

    return () => socket.close();
  }, []);

  return <ThreatsList threats={threats} />;
};

export default LiveThreats;
