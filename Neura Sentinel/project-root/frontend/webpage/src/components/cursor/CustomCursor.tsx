import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CustomCursorProps {
  size?: number;
  color?: string;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ 
  size = 20, 
  color = 'rgba(0, 166, 251, 0.6)' 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorSize, setCursorSize] = useState(size);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.classList.contains('interactive')) {
        setIsHovering(true);
        setCursorSize(size * 1.5);
      }
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      setCursorSize(size);
    };

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Add event listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [size]);

  // Add scroll handler to update cursor size
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = Math.min(scrollY / (maxScroll * 0.3), 1);
      
      // Only increase size on first 30% of page scroll
      const newSize = size + (size * scrollPercentage * 0.7);
      
      if (!isHovering) {
        setCursorSize(newSize);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [size, isHovering]);

  return (
    <motion.div
      className="fixed pointer-events-none z-50 mix-blend-difference will-change-transform"
      style={{
        left: 0,
        top: 0,
        x: position.x - cursorSize / 2,
        y: position.y - cursorSize / 2,
      }}
      animate={{
        scale: isClicking ? 0.8 : 1,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        mass: 0.5,
      }}
    >
      <motion.div
        className="rounded-full border-2 flex items-center justify-center"
        style={{
          width: cursorSize,
          height: cursorSize,
          backgroundColor: isHovering ? 'rgba(0, 166, 251, 0.3)' : 'transparent',
          borderColor: color,
        }}
        animate={{
          width: cursorSize,
          height: cursorSize,
        }}
      >
        {isHovering && (
          <motion.div
            className="rounded-full bg-light-blue"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.5, scale: 1 }}
            style={{ width: cursorSize / 4, height: cursorSize / 4 }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;