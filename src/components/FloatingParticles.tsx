'use client';

import React, { useEffect, useState } from 'react';

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  color: string;
  duration: number;
  delay: number;
}

export const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Fixed seed positions to prevent hydration mismatch errors in Next.js SSG
    const seededParticles: Particle[] = [
      { id: 1, size: 250, left: 10, top: 15, color: 'from-[#B35C37]/10 to-transparent', duration: 25, delay: 0 },
      { id: 2, size: 350, left: 65, top: 25, color: 'from-[#D4AF37]/8 to-transparent', duration: 35, delay: -5 },
      { id: 3, size: 200, left: 40, top: 60, color: 'from-[#B35C37]/8 to-transparent', duration: 30, delay: -10 },
      { id: 4, size: 300, left: 15, top: 80, color: 'from-[#D4AF37]/10 to-transparent', duration: 40, delay: -15 },
    ];
    setParticles(seededParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full bg-gradient-to-tr ${p.color} blur-[80px] animate-float`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transformStyle: 'preserve-3d',
            transform: 'translateZ(-50px)'
          }}
        />
      ))}
    </div>
  );
};
