'use client';

import React from 'react';
import { motion } from 'framer-motion';

// 1. Scroll-Triggered Fade & Rise Reveal
export const ScrollReveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ 
  children, 
  delay = 0, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ type: 'spring', stiffness: 80, damping: 15, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 2. Character/Word Staggered Title Reveal
export const TitleReveal: React.FC<{ 
  text: string; 
  className?: string; 
  subtitleText?: string; 
}> = ({ 
  text, 
  className = '', 
  subtitleText = '' 
}) => {
  const words = text.split(' ');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  } as const;

  const childVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring' as const, stiffness: 110, damping: 14 }
    }
  } as const;

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
      className="flex flex-col gap-2"
    >
      <h1 className={className}>
        {words.map((word, idx) => (
          <span key={idx} className="inline-block mr-3 sm:mr-4 overflow-hidden whitespace-nowrap py-1">
            <motion.span variants={childVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </h1>
      {subtitleText && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 70, damping: 16, delay: 0.6 }}
          className="font-sans text-xs sm:text-sm lg:text-base text-stone-300/80 leading-relaxed tracking-wide font-light max-w-[500px]"
        >
          {subtitleText}
        </motion.p>
      )}
    </motion.div>
  );
};

// 3. Staggered Grid Container (reveals child items sequentially)
export const StaggerContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-8%' }}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.08 }
        }
      } as const}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 4. Staggered Grid Child
export const StaggerChild: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: { type: 'spring' as const, stiffness: 100, damping: 14 }
        }
      } as const}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 5. Cinematic Floating Decorator
export const FloatingMesh: React.FC<{ children: React.ReactNode; duration?: number; yRange?: number; className?: string }> = ({ 
  children, 
  duration = 7, 
  yRange = 25, 
  className = '' 
}) => {
  return (
    <motion.div
      animate={{
        y: [0, yRange, 0],
        rotate: [0, 4, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
