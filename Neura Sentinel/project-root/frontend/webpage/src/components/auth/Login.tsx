import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    navigate('/dashboard');
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setError('Password reset link sent to your email');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-10 z-0 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-blue/50 to-dark-blue opacity-40"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-surface-dark p-8 rounded-2xl border border-blue/20 relative z-10"
      >
        <div>
          <motion.div 
            className="mx-auto flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-light-blue to-accent-blue text-dark-blue relative overflow-hidden mb-6"
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
            <LogIn size={32} />
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">Sign in to your account</h2>
          <p className="mt-2 text-center text-text-secondary">
            Access your network security dashboard
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-alert-red/10 border border-alert-red/30 text-alert-red p-4 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-text-secondary text-sm">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-surface-light border border-blue/20 rounded-lg text-white focus:ring-2 focus:ring-blue focus:border-blue transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-text-secondary text-sm">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary">
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 bg-surface-light border border-blue/20 rounded-lg text-white focus:ring-2 focus:ring-blue focus:border-blue transition-colors duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-lg text-white ${
                loading 
                  ? 'bg-blue/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue to-light-blue hover:from-light-blue hover:to-accent-blue shadow-[0_0_15px_rgba(0,166,251,0.3)]'
              } transition-all duration-200`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw size={20} />
                </motion.div>
              ) : (
                <>
                  <LogIn size={20} className="mr-2" />
                  Sign in
                </>
              )}
            </motion.button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              className="w-full text-text-secondary hover:text-white transition-colors duration-200 text-sm"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default Login;
