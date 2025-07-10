import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Twitter, Github, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-blue/90 backdrop-blur-md py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-light-blue text-dark-blue">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Neura Sentinel</h2>
                <p className="text-xs text-blue-300 -mt-1">AI Network Analysis</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm mb-4">
              Advanced AI-powered network traffic analysis for threat detection and classification.
            </p>
            <div className="flex space-x-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="text-text-secondary hover:text-light-blue transition-colors duration-300 interactive"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {['Features', 'Security', 'Pricing', 'Documentation'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-secondary text-sm hover:text-light-blue transition-colors duration-300 interactive">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {['Blog', 'Guides', 'Help Center', 'Community'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-secondary text-sm hover:text-light-blue transition-colors duration-300 interactive">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Careers', 'Contact', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-text-secondary text-sm hover:text-light-blue transition-colors duration-300 interactive">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-blue/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Neura Sentinel. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {['Terms', 'Privacy', 'Cookies', 'Security'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-text-secondary text-sm hover:text-light-blue transition-colors duration-300 interactive"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;