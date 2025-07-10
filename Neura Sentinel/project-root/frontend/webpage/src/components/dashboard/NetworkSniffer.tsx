import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Activity, Shield, AlertTriangle } from 'lucide-react';

const WS_URL = 'ws://127.0.0.1:8000/ws/traffic';

interface Packet {
  id: string;
  src_ip: string;
  dst_ip: string;
  protocol: string;
  length: number;
  timestamp: string;
  label: 'normal' | 'suspicious' | 'malicious';
}

const NetworkSniffer: React.FC = () => {
  const [isSniffing, setIsSniffing] = useState(false);
  const [packets, setPackets] = useState<Packet[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  const startSniffer = async () => {
    try {
      await fetch('http://127.0.0.1:8000/sniffer/start-sniffer', { method: 'POST' });
      setIsSniffing(true);
    } catch (err) {
      console.error('[Start Error]', err);
    }
  };

  const stopSniffer = async () => {
    try {
      await fetch('http://127.0.0.1:8000/sniffer/stop-sniffer', { method: 'POST' });
      setIsSniffing(false);
    } catch (err) {
      console.error('[Stop Error]', err);
    }
  };

  useEffect(() => {
    if (!isSniffing) {
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log('[WS] Connected');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const newPacket: Packet = {
          id: crypto.randomUUID(),
          src_ip: data.src_ip ?? '0.0.0.0',
          dst_ip: data.dst_ip ?? '0.0.0.0',
          protocol: data.protocol ?? 'TCP',
          length: data.length ?? data.total ?? 0,
          timestamp: data.timestamp ?? new Date().toISOString(),
          label: (data.label ?? 'normal').toLowerCase(),
        };

        setPackets((prev) => [newPacket, ...prev].slice(0, 50));
      } catch (err) {
        console.error('[WS Parse Error]', err);
      }
    };

    ws.onerror = (e) => console.error('[WS Error]', e);
    ws.onclose = () => {
      console.log('[WS Closed]');
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [isSniffing]);

  const getPacketColor = (type: string) =>
    type === 'malicious' ? 'text-alert-red'
    : type === 'suspicious' ? 'text-alert-orange'
    : 'text-light-blue';

  const getPacketIcon = (type: string) =>
    type === 'malicious' ? <Shield size={16} />
    : type === 'suspicious' ? <AlertTriangle size={16} />
    : <Activity size={16} />;

  return (
    <div className="bg-surface-dark rounded-xl p-6 border border-blue/20 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          <Activity className="text-light-blue" />
          Network Sniffer
        </h3>
        <motion.button
          onClick={() => (isSniffing ? stopSniffer() : startSniffer())}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            isSniffing ? 'bg-alert-red/20 text-alert-red' : 'bg-success-green/20 text-success-green'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSniffing ? <><WifiOff size={18} /> Stop Sniffing</> : <><Wifi size={18} /> Start Sniffing</>}
        </motion.button>
      </div>

      {/* Live Sniffing Bar */}
      {isSniffing && (
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue to-light-blue"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
          style={{ transformOrigin: 'left' }}
        />
      )}

      {/* Packet List */}
      <div className="h-[400px] overflow-y-auto relative">
        <AnimatePresence>
          {packets.map((packet) => (
            <motion.div
              key={packet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`border-b border-blue/10 py-3 px-4 flex items-center justify-between ${
                packet.label === 'malicious'
                  ? 'bg-alert-red/5'
                  : packet.label === 'suspicious'
                  ? 'bg-alert-orange/5'
                  : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={getPacketColor(packet.label)}>
                  {getPacketIcon(packet.label)}
                </span>
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-secondary">Source:</span>
                    <span className="font-mono text-white">{packet.src_ip}</span>
                    <span className="text-blue">→</span>
                    <span className="text-text-secondary">Dest:</span>
                    <span className="font-mono text-white">{packet.dst_ip}</span>
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    <span className="mr-4">{packet.protocol}</span>
                    <span>{packet.length} bytes</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-text-secondary">
                {new Date(packet.timestamp).toLocaleTimeString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NetworkSniffer;
