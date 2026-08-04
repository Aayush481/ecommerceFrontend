'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DressScrollAnimation = dynamic(
  () => import('./DressScrollAnimation').then((mod) => mod.DressScrollAnimation),
  { ssr: false }
);

export const ClientDressAnimation: React.FC = () => {
  const [shouldLoad, setShouldLoad] = React.useState(false);

  React.useEffect(() => {
    const triggerLoad = () => {
      setShouldLoad(true);
    };

    // Load after 1.5s idle timeout
    const timer = setTimeout(triggerLoad, 1500);

    // Or load immediately on scroll
    window.addEventListener('scroll', triggerLoad, { passive: true, once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', triggerLoad);
    };
  }, []);

  if (!shouldLoad) return null;

  return <DressScrollAnimation />;
};
