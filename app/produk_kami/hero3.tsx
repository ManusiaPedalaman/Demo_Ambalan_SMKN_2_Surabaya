'use client';

import { Playfair_Display, DM_Sans } from 'next/font/google';
import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';


const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
});

export default function HeroLatihan() {

  const handleScroll = () => {
    const section = document.getElementById('daftar-latihan');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    },
  };

  return (
    <section
      suppressHydrationWarning={true}
      className={`w-full min-h-screen bg-white pt-28 pb-20 ${dmSans.className}`}
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col items-center text-center mb-12 md:mb-24">

          <motion.div variants={itemVariants} className="w-full">
            <h1 className={`${playfair.className} text-[2.75rem] leading-tight md:text-6xl lg:text-7xl font-bold text-black mb-3 md:mb-4 tracking-tight`}>
              Produk Kami
            </h1>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <p className="text-gray-600 text-sm md:text-base mb-8 md:mb-10 font-normal tracking-wide px-4">
              cari perlengkapan pramuka untuk kegiatan anda
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 md:gap-4 w-full max-w-[320px] md:max-w-2xl justify-center px-2"
          >
            <div className="h-[1px] bg-black/80 flex-1" />

            <button
              onClick={handleScroll}
              className="bg-[#332F2E] hover:bg-[#1a1818] text-white px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-medium transition-all duration-300 shadow-md whitespace-nowrap"
            >
              Sewa Sekarang
            </button>

            <div className="h-[1px] bg-black/80 flex-1" />
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          <div className="flex flex-col gap-3 md:gap-4">
            <motion.div variants={itemVariants} className="relative w-full h-[220px] md:h-[350px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Latihan Baris"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative w-full h-[140px] md:h-[200px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Latihan Outdoor"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 mt-0 md:mt-12">
            <motion.div variants={itemVariants} className="relative w-full h-[140px] md:h-[200px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Latihan Lapangan"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative w-full h-[220px] md:h-[350px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Pasukan Pramuka"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4">
            <motion.div variants={itemVariants} className="relative w-full h-[220px] md:h-[400px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Detail Seragam"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative w-full h-[140px] md:h-[150px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Apel Pagi"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 mt-0 md:mt-8">
            <motion.div variants={itemVariants} className="relative w-full h-[180px] md:h-[250px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Pramuka Putri"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative w-full h-[180px] md:h-[300px] overflow-hidden">
              <Image
                src="/Image/Ambalan.webp"
                alt="Kegiatan Lain"
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          </div>

        </motion.div>
      </motion.div>

      <div id="daftar-latihan" className="pt-10"></div>
    </section>
  );
}