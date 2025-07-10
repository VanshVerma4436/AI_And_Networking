import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { NetworkStat } from '../../types';

interface StatCardProps {
  stat: NetworkStat;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
  const { name, value, unit, delta, percentage = 50 } = stat;

  const isPositive = delta !== undefined ? delta >= 0 : null;
  const displayValue = value !== undefined ? value : 'N/A';
  const barPercent = Math.min(100, Math.max(0, percentage));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="bg-surface-dark rounded-xl p-5 border border-blue/10 backdrop-blur-xs hover:shadow-lg hover:shadow-blue/5 transition-all duration-300"
    >
      {/* Stat Title */}
      <h3 className="text-text-secondary font-medium mb-2">{name}</h3>

      {/* Value + Delta */}
      <div className="flex items-end justify-between">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-white">{displayValue}</span>
          {unit && <span className="text-text-secondary ml-1">{unit}</span>}
        </div>

        {delta !== undefined && isPositive !== null && (
          <div className={`flex items-center ${isPositive ? 'text-success-green' : 'text-alert-red'}`}>
            {isPositive ? <ArrowUp size={16} className="mr-1" /> : <ArrowDown size={16} className="mr-1" />}
            <span className="text-sm font-medium">{Math.abs(delta)}{unit && ` ${unit}`}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-2 w-full h-1 bg-blue/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue via-blue to-light-blue"
          initial={{ width: 0 }}
          animate={{ width: `${barPercent}%` }}
          transition={{ delay: 0.2 * index, duration: 0.7 }}
        />
      </div>
    </motion.div>
  );
};

export default StatCard;
