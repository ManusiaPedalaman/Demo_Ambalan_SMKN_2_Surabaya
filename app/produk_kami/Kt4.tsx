'use client';

import React from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { motion, type Variants } from 'framer-motion'; // Menggunakan 'type' agar lebih aman di TS

// 1. Konfigurasi Font
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

// Data Dummy Gambar
const activities = [
  { id: 1, src: '/Image/ApiUnggun.webp', rotate: 20, z: -20 },  // Kiri Jauh
  { id: 2, src: '/Image/bayangan.webp', rotate: 10, z: -10 },  // Kiri Dekat
  { id: 3, src: '/Image/Ambalan.webp', rotate: 0, z: 0 },     // Tengah (Fokus)
  { id: 4, src: '/Image/ApiUnggun.webp', rotate: -10, z: -10 }, // Kanan Dekat
  { id: 5, src: '/Image/bayangan.webp', rotate: -20, z: -20 }, // Kanan Jauh
];

export default function Kt4() {

  // 2. Definisi Variants dengan Tipe Eksplisit

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const galleryContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const galleryItemVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <section className={`w-full bg-[#1E1C1B] py-20 md:py-28 overflow-hidden ${dmSans.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* === HEADER SECTION === */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Solusi Penyewaan Produk Pramuka Praktis & Terpercaya
          </motion.h2>

          <motion.p
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-gray-400 text-sm md:text-base max-w-4xl mx-auto leading-relaxed"
          >
            Dari camping, pramuka, hingga event, tenda kami siap memenuhi kebutuhan Anda. Yuk, pilih yang sesuai!
          </motion.p>
        </div>

        {/* === IMAGE GALLERY (3D CURVED EFFECT) === */}
        <motion.div
          className="relative w-full flex justify-center items-center perspective-container"
          variants={galleryContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Container Scrollable */}
          <div
            className="flex gap-2 md:gap-4 lg:gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 px-4 w-full md:w-auto scrollbar-hide snap-x"
            style={{ perspective: '1000px' }}
          >
            {activities.map((item) => (
              <motion.div
                key={item.id}
                variants={galleryItemVariants}
                className="relative flex-shrink-0 w-[200px] h-[280px] md:w-[220px] md:h-[320px] lg:w-[260px] lg:h-[380px] snap-center"
              >
                {/* Wrapper Gambar dengan CSS Transform Murni */}
                <div
                  className="w-full h-full rounded-xl overflow-hidden shadow-2xl border-[3px] border-white/10 transition-all duration-500 group hover:border-[#C7A682] hover:z-50 hover:scale-105"
                  style={{
                    transform: `rotateY(${item.rotate}deg) translateZ(${item.z}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <Image
                    src={item.src}
                    alt="Kegiatan Pramuka"
                    fill
                    className="object-cover filter brightness-90 group-hover:brightness-110 transition-all duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />

                  {/* Overlay Gradient Halus */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-60" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Style untuk Mobile Reset & Scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        @media (max-width: 768px) {
          .snap-center > div {
            transform: none !important; 
            border-width: 2px;
          }
        }
      `}</style>
    </section>
  )
}