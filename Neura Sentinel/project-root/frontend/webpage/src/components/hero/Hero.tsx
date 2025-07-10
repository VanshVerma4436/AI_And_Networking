import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Server, Network, RadarIcon, AlertTriangle, Cpu, ChevronRight, Play, PauseCircle, Lock } from 'lucide-react';
import ScrollReveal from '../animations/ScrollReveal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: 'Network Monitoring',
      description: 'Our AI system continuously monitors your network traffic in real-time',
      icon: <Network className="w-8 h-8" />,
    },
    {
      title: 'Threat Detection',
      description: 'Advanced algorithms identify potential security threats and anomalies',
      icon: <AlertTriangle className="w-8 h-8" />,
    },
    {
      title: 'Analysis & Classification',
      description: 'Traffic is analyzed and classified to identify patterns and behaviors',
      icon: <Cpu className="w-8 h-8" />,
    },
    {
      title: 'Alert Generation',
      description: 'Instant alerts are generated when suspicious activity is detected',
      icon: <RadarIcon className="w-8 h-8" />,
    },
  ];

  React.useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);

  return (
    <section className="min-h-screen pt-32 pb-16 relative overflow-hidden flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-10 z-0 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-blue/10 via-transparent to-transparent opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-blue/50 to-dark-blue opacity-40"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-light-blue rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <motion.div
        className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-blue/5 filter blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue/20 to-light-blue/20 text-light-blue text-sm mb-6 border border-light-blue/30 shadow-[0_0_15px_rgba(0,166,251,0.2)]"
          >
            <Shield size={16} />
            <span>AI-Powered Network Security</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Intelligent Network Analysis with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-light-blue to-accent-blue">
              AI Precision
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-text-secondary mb-8 md:mb-12 max-w-3xl mx-auto"
          >
            Detect and classify network traffic patterns, identify threats, and secure your network infrastructure with our cutting-edge AI-powered analysis platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="px-6 py-3 bg-gradient-to-r from-blue to-light-blue text-white font-medium rounded-lg shadow-lg shadow-blue/20 interactive group"
            >
              <span className="flex items-center justify-center gap-2">
                {user ? 'Go to Dashboard' : 'Get Started'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const demoSection = document.getElementById('how-it-works');
                demoSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-surface-dark border border-blue/20 text-white font-medium rounded-lg hover:bg-blue/10 transition-colors duration-300 interactive"
            >
              See How It Works
            </motion.button>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-24 mb-32">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Watch our intelligent system analyze and protect your network in real-time
              </p>
            </div>
          </ScrollReveal>

          <div className="relative">
            <ScrollReveal>
              <div className="bg-surface-dark border border-blue/20 rounded-2xl p-8 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue to-light-blue"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />

                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-semibold">Process Visualization</h3>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-light-blue hover:text-blue transition-colors"
                  >
                    {isPlaying ? (
                      <PauseCircle className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className={`p-6 rounded-xl border ${
                        index === activeStep
                          ? 'bg-blue/10 border-light-blue'
                          : 'border-blue/20'
                      } transition-all duration-300`}
                      animate={{
                        scale: index === activeStep ? 1.05 : 1,
                      }}
                    >
                      <div className={`mb-4 ${
                        index === activeStep ? 'text-light-blue' : 'text-blue'
                      }`}>
                        {step.icon}
                      </div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-text-secondary">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: <RadarIcon className="w-8 h-8 text-accent-blue" />,
              title: 'Real-time Monitoring',
              description: 'Continuously analyze your network traffic in real-time to detect anomalies instantly.',
            },
            {
              icon: <AlertTriangle className="w-8 h-8 text-alert-orange" />,
              title: 'Threat Detection',
              description: 'Identify potential security threats with AI-powered pattern recognition algorithms.',
            },
            {
              icon: <Cpu className="w-8 h-8 text-accent-purple" />,
              title: 'Machine Learning',
              description: 'Our advanced ML models continuously learn and adapt to new traffic patterns.',
            },
            {
              icon: <Network className="w-8 h-8 text-light-blue" />,
              title: 'Traffic Classification',
              description: 'Automatically categorize network traffic for better visibility and control.',
            },
            {
              icon: <Server className="w-8 h-8 text-success-green" />,
              title: 'Detailed Analytics',
              description: 'Comprehensive dashboards and reports to visualize your network activity.',
            },
            {
              icon: <Lock className="w-8 h-8 text-blue" />,
              title: 'Enhanced Security',
              description: 'Proactive protection against known and unknown cybersecurity threats.',
            },
          ].map((feature, index) => (
            <ScrollReveal 
              key={index} 
              delay={index * 0.1} 
              direction={index % 2 === 0 ? 'up' : 'down'}
            >
              <motion.div
                whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0, 166, 251, 0.3)' }}
                className="bg-surface-dark border border-blue/10 p-6 rounded-xl hover:border-blue/30 transition-all duration-300"
              >
                <div className="mb-4 rounded-lg bg-dark-blue p-3 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;