import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Analytics', href: '#analytics' },
    { name: 'Security', href: '#security' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Usage Guide', href: '/usage-guide' },
  ];


  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 backdrop-blur-md ${
        scrolled 
          ? 'bg-navy-blue/90 py-3 shadow-lg border-b border-blue/20' 
          : 'bg-gradient-to-b from-navy-blue/50 to-transparent py-5'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center relative">
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <motion.div 
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-light-blue to-accent-blue text-dark-blue relative overflow-hidden"
            animate={{
              boxShadow: ['0 0 0 0 rgba(0, 166, 251, 0)', '0 0 20px 5px rgba(0, 166, 251, 0.5)', '0 0 0 0 rgba(0, 166, 251, 0)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-20 animate-pulse"></div>
            <Shield size={24} />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-white">Neura Sentinel</h1>
            <p className="text-xs text-blue-300 -mt-1">AI Network Analysis</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 ml-auto">
          <nav className="flex items-center gap-8">
            {navigation.map((item: { name: string; href: string }, index: number) => (
              <motion.a 
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-white transition-colors duration-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {item.name}
              </motion.a>
            ))}
          </nav>
          
          <motion.button
            onClick={() => navigate('/login')}
            className="relative overflow-hidden bg-gradient-to-r from-blue to-light-blue text-white px-6 py-2 rounded-md flex items-center gap-2 interactive ml-6 border border-light-blue/30 shadow-[0_0_15px_rgba(0,166,251,0.3)]"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 20px rgba(0, 166, 251, 0.5)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <LogIn size={18} />
            <span>Login / Get Started</span>
          </motion.button>
        </div>

        <motion.button
          className="md:hidden text-white p-2 rounded-lg bg-blue/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              rotate: mobileMenuOpen ? 45 : 0,
              y: mobileMenuOpen ? 8 : 0
            }}
            className="w-6 h-0.5 bg-current mb-2"
          />
          <motion.div
            animate={{
              opacity: mobileMenuOpen ? 0 : 1
            }}
            className="w-6 h-0.5 bg-current mb-2"
          />
          <motion.div
            animate={{
              rotate: mobileMenuOpen ? -45 : 0,
              y: mobileMenuOpen ? -8 : 0
            }}
            className="w-6 h-0.5 bg-current"
          />
        </motion.button>
      </div>

      <motion.nav
        className="md:hidden bg-navy-blue/95 backdrop-blur-md absolute w-full py-4 px-4"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: mobileMenuOpen ? 'auto' : 0,
          opacity: mobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="flex flex-col gap-4"
          initial="closed"
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={{
            open: {
              clipPath: "inset(0% 0% 0% 0% round 10px)",
              transition: {
                type: "spring",
                bounce: 0,
                duration: 0.7,
                delayChildren: 0.3,
                staggerChildren: 0.05
              }
            },
            closed: {
              clipPath: "inset(10% 50% 90% 50% round 10px)",
              transition: {
                type: "spring",
                bounce: 0,
                duration: 0.3
              }
            }
          }}
        >
          {navigation.map((item: { name: string; href: string }) => (
            <motion.a 
              key={item.name}
              href={item.href}
              className="text-text-secondary hover:text-light-blue py-2 transition-colors duration-300 flex items-center gap-3 interactive"
              onClick={() => setMobileMenuOpen(false)}
              whileHover={{ x: 10, color: '#00A6FB' }}
            >
              {item.icon}
              <span>{item.name}</span>
            </motion.a>
          ))}
          
          <motion.button
            onClick={() => {
              navigate('/login');
              setMobileMenuOpen(false);
            }}
            className="bg-gradient-to-r from-blue to-light-blue text-white px-4 py-2 rounded-md flex items-center gap-2 mt-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogIn size={18} />
            <span>Login / Get Started</span>
          </motion.button>
        </motion.div>
      </motion.nav>
    </motion.header>
  );
};

export default Header;