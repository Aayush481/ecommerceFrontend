'use client';

import React, { useEffect, useState, useRef } from 'react';

interface ScrollParallaxProps {
  children: React.ReactNode;
  speed?: number; // translation multiplier relative to scrolling speed
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export const ScrollParallax: React.FC<ScrollParallaxProps> = ({ 
  children, 
  speed = 0.12, 
  direction = 'up',
  className = '' 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only perform transforms if the element is visible in the viewport range
      if (rect.top < windowHeight && rect.bottom > 0) {
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const diff = elementCenter - viewportCenter;
        
        // Calculate offset
        const val = diff * speed;
        setOffset(val);
      }
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll(); // initial load execution

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed]);

  const getTransform = () => {
    if (direction === 'up') return `translate3d(0, ${offset}px, 0)`;
    if (direction === 'down') return `translate3d(0, ${-offset}px, 0)`;
    if (direction === 'left') return `translate3d(${offset}px, 0, 0)`;
    return `translate3d(${-offset}px, 0, 0)`;
  };

  return (
    <div 
      ref={elementRef}
      style={{
        transform: getTransform(),
        transition: 'transform 0.15s cubic-bezier(0.1, 0.8, 0.25, 1)',
        willChange: 'transform'
      }}
      className={className}
    >
      {children}
    </div>
  );
};
