'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2; // Adjust speed here
      });
    }, 30);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2000); // Total loading time approx 2 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
          className="h-full bg-[#CD5C08] rounded-full" // Using an orange-ish color common in Scout themes or generic accent
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear" }}
        />
      </div>
      
      <p className="mt-4 text-gray-500 font-medium text-sm tracking-wider">
        MEMUAT...
      </p>
    </motion.div>
  );
}
