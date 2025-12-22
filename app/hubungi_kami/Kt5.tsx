'use client';

import React from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { motion, type Variants } from 'framer-motion';


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


const activities = [
  { id: 1, src: '/Image/ApiUnggun.webp', rotate: 20, z: -20 },
  { id: 2, src: '/Image/bayangan.webp', rotate: 10, z: -10 },
  { id: 3, src: '/Image/Ambalan.webp', rotate: 0, z: 0 },
  { id: 4, src: '/Image/ApiUnggun.webp', rotate: -10, z: -10 },
  { id: 5, src: '/Image/bayangan.webp', rotate: -20, z: -20 },
];

export default function Kt5() {


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
    <section
      className={`w-full bg-[#FFFFFF] py-25 md:py-28 overflow-hidden ${dmSans.className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8 md:mb-20">
          <motion.h2
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#1E1C1B] mb-4 md:mb-6 tracking-tight"
          >
            Serunya Kegiatan Pramuka Ambalan
          </motion.h2>

          <motion.p
            variants={textVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className="text-gray-600 text-xs md:text-base max-w-3xl mx-auto leading-relaxed px-2"
          >
            “Inilah momen seru Pramuka: berkemah, kegiatan sosial, pelantikan, hingga event
            sekolah. Bergabunglah dan temukan pengalaman yang bermakna!”
          </motion.p>
        </div>

        <motion.div
          className="relative w-full flex justify-center items-center perspective-container"
          variants={galleryContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >

          <div
            className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-4 w-full md:w-auto scrollbar-hide snap-x"
            style={{ perspective: '1000px' }}
          >
            {activities.map((item) => (
              <motion.div
                key={item.id}
                variants={galleryItemVariants}

                className="relative flex-shrink-0 w-[160px] h-[240px] md:w-[220px] md:h-[320px] lg:w-[260px] lg:h-[380px] snap-center"
              >

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


                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-60" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>


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