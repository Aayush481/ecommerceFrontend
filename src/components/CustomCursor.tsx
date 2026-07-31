'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  // Instantly changing coordinate variables
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth lagging spring trail variables
  const trailX = useSpring(cursorX, { damping: 26, stiffness: 220 });
  const trailY = useSpring(cursorY, { damping: 26, stiffness: 220 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const addHoverEvents = () => {
      document.querySelectorAll('a, button, select, input, textarea, [role="button"], label').forEach((el) => {
        el.addEventListener('mouseenter', () => setLinkHovered(true));
        el.addEventListener('mouseleave', () => setLinkHovered(false));
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    addHoverEvents();
    
    const observer = new MutationObserver(addHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, [cursorX, cursorY]);

  if (hidden) return null;

  return (
    <>
      {/* Central dot - moves instantly */}
      <motion.div 
        className="fixed w-2 h-2 bg-[#D4AF37] rounded-full pointer-events-none z-55 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: cursorX, top: cursorY }}
      />
      
      {/* Outer tracking ring - lags behind using smooth springs */}
      <motion.div 
        className="fixed w-8 h-8 border border-[#B35C37] rounded-full pointer-events-none z-55 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: trailX, top: trailY }}
        animate={{
          scale: clicked ? 0.75 : linkHovered ? 1.5 : 1,
          borderColor: linkHovered ? '#D4AF37' : '#B35C37',
          backgroundColor: clicked 
            ? 'rgba(179, 92, 55, 0.15)' 
            : linkHovered 
              ? 'rgba(212, 175, 55, 0.05)' 
              : 'rgba(0, 0, 0, 0)',
          boxShadow: linkHovered ? '0 0 15px rgba(212, 175, 55, 0.2)' : 'none'
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      />
    </>
  );
};
