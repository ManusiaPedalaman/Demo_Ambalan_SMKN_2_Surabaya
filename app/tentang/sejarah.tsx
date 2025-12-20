'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Bookmark } from 'lucide-react';

// Konfigurasi Font
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

const playfair = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
});

// Data Sejarah (Rangkuman 9 Slide dari PPT)
const historyData = [
  {
    id: 1,
    year: '1996',
    fullDate: '9 April 1996',
    title: 'Masa Awal Berdiri',
    description: 'Pramuka SMKN 2 Surabaya resmi berdiri dengan nomor Gugusdepan 1546 (Putri) dan 1547 (Putra) dari Kwartir Cabang Kota Surabaya. Tokoh awal yang bergabung antara lain Kak Adi dan Kak Wulandari Destiningtyas.',
    image: '/Image/sejarah1.webp',
  },
  {
    id: 2,
    year: '1996 - ????',
    fullDate: 'Periode Vakum',
    title: 'Masa Kevakuman',
    description: 'Setelah beberapa tahun berjalan, kegiatan Pramuka mengalami kevakuman total. Tidak ada aktivitas kepramukaan yang signifikan di SMKN 2 Surabaya hingga awal tahun 2005.',
    image: '/Image/sejarah2.webp',
  },
  {
    id: 3,
    year: '2005',
    fullDate: 'Maret 2005',
    title: 'Titik Balik Kebangkitan',
    description: 'Semangat bangkit dimulai saat salah satu siswa nekat mengikuti Kursus Pengelola Dewan Kerja (KPDK) di Malang bermodal surat rekomendasi Kwarran Sawahan, meski Gudep sedang tidak aktif.',
    image: '/Image/sejarah3.webp',
  },
  {
    id: 4,
    year: '2005',
    fullDate: 'Mei 2005',
    title: 'Perekrutan Gerilya',
    description: 'Dimulainya perekrutan anggota secara "gerilya". Terkumpul 13 orang diantaranya (12 orang dari jurusan Audio Video, dan 1 orang dari jurusan Otomotif) yang menjadi Angkatan Pertama Ambalan dengan Pradana Kak Aris Pratama.',
    image: '/Image/sejarah1.webp', // Ganti dengan image yang sesuai jika ada
  },
  {
    id: 5,
    year: '2005',
    fullDate: 'Juni 2005',
    title: 'Identitas Ambalan',
    description: 'Penetapan nama "Gajah Mada - Tribhuwana Tungga Dewi" dan penciptaan Logo Ambalan. Logo disempurnakan warnanya oleh Kak Choirul Wahyudi dan disetujui seluruh anggota.',
    image: '/Image/sejarah2.webp',
  },
  {
    id: 6,
    year: '2005',
    fullDate: 'Juli 2005',
    title: 'Adat & Nama Lapangan',
    description: 'Penyusunan Adat Ambalan, Sandi Ambalan (berdasarkan Dasa Darma), dan tradisi "Nama Lapangan" (Singkatan Nama) di kaos PDL, contoh: Aris Pratama menjadi "Risma".',
    image: '/Image/sejarah3.webp',
  },
  {
    id: 7,
    year: '2005',
    fullDate: 'Agustus 2005',
    title: 'Prestasi Perdana',
    description: 'Ambalan mulai aktif berpartisipasi dalam kegiatan luar, termasuk salah satunya pada kegiatan Kursus pengelola Dewan Kerja Cabang 2005 di Lemdikacab Lawang, Malang, kegiatan Latihan Pengembangan Kepemimpinan 2005 di Kwarcab Surabaya, dan kegiatan Raimuna Cabang Kota Surabaya tahun 2005 di Ken Park, Surabaya dan lain sebagainya',
    image: '/Image/sejarah1.webp',
  },
  {
    id: 8,
    year: '2007 - 2008',
    fullDate: '2007 - 2008',
    title: 'Era Pengembangan',
    description: 'Mengirimkan delegasi ke Gladian Pemimpin Satuan (DIANPINSAT) 2007 di Pacet dan East Java Scouts Spirit (EJSS) 2008 di Karang Pilang, Surabaya.',
    image: '/Image/sejarah2.webp',
  },
  {
    id: 9,
    year: 'Filosofi',
    fullDate: 'Julukan GRASS',
    title: 'Semangat Rumput (GRASS)',
    description: 'Ambalan memiliki nama lain "GRASS" (Gerakan Pramuka SMKN 2 Surabaya). Filosofinya seperti rumput: mampu hidup, menyesuaikan diri, dan bertahan di lingkungan manapun.',
    image: '/Image/sejarah3.webp',
  }
];

export default function Sejarah() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Logic Navigasi dengan Arah Animasi
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % historyData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + historyData.length) % historyData.length);
  };

  const currentData = historyData[currentIndex];

  // Variasi Animasi Slide
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <section className={`w-full bg-[#1E1C1B] py-20 px-4 md:px-8 lg:px-12 overflow-hidden ${dmSans.className} ${playfair.variable}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-[#C7A682] font-medium tracking-widest uppercase text-sm mb-2 block"
            >
              Perjalanan Kami
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${playfair.className} text-4xl md:text-5xl lg:text-6xl font-bold text-white`}
            >
              Sejarah Ambalan
            </motion.h2>
          </div>

          {/* Indikator Halaman (01 / 09) */}
          <div className="text-white/50 font-mono text-lg hidden md:block">
            <span className="text-white text-2xl">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="mx-2">/</span>
            {String(historyData.length).padStart(2, '0')}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* === KOLOM KIRI: GAMBAR (7 Kolom) === */}
          <div className="lg:col-span-7 relative min-h-[300px] md:min-h-[450px] rounded-2xl overflow-hidden group">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={currentData.image}
                  alt={currentData.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.style.backgroundColor = "#2A2827";
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1C1B] via-transparent to-transparent opacity-60" />
              </motion.div>
            </AnimatePresence>

            {/* Floating Year Badge di Gambar */}
            <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-[#C7A682]/20 px-6 py-3 rounded-full">
              <span className={`${playfair.className} text-3xl font-bold text-[#C7A682]`}>
                {currentData.year}
              </span>
            </div>
          </div>

          {/* === KOLOM KANAN: KONTEN (5 Kolom) === */}
          <div className="lg:col-span-5 flex flex-col">

            {/* Card Konten */}
            <div className="bg-[#252322] border border-white/5 rounded-2xl p-6 md:p-10 h-full flex flex-col justify-between relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7A682]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              <AnimatePresence mode='wait' custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  {/* Tanggal */}
                  <div className="flex items-center gap-2 text-[#C7A682] mb-4">
                    <Calendar size={18} />
                    <span className="text-sm font-medium tracking-wide uppercase">
                      {currentData.fullDate}
                    </span>
                  </div>

                  {/* Judul */}
                  <h3 className={`${playfair.className} text-3xl md:text-4xl font-bold text-white mb-6 leading-tight`}>
                    {currentData.title}
                  </h3>

                  {/* Deskripsi */}
                  <p className="text-gray-400 text-base leading-relaxed mb-8 text-justify">
                    {currentData.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* === NAVIGATION BUTTONS === */}
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="text-gray-500 text-xs uppercase tracking-widest">
                  Geser untuk melihat
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-[#C7A682] hover:border-[#C7A682] hover:text-[#1E1C1B] text-white flex items-center justify-center transition-all duration-300 active:scale-95"
                    aria-label="Previous Slide"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full bg-white text-[#1E1C1B] hover:bg-[#C7A682] flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-[#C7A682]/20 active:scale-95"
                    aria-label="Next Slide"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}