import React from 'react';
import SunRays from '../../layout/SunRays';
import DriftingClouds from '../../layout/DriftingClouds';
import FloatingParticles from '../../layout/FloatingParticles';

export default function WorldBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-ocean-deep">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep via-ocean to-ocean-shallow" />
      <SunRays opacity="opacity-10" />
      <DriftingClouds />
      <FloatingParticles />
    </div>
  );
}