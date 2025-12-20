'use client';

import React from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { motion, Variants } from 'framer-motion';

// Konfigurasi Font
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

export default function Sambutan() {

  // Variasi Animasi untuk Text Container
  const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  // Variasi Animasi untuk Item Teks
  const textItemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    },
  };

  // Variasi Animasi untuk Gambar
  const imageVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: 'easeOut', delay: 0.2 }
    },
  };

  return (
    <section className={`w-full overflow-hidden ${dmSans.className}`}>
      <div className="flex flex-col lg:flex-row min-h-[650px]">

        {/* === BAGIAN KIRI: TEKS === */}
        <motion.div
          // --- PENGATURAN JARAK (PADDING) ---
          // lg:pl-[150px] -> Jarak dari pinggir kiri layar ke Teks (Sesuai request sebelumnya)
          // lg:pr-[100px] -> Jarak dari Teks ke Gambar (Ubah angka 100px ini untuk mengatur jarak teks ke gambar)
          className="w-full lg:w-[60%] bg-[#231F1E] p-8 md:p-16 lg:py-[100px] lg:pl-[310px] lg:pr-[100px] flex flex-col justify-center relative z-10"

          variants={textContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span variants={textItemVariants} className="text-gray-400 text-sm tracking-wider uppercase mb-2">
            Sambutan
          </motion.span>

          <motion.h2 variants={textItemVariants} className="text-[#A58B6F] text-3xl md:text-4xl font-bold leading-tight">
            Pembina Pramuka
          </motion.h2>

          <motion.h1 variants={textItemVariants} className="text-white text-4xl md:text-5xl font-bold mb-8 leading-tight">
            Abah Sigit
          </motion.h1>

          <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed font-normal text-justify">
            <motion.p variants={textItemVariants}>
              Assalamu’alaikum Wr. Wb.
            </motion.p>

            <motion.p variants={textItemVariants}>
              Selamat datang di halaman website Ambalan SMKN 2 Surabaya.
              Website ini disediakan sebagai sumber informasi mengenai kegiatan
              kepramukaan di Ambalan SMKN 2 Surabaya, baik untuk siswa-siswi,
              guru pembina, maupun masyarakat umum. Melalui halaman ini,
              siapa pun dapat mengetahui informasi tentang Pramuka Penegak,
              program kegiatan, jadwal latihan, hingga prestasi yang telah diraih.
            </motion.p>

            <motion.p variants={textItemVariants}>
              Sebagaimana diketahui, Pramuka bukan hanya kegiatan ekstrakurikuler biasa,
              tetapi wadah pembinaan generasi muda agar memiliki karakter, keterampilan,
              kepemimpinan, dan rasa peduli sosial. Dengan adanya website ini, kami berharap
              informasi tentang Ambalan dapat lebih mudah diakses, sekaligus menjadi sarana
              komunikasi antara anggota, alumni, dan masyarakat luas.
            </motion.p>

            <motion.p variants={textItemVariants}>
              Semoga melalui wadah ini, semangat Dasa Darma Pramuka dan jiwa kebersamaan
              terus tumbuh di lingkungan SMKN 2 Surabaya.
            </motion.p>

            <motion.div variants={textItemVariants} className="pt-4">
              <p>Wassalamu’alaikum Wr. Wb.</p>
              <p className="text-gray-400 text-sm mt-1">Pembina Ambalan SMKN 2 Surabaya</p>
            </motion.div>
          </div>
        </motion.div>

        {/* === BAGIAN KANAN: GAMBAR === */}
        <motion.div
          className="w-full lg:w-[40%] relative bg-gray-800 flex items-end justify-center overflow-hidden"
          variants={imageVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <Image
            src="/Image/abahsigit.webp"
            alt="Pembina Pramuka - Abah Sigit"
            width={667}
            height={979}
            className="w-full h-auto lg:h-full lg:object-cover object-top"
            priority
          />

          {/* Overlay gradient untuk transisi halus di mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#231F1E] via-transparent to-transparent lg:hidden" />
        </motion.div>

      </div>
    </section>
  );
}