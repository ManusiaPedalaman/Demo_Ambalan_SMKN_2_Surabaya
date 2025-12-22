'use client';

import { Poppins } from 'next/font/google';
import { motion, Variants } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);




  const handleScrollToContent = () => {
    const targetSection = document.getElementById('explore-target');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const handleNavigateToProduk = () => {
    router.push('/produk_kami');
  };



  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const textVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  const fadeVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  };

  return (
    <section className={`relative min-h-screen w-full overflow-hidden ${poppins.className}`}>
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/Image/hero2.webp')",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-black/10"
        />
      </motion.div>

      <div className="relative z-10 flex min-h-screen items-center px-6 py-20 sm:px-8 md:px-12 lg:px-[315px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="max-w-4xl"
        >
          <motion.div variants={textVariants} className="overflow-hidden">
            <h1 className="mb-4 text-4xl font-semibold leading-tight text-white sm:text-5xl md:mb-6 md:text-6xl lg:text-7xl">
              Tentang
              <br />
              <span className="inline-block">
                Ambalan SMEKDA
              </span>
            </h1>
          </motion.div>

          <motion.div
            variants={textVariants}
            className="mb-6 space-y-0.5 md:mb-8"
          >
            <p className="text-sm text-gray-200 sm:text-base md:text-lg">
              Gajah Mada Tribuana Tungga Dewi
            </p>
            <p className="text-sm text-gray-200 sm:text-base md:text-lg">
              16.041 - 16.042
            </p>
          </motion.div>

          <motion.div
            variants={fadeVariants}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <motion.button
              variants={buttonVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 10px 40px rgba(201, 168, 106, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScrollToContent}
              className="rounded-lg bg-[#C9A86A] px-7 py-3 text-sm font-semibold text-gray-800 transition-all duration-100 hover:bg-[#B89554] sm:px-8 sm:py-3.5 sm:text-base md:px-10 md:py-4"
            >
              Jelajahi
            </motion.button>

            <motion.div
              variants={buttonVariants}
              className="hidden sm:block w-[1.5px] bg-[#C9A86A] self-stretch mx-1"
            />

            <motion.button
              variants={buttonVariants}
              whileHover={{
                scale: 1.05,
                backgroundColor: '#c9a86aff',
                color: 'rgb(31, 41, 55)',
                boxShadow: '0 10px 40px rgba(201, 168, 106, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigateToProduk}
              className="rounded-lg border-2 border-[#C9A86A] bg-transparent px-7 py-3 text-sm font-semibold text-[#C9A86A] transition-all duration-300 sm:px-8 sm:py-3.5 sm:text-base md:px-10 md:py-4"
            >
              Jelajahi Produk
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent md:h-32"
      />

      <div id="explore-target" className="absolute bottom-0 w-full h-1" />
    </section>
  );
}