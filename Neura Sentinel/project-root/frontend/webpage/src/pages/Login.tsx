import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MatrixRain from '../components/animations/MatrixRain';
import HexagonGrid from '../components/animations/HexagonGrid';
import Typed from 'typed.js';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const typedRef = React.useRef(null);

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        'Initializing secure connection...',
        'Establishing encrypted channel...',
        'Accessing neural network...',
        'Ready for authentication.'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1000,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: '_'
    });

    return () => {
      typed.destroy();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Changed here: justify-end and pr-16 for right side alignment & padding
    <div className="min-h-screen bg-dark-blue flex items-center justify-end p-4 pr-16 relative overflow-hidden">
      <MatrixRain />
      <HexagonGrid />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="bg-surface-dark/80 p-8 rounded-2xl border border-blue/20 shadow-xl backdrop-blur-md"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(0, 166, 251, 0)',
              '0 0 30px 5px rgba(0, 166, 251, 0.3)',
              '0 0 0 0 rgba(0, 166, 251, 0)'
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div
            className="flex justify-center mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue to-light-blue rounded-2xl flex items-center justify-center relative">
              <Shield className="w-8 h-8 text-white" />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue to-light-blue"
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>

          <div className="text-center mb-8">
            <span ref={typedRef} className="text-light-blue text-sm" />
          </div>

          <motion.h2
            className="text-2xl font-bold text-white text-center mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isSignUp ? 'Create Secure Account' : 'Secure Authentication'}
          </motion.h2>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-alert-red/10 border border-alert-red/20 rounded-lg p-4 mb-6 flex items-center gap-2"
              >
                <AlertTriangle className="text-alert-red" size={20} />
                <p className="text-alert-red text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Secure Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-hover:text-light-blue transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-blue/50 border border-blue/20 rounded-lg py-3 px-10 text-white placeholder-text-secondary focus:outline-none focus:border-light-blue focus:ring-1 focus:ring-light-blue transition-all duration-300"
                  placeholder="Enter your email"
                  required
                />
                <motion.div
                  className="absolute inset-0 border border-light-blue/50 rounded-lg opacity-0 group-hover:opacity-100"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(0, 166, 251, 0)',
                      '0 0 10px 2px rgba(0, 166, 251, 0.3)',
                      '0 0 0 0 rgba(0, 166, 251, 0)'
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Encryption Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-hover:text-light-blue transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-blue/50 border border-blue/20 rounded-lg py-3 px-10 text-white placeholder-text-secondary focus:outline-none focus:border-light-blue focus:ring-1 focus:ring-light-blue transition-all duration-300"
                  placeholder="Enter your password"
                  required
                />
                <motion.div
                  className="absolute inset-0 border border-light-blue/50 rounded-lg opacity-0 group-hover:opacity-100"
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(0, 166, 251, 0)',
                      '0 0 10px 2px rgba(0, 166, 251, 0.3)',
                      '0 0 0 0 rgba(0, 166, 251, 0)'
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 166, 251, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-blue/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue to-light-blue hover:shadow-lg hover:shadow-blue/20 transition-all duration-300'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>{isSignUp ? 'Initialize Secure Account' : 'Access Secure Network'}</span>
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-text-secondary hover:text-light-blue transition-colors duration-300"
            >
              {isSignUp
                ? 'Already have secure access? Sign in'
                : "Need secure access? Create account"}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
