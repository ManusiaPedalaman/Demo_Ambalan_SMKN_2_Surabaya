'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DM_Sans } from 'next/font/google';

// Konfigurasi Font
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

const MaknaL = () => {
  // State untuk Zoom Interaction
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Default posisi tengah (50% 50%)
  const imageRef = useRef<HTMLDivElement>(null);

  // Handler untuk menghitung posisi kursor/jari relatif terhadap gambar
  const handleMove = (clientX: number, clientY: number) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();

      // Menghitung posisi X dan Y dalam persentase (0 - 100%)
      const x = ((clientX - left) / width) * 100;
      const y = ((clientY - top) / height) * 100;

      // Membatasi agar tidak keluar area (clamping 0-100)
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setPosition({ x: clampedX, y: clampedY });
    }
  };

  // Event Listeners Desktop (Mouse)
  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setPosition({ x: 50, y: 50 }); // Reset ke tengah saat keluar
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  // Event Listeners Mobile (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsZoomed(true);
    // Mencegah scroll halaman saat user sedang menekan gambar untuk zoom
    // e.preventDefault(); // (Opsional: aktifkan jika ingin lock scroll saat zoom)
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

        {/* Header Section */}
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

        {/* Diagram Image Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative w-full flex justify-center"
        >
          {/* Container Gambar dengan Handler Zoom */}
          <div
            ref={imageRef}
            className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden  border border-gray-100 group cursor-zoom-in"

            // Desktop Events
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}

            // Mobile Events
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >

            {/* Indikator Visual (Hint) */}
            <div className={`absolute inset-0 z-10 flex items-center justify-center bg-white/1 transition-opacity duration-300 pointer-events-none ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
              {/* Bisa ditambahkan icon search kecil disini jika mau */}
            </div>

            {/* Wrapper untuk Image agar transform smooth */}
            <div
              className="w-full h-auto transition-transform duration-200 ease-out"
              style={{
                transformOrigin: `${position.x}% ${position.y}%`,
                transform: isZoomed ? 'scale(2)' : 'scale(1)', // Scale 2 berarti zoom 2x lipat
              }}
            >
              <Image
                src="/Image/LogoAmbalanfull.webp"
                alt="Diagram Lengkap Makna Logo Ambalan"
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                priority
                draggable={false} // Mencegah drag native browser agar zoom lancar
              />
            </div>
          </div>
        </motion.div>

        {/* Petunjuk Kecil (Opsional) */}
        <div className="text-center mt-4 text-gray-400 text-xs animate-pulse">
          {isZoomed ? 'Geser untuk melihat detail' : 'Sentuh/Arahkan kursor gambar untuk memperbesar'}
        </div>

      </div>
    </section>
  )
}

export default MaknaL;