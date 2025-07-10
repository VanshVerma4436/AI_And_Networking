import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, BarChart, Shield, Bell, Settings, Users } from 'lucide-react';

const UsageGuide: React.FC = () => {
  const guides = [
    {
      icon: <Monitor className="text-accent-blue" size={32} />,
      title: 'Dashboard Overview',
      steps: [
        'Log in to your account',
        'View real-time network statistics',
        'Monitor active connections and traffic patterns',
        'Check system health indicators'
      ]
    },
    {
      icon: <BarChart className="text-light-blue" size={32} />,
      title: 'Analytics & Reports',
      steps: [
        'Access detailed traffic analytics',
        'View historical data trends',
        'Generate custom reports',
        'Export data in various formats'
      ]
    },
    {
      icon: <Shield className="text-success-green" size={32} />,
      title: 'Security Features',
      steps: [
        'Configure threat detection settings',
        'Set up security policies',
        'Review security logs',
        'Manage blocked IPs and domains'
      ]
    },
    {
      icon: <Bell className="text-alert-orange" size={32} />,
      title: 'Alerts & Notifications',
      steps: [
        'Set up alert preferences',
        'Configure notification channels',
        'Define alert thresholds',
        'Manage alert rules'
      ]
    },
    {
      icon: <Settings className="text-accent-purple" size={32} />,
      title: 'System Configuration',
      steps: [
        'Adjust system settings',
        'Configure network parameters',
        'Manage API integrations',
        'Update security rules'
      ]
    },
    {
      icon: <Users className="text-light-blue" size={32} />,
      title: 'User Management',
      steps: [
        'Add and remove users',
        'Set user permissions',
        'Manage access controls',
        'Review user activity logs'
      ]
    }
  ];

  return (
    <section className="min-h-screen py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-10 z-0 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-blue/50 to-dark-blue opacity-40"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Usage Guide
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Learn how to use Neura Sentinel effectively with our comprehensive guide
            to all features and functionalities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface-dark p-6 rounded-xl border border-blue/20 hover:border-blue/40 transition-colors duration-300"
            >
              <div className="bg-surface-light w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                {guide.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {guide.title}
              </h3>
              <ul className="text-text-secondary space-y-2">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-center">
                    <span className="w-5 h-5 rounded-full bg-blue/20 text-blue flex items-center justify-center text-sm mr-2">
                      {stepIndex + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Need More Help?
          </h2>
          <p className="text-text-secondary mb-8">
            Contact our support team for personalized assistance with your setup.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue to-light-blue text-white rounded-lg shadow-[0_0_15px_rgba(0,166,251,0.3)] hover:shadow-[0_0_25px_rgba(0,166,251,0.5)] transition-shadow duration-300"
          >
            Contact Support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default UsageGuide;
