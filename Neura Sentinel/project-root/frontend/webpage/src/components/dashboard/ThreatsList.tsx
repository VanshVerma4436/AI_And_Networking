import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldAlert, AlertCircle, Shield } from 'lucide-react';
import { ThreatData } from '../../types';

interface ThreatsListProps {
  threats: ThreatData[];
}

const getSeverityIcon = (severity?: string) => {
  const icons: Record<string, JSX.Element> = {
    critical: <AlertCircle size={16} className="text-alert-red" />,
    high: <AlertTriangle size={16} className="text-alert-orange" />,
    medium: <ShieldAlert size={16} className="text-alert-yellow" />,
    low: <Shield size={16} className="text-light-blue" />,
  };
  return icons[severity || 'low'];
};

const getSeverityClass = (severity?: string) => {
  const classes: Record<string, string> = {
    critical: 'bg-alert-red/10 border-alert-red/20 text-alert-red',
    high: 'bg-alert-orange/10 border-alert-orange/20 text-alert-orange',
    medium: 'bg-alert-yellow/10 border-alert-yellow/20 text-alert-yellow',
    low: 'bg-blue/10 border-blue/20 text-light-blue',
  };
  return classes[severity || 'low'];
};

const getStatusClass = (status?: string) => {
  const classes: Record<string, string> = {
    detected: 'bg-alert-red/20 text-alert-red',
    investigating: 'bg-alert-orange/20 text-alert-orange',
    mitigated: 'bg-alert-yellow/20 text-alert-yellow',
    resolved: 'bg-success-green/20 text-success-green',
  };
  return classes[status || ''] || 'bg-blue/20 text-light-blue';
};

const capitalize = (value?: string) => {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown';
};

const ThreatsList: React.FC<ThreatsListProps> = ({ threats }) => {
  if (!Array.isArray(threats) || threats.length === 0) {
    return <p className="text-text-secondary text-sm mt-4">No threats to display.</p>;
  }

  return (
    <div className="mt-6 space-y-4">
      {threats.map((threat, index) => (
        <motion.div
          key={threat.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className={`p-4 rounded-lg border ${getSeverityClass(threat?.severity)} hover:shadow-md transition-shadow duration-300`}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {getSeverityIcon(threat?.severity)}
              <h3 className="font-medium text-white">{threat?.type || 'Unknown Threat'}</h3>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(threat?.status)}`}>
              {capitalize(threat?.status)}
            </span>
          </div>

          <p className="text-sm text-text-secondary mb-3">
            {threat?.details || 'No details available.'}
          </p>

          <div className="text-xs text-text-secondary flex justify-between items-center">
            <div className="font-mono">
              <span>From: </span>
              <span className="text-white">{threat?.source || 'N/A'}</span>
              <span className="mx-2 text-blue">→</span>
              <span>To: </span>
              <span className="text-white">{threat?.destination || 'N/A'}</span>
            </div>
            <span>{threat?.timestamp ? new Date(threat.timestamp).toLocaleTimeString() : 'Unknown time'}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ThreatsList;
