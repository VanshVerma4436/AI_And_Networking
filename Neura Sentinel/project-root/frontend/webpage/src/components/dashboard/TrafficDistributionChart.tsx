import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface TrafficDistributionChartProps {
  title: string;
}

interface LabelCounter {
  [label: string]: number;
}

const COLORS = ['#00A6FB', '#FF8A47', '#FF445A']; // normal, suspicious, malicious

const TrafficDistributionChart: React.FC<TrafficDistributionChartProps> = ({ title }) => {
  const [labelCounts, setLabelCounts] = useState<LabelCounter>({
    normal: 0,
    suspicious: 0,
    malicious: 0,
  });

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/traffic');

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const rawLabel = (payload.label || '').toUpperCase();

        let mappedLabel: keyof LabelCounter | null = null;
        if (rawLabel === 'BENIGN') mappedLabel = 'normal';
        else if (rawLabel === 'DOS' || rawLabel === 'MALICIOUS') mappedLabel = 'malicious';
        else if (rawLabel === 'SUSPICIOUS') mappedLabel = 'suspicious';

        if (mappedLabel) {
          setLabelCounts((prev) => ({
            ...prev,
            [mappedLabel!]: prev[mappedLabel!] + 1,
          }));
        }
      } catch (error) {
        console.error('WebSocket parse error:', error);
      }
    };

    socket.onerror = (e) => console.error('WebSocket error:', e);
    return () => socket.close();
  }, []);

  const total = Object.values(labelCounts).reduce((a, b) => a + b, 0);

  const chartData = Object.entries(labelCounts)
    .filter(([_, count]) => count > 0)
    .map(([name, count]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: count,
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percent = ((value / total) * 100).toFixed(1);
      return (
        <div className="bg-surface-dark p-2 border border-blue/30 rounded shadow-lg">
          <p className="text-white font-medium">
            {`${name}: ${percent}% (${value})`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface-dark rounded-xl p-5 border border-blue/10 h-full"
    >
      <h3 className="text-white font-medium mb-4">{title}</h3>
      <div className="h-[250px] w-full">
        {chartData.length === 0 ? (
          <div className="text-text-secondary text-sm text-center pt-10">
            Waiting for classification data...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                dataKey="value"
                strokeWidth={2}
                stroke="#051937"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value) => (
                  <span className="text-text-secondary text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default TrafficDistributionChart;

