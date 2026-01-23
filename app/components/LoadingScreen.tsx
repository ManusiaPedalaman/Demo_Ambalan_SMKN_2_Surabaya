'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Detect connection speed
    // @ts-ignore - navigator.connection is not standard in all TS definitions
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const items = connection ? connection.downlink : 10; // Default to fast if API not available
    
    // Logic: If downlink < 1.5Mbps => Show loading for 8s, else 3.5s
    const isSlow = items < 1.5;
    const duration = isSlow ? 8000 : 3500; 
    
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ 
        opacity: 0, 
        scale: 0, 
        rotate: 720,
        transition: { duration: 0.8, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      {/* Floating Kite Animation Container */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-40 h-40 mb-8"
      >
        <Image
          src="/Logo/LogoAmbalan.svg"
          alt="Loading Logo"
          fill
          className="object-contain drop-shadow-lg"
          priority
        />
      </motion.div>

      {/* Loading Bar Container */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-[#CD5C08] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }} // Smooth out small steps
        />
      </div>
      
      <p className="mt-4 text-gray-500 font-medium text-sm tracking-wider">
        MEMUAT...
      </p>
    </motion.div>
  );
}
