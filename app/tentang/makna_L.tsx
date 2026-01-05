'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DM_Sans } from 'next/font/google';


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

const MaknaL = () => {

  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);


  const handleMove = (clientX: number, clientY: number) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();


      const x = ((clientX - left) / width) * 100;
      const y = ((clientY - top) / height) * 100;


      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setPosition({ x: clampedX, y: clampedY });
    }
  };


  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setPosition({ x: 50, y: 50 });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };


  const handleTouchStart = (e: React.TouchEvent) => {
    setIsZoomed(true);

    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  };
  const handleTouchEnd = () => {
    setIsZoomed(false);
    setPosition({ x: 50, y: 50 });
  };

  return (
    <section className={`w-full bg-white py-16 md:py-24 overflow-hidden ${dmSans.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Makna pada Logo Ambalan <br className="hidden md:block" />
            <span className="text-[#c9a86aff]">Gajah Mada Tribuana Tungga Dewi</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 text-sm md:text-base max-w-3xl mx-auto leading-relaxed"
          >
            Setiap unsur pada logo Ambalan memiliki makna mendalam yang divisualisasikan secara detail pada diagram di bawah ini.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative w-full flex justify-center"
        >
          <div
            ref={imageRef}
            className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden  border border-gray-100 group cursor-zoom-in"


            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}


            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >

            <div className={`absolute inset-0 z-10 flex items-center justify-center bg-white/1 transition-opacity duration-300 pointer-events-none ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
            </div>

            <div
              className="w-full h-auto transition-transform duration-200 ease-out"
              style={{
                transformOrigin: `${position.x}% ${position.y}%`,
                transform: isZoomed ? 'scale(2)' : 'scale(1)',
              }}
            >
              <Image
                src="/Image/LogoAmbalanfull.webp"
                alt="Diagram Lengkap Makna Logo Ambalan"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority
                draggable={false}
              />
            </div>
            {/* Mobile Buttons */}
            <div className="absolute bottom-4 right-4 flex gap-2 md:hidden z-20">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/Image/LogoAmbalanfull.webp';
                  link.download = 'Makna-Logo-Ambalan.webp';
                  link.click();
                }}
                className="p-2 bg-white/90 rounded-full shadow-lg text-gray-700 hover:text-[#C9A86A] backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
              </button>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 bg-white/90 rounded-full shadow-lg text-gray-700 hover:text-[#C9A86A] backdrop-blur-sm"
              >
                {isZoomed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></svg>
                )}
              </button>
            </div>

          </div>
        </motion.div>

        <div className="text-center mt-4 text-gray-400 text-xs animate-pulse">
          {isZoomed ? 'Geser untuk melihat detail' : 'Sentuh/Arahkan kursor gambar untuk memperbesar'}
        </div>

      </div>
    </section>
  )
}

export default MaknaL;