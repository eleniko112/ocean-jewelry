import React from 'react';
import { motion } from 'motion/react';

export default function WavesBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
      <div className="absolute inset-x-0 bottom-0 top-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            initial={{ d: "M0,160 C320,128 640,192 960,160 C1280,128 1440,256 1440,256 L1440,800 L0,800 Z" }}
            animate={{ 
              d: [
                "M0,160 C320,128 640,192 960,160 C1280,128 1440,256 1440,256 L1440,800 L0,800 Z",
                "M0,160 C320,256 640,128 960,160 C1280,192 1440,128 1440,128 L1440,800 L0,800 Z",
                "M0,160 C320,128 640,192 960,160 C1280,128 1440,256 1440,256 L1440,800 L0,800 Z"
              ]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep via-transparent to-ocean-deep pointer-events-none" />
    </div>
  );
}
