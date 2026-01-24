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
    
    // Logic: If downlink < 1.5Mbps => Show loading for 8s, else 3s
    const isSlow = items < 1.5;
    const duration = isSlow ? 8000 : 3000; 
    
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
      initial={{ opacity: 1, y: "0%" }}
      exit={{ 
        opacity: 0, 
        y: "-100%", 
        transition: { duration: 0.8, ease: "easeInOut" } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
    >
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        {/* Rotating Shadow / Glow Effect */}
        <motion.div
           animate={{ rotate: 360 }}
           transition={{
             duration: 8,
             repeat: Infinity,
             ease: "linear",
           }}
           className="absolute inset-0 z-0 flex items-center justify-center"
        >
           {/* Pentagon Shape for Shadow */}
           <div 
             className="w-32 h-32 bg-transparent"
             style={{
               clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
               boxShadow: "0 0 40px 10px rgba(205, 92, 8, 0.6)",
               filter: "drop-shadow(0 0 20px rgba(205, 92, 8, 0.8))",
             }}
           >
             {/* Inner gradient border effect */}
             <div className="w-full h-full bg-gradient-to-tr from-[#CD5C08] to-transparent opacity-50" 
                  style={{ clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }} 
             />
           </div>
        </motion.div>

         {/* Static Logo */}
         <div className="relative z-10 w-32 h-32">
           <Image
             src="/Logo/LogoAmbalan.svg"
             alt="Loading Logo"
             fill
             className="object-contain drop-shadow-2xl"
             priority
           />
         </div>
      </div>

      {/* Loading Bar Container */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative z-20">
        <motion.div
          className="h-full bg-[#CD5C08] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>
      
      <p className="mt-4 text-gray-500 font-medium text-sm tracking-wider z-20">
        MEMUAT...
      </p>
    </motion.div>
  );
}
