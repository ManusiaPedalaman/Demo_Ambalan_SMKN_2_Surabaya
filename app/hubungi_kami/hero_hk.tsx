'use client';

import { Playfair_Display, DM_Sans } from 'next/font/google';
import { motion, Variants } from 'framer-motion';



const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
});


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
});

export default function HeroHK() {

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
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };


  const textVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    },
  };


  const lineVariants: Variants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut", delay: 0.5 }
    },
  };

  return (
    <section className={`w-full min-h-[60vh] md:min-h-[70vh] bg-white flex flex-col justify-center items-center overflow-hidden ${dmSans.className}`}>

      <motion.div
        className="w-full px-6 md:px-12 flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >


        <div className="overflow-visible mb-8 md:mb-12 text-center w-full">
          <motion.h1
            variants={textVariants}
            className={`${playfair.className} text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-[#1A1A1A] tracking-tight leading-none whitespace-nowrap`}
          >
            Hubungi Kami
          </motion.h1>
        </div>



        <motion.p
          variants={textVariants}
          className="text-gray-500 text-sm md:text-lg mb-12 tracking-widest uppercase text-center"
        >

        </motion.p>


        <div className="w-full max-w-5xl flex items-center gap-0 md:gap-4">


          <motion.div
            variants={lineVariants}
            className="h-[1px] bg-[#1A1A1A] flex-grow origin-right"
          />


          <motion.button
            variants={textVariants}
            whileHover={{ scale: 1.05, backgroundColor: "#3d3635" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleScroll}
            className="bg-[#231F1E] text-white px-10 py-4 md:px-14 md:py-5 text-sm md:text-base font-medium uppercase tracking-wider mx-4 shadow-lg"
          >
            Hubungi
          </motion.button>


          <motion.div
            variants={lineVariants}
            className="h-[1px] bg-[#1A1A1A] flex-grow origin-left"
          />

        </div>

      </motion.div>


      <div id="daftar-latihan" className="absolute bottom-0 w-full h-1" />
    </section>
  );
}