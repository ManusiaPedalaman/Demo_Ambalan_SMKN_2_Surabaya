'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link untuk navigasi
import { Search } from 'lucide-react';
import { DM_Sans } from 'next/font/google';
import { motion, type Variants } from 'framer-motion'; // Import Variants agar tidak error

// 1. Konfigurasi Font
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

// 2. Data Dummy Produk
const productsData = [
  {
    id: 1,
    name: 'Tenda Segitiga/Kerucut',
    price: '30k',
    duration: '3 hari',
    image: '/Image/tenda1.webp',
    slug: 'tenda-segitiga',
  },
  {
    id: 2,
    name: 'Matras Spons',
    price: '5k',
    duration: '1 hari',
    image: '/Image/matras.webp',
    slug: 'matras-spons',
  },
  {
    id: 3,
    name: 'Tongkat Pramuka',
    price: '3k',
    duration: '1 hari',
    image: '/Image/tongkat.webp',
    slug: 'tongkat-pramuka',
  },
  {
    id: 4,
    name: 'Paket Lengkap',
    price: '60k',
    duration: '3 hari',
    image: '/Image/paket_lengkap.webp',
    slug: 'paket-lengkap',
  },
  {
    id: 5,
    name: 'Tali Pramuka',
    price: '5k',
    duration: '1 hari',
    image: '/Image/tali.webp',
    slug: 'tali-pramuka',
  },
];

export default function Produk() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter produk berdasarkan pencarian
  // Filter produk berdasarkan pencarian
  const filteredProducts = searchQuery.trim() === ''
    ? productsData // Jika kosong, tampilkan semua (kembali ke awal/5 card)
    : productsData.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

  // 3. Definisi Variants dengan Tipe Eksplisit agar tidak error
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section className={`w-full min-h-screen bg-white py-24 px-4 md:px-8 lg:px-12 ${dmSans.className}`}>
      <div className="max-w-7xl mx-auto">

        {/* === SEARCH BAR === */}
        <div className="mb-12 flex justify-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-gray-50 rounded-full p-1.5 flex items-center w-full max-w-3xl border border-gray-200 shadow-sm focus-within:border-[#C9A86A] transition-all duration-300"
          >
            <div className="pl-4 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari perlengkapan pramuka..."
              className="flex-1 px-4 py-2.5 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#2D2A29] hover:bg-black text-white px-4 py-2 md:px-8 md:py-2.5 rounded-full font-medium text-sm md:text-base transition-colors duration-300"
            >
              Cari
            </button>
          </form>
        </div>

        {/* === PRODUCTS GRID === */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                variants={cardVariants}
                className="group h-full"
              >
                {/* WRAPPER LINK: Membuat seluruh card bisa diklik 
                  Arahkan ke /daftar/produk_kami/[id]
                */}
                <Link
                  href={`/${product.slug}`}
                  className="block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer"
                >

                  {/* Image Container */}
                  <div className="relative w-full aspect-square bg-[#F2E6D8] overflow-hidden">
                    {/* Overlay Effect on Hover */}
                    <div className="absolute inset-0 bg-[#C9826B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-8 transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Info Container */}
                  <div className="p-5 flex flex-col flex-grow justify-between bg-white relative z-20">
                    <div>
                      <h3 className="text-gray-900 font-bold text-lg md:text-xl mb-1 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      {/* Decorative Line */}
                      <div className="w-12 h-1 bg-[#E07D5F] rounded-full mb-3 opacity-50 group-hover:w-24 transition-all duration-500" />
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest">
                          Harga Sewa
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[#E07D5F] text-xl md:text-2xl font-bold">
                            {product.price}
                          </span>
                          <span className="text-gray-400 text-sm font-medium">
                            / {product.duration}
                          </span>
                        </div>
                      </div>

                      {/* Tombol "Sewa" (Visual Only - karena sudah dibungkus Link)
                        - Mobile: Opacity 100 (Selalu muncul)
                        - Desktop: Opacity 0 -> 100 saat hover
                      */}
                      <div className="bg-[#2D2A29] text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md 
                        transform transition-all duration-300
                        opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"
                      >
                        Sewa
                      </div>
                    </div>
                  </div>

                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">Produk &quot;{searchQuery}&quot; tidak ditemukan.</p>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}