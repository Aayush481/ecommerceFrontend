'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const DressScrollAnimation = dynamic(
  () => import('./DressScrollAnimation').then((mod) => mod.DressScrollAnimation),
  { ssr: false }
);

export const ClientDressAnimation: React.FC = () => {
  return <DressScrollAnimation />;
};
