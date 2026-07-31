'use client';

import React, { useEffect, useState } from 'react';

export const InteractiveGlow: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-60"
      style={{
        background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(179, 92, 55, 0.06), rgba(212, 175, 55, 0.02) 50%, transparent 85%)`
      }}
    />
  );
};
