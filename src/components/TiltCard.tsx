'use client';

import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.5s ease, border-color 0.4s ease'
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const angleX = (yc - y) / 10; // tilt angle around X axis (up/down)
    const angleY = (x - xc) / 10; // tilt angle around Y axis (left/right)

    setStyle({
      transform: `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.025, 1.025, 1.025)`,
      transition: 'transform 0.08s ease-out',
      boxShadow: `${-angleY * 2.5}px ${angleX * 2.5}px 35px -5px rgba(35, 43, 40, 0.18), 0 0 25px -5px rgba(179, 92, 55, 0.1)`,
      borderColor: 'rgba(179, 92, 55, 0.3)'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.6s ease, border-color 0.4s ease',
      boxShadow: 'none',
      borderColor: 'rgba(35, 43, 40, 0.1)'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`relative rounded-xl border border-[#232B28]/10 overflow-hidden flex flex-col justify-between h-full transition-colors ${className}`}
    >
      {children}
    </div>
  );
};
