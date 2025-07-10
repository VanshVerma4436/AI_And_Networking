import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Network, Zap, LineChart, Bell } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const features = [
    {
      icon: <Shield className="text-accent-blue" size={32} />,
      title: 'AI-Powered Security',
      description: 'Advanced machine learning algorithms continuously monitor your network for potential threats and anomalies.'
    },
    {
      icon: <Network className="text-light-blue" size={32} />,
      title: 'Real-Time Monitoring',
      description: 'Monitor network traffic, connections, and potential security threats in real-time with our intuitive dashboard.'
    },
    {
      icon: <Zap className="text-accent-purple" size={32} />,
      title: 'Instant Response',
      description: 'Automated threat detection and response system that takes immediate action when threats are detected.'
    },
    {
      icon: <LineChart className="text-success-green" size={32} />,
      title: 'Advanced Analytics',
      description: 'Detailed analytics and visualizations help you understand your network behavior and security patterns.'
    },
    {
      icon: <Bell className="text-alert-orange" size={32} />,
      title: 'Smart Alerts',
      description: 'Receive intelligent notifications about important security events and network status changes.'
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
            How It Works
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Discover how Neura Sentinel uses advanced AI technology to protect your network
            and provide real-time security monitoring.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-surface-dark p-6 rounded-xl border border-blue/20 hover:border-blue/40 transition-colors duration-300"
            >
              <div className="bg-surface-light w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary">
                {feature.description}
              </p>
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
            Ready to Get Started?
          </h2>
          <p className="text-text-secondary mb-8">
            Sign up now to experience the power of AI-driven network security.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue to-light-blue text-white rounded-lg shadow-[0_0_15px_rgba(0,166,251,0.3)] hover:shadow-[0_0_25px_rgba(0,166,251,0.5)] transition-shadow duration-300"
          >
            Start Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
