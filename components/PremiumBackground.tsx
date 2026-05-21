'use client';

import React from 'react';

const PremiumBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#030308] overflow-hidden">
      {/* Mesh Gradients */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-10 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ff00ff 0%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }}
      />
      
      {/* Noise Texture Overlay (Premium feel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      {/* Grid Pattern (Subtle) */}
      <div 
        className="absolute inset-0 opacity-[0.05]"
        style={{ 
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />
    </div>
  );
};

export default PremiumBackground;
