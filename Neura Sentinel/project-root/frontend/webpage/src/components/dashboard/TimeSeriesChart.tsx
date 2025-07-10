import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

interface TimeSeriesPoint {
  time: number;
  displayTime: string;
  fwd: number;
  bwd: number;
  total: number;
}

interface TimeSeriesChartProps {
  title: string;
  type?: 'line' | 'area';
  index?: number;
  colorFwd?: string;
  colorBwd?: string;
  colorTotal?: string;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  title,
  type = 'line',
  index = 0,
  colorFwd = '#00C6FB',
  colorBwd = '#FB5607',
  colorTotal = '#8338EC',
}) => {
  const [data, setData] = useState<TimeSeriesPoint[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/traffic');
    
    socket.onmessage = (event) => {
      try {
        const { fwd = 0, bwd = 0, timestamp = Date.now() } = JSON.parse(event.data);
        const time = String(timestamp).length > 12 ? timestamp : timestamp * 1000;

        const point: TimeSeriesPoint = {
          time,
          displayTime: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          fwd: Number(fwd),
          bwd: Number(bwd),
          total: Number(fwd) + Number(bwd),
        };

        setData((prev) => [...prev.slice(-29), point]);
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    return () => socket.close();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => (
    active && payload?.length ? (
      <div className="bg-surface-dark p-3 border border-blue/30 rounded shadow-lg">
        <p className="text-text-secondary text-xs">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-white font-medium">
            {entry.name}: {entry.value} pkts
          </p>
        ))}
      </div>
    ) : null
  );

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 10, right: 10, bottom: 20 },
    };

    const axes = (
      <>
        <XAxis dataKey="displayTime" stroke="#A9B8D5" tick={{ fill: '#A9B8D5', fontSize: 12 }} axisLine={{ stroke: 'rgba(5, 130, 202, 0.3)' }} />
        <YAxis stroke="#A9B8D5" tick={{ fill: '#A9B8D5', fontSize: 12 }} axisLine={{ stroke: 'rgba(5, 130, 202, 0.3)' }} />
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(5, 130, 202, 0.1)" />
        <Tooltip content={<CustomTooltip />} />
      </>
    );

    return type === 'line' ? (
      <LineChart {...chartProps}>
        {axes}
        <Line dataKey="fwd" name="Forward" stroke={colorFwd} strokeWidth={2} dot={false} />
        <Line dataKey="bwd" name="Backward" stroke={colorBwd} strokeWidth={2} dot={false} />
        <Line dataKey="total" name="Total" stroke={colorTotal} strokeWidth={2} dot={false} />
      </LineChart>
    ) : (
      <AreaChart {...chartProps}>
        <defs>
          <linearGradient id="colorFwd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colorFwd} stopOpacity={0.3} />
            <stop offset="95%" stopColor={colorFwd} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorBwd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colorBwd} stopOpacity={0.3} />
            <stop offset="95%" stopColor={colorBwd} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colorTotal} stopOpacity={0.3} />
            <stop offset="95%" stopColor={colorTotal} stopOpacity={0} />
          </linearGradient>
        </defs>
        {axes}
        <Area type="monotone" dataKey="fwd" stroke={colorFwd} fill="url(#colorFwd)" strokeWidth={2} name="Forward" />
        <Area type="monotone" dataKey="bwd" stroke={colorBwd} fill="url(#colorBwd)" strokeWidth={2} name="Backward" />
        <Area type="monotone" dataKey="total" stroke={colorTotal} fill="url(#colorTotal)" strokeWidth={2} name="Total" />
      </AreaChart>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="bg-surface-dark rounded-xl p-5 border border-blue/10 h-full"
    >
      <h3 className="text-white font-medium mb-4">{title}</h3>
      <div className="h-[250px] w-full">
        {data.length === 0 ? (
          <div className="text-text-secondary text-sm text-center pt-10">
            Waiting for live traffic data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default TimeSeriesChart;
