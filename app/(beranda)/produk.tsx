'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DM_Sans } from 'next/font/google';
import Link from 'next/link'; // Import Link untuk navigasi
import Image from 'next/image';

// Konfigurasi Font
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

interface Product {
  id: number;
  name: string;
  price: string;
  duration: string;
  image: string;
  slug: string; // Added slug
}

const Produk = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // State untuk animasi masuk (Scroll Reveal)
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const products: Product[] = [
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
      price: '40k',
      duration: '3 hari',
      image: '/Image/paket_lengkap.webp',
      slug: 'paket-lengkap',
    },
    {
      id: 5,
      name: 'Tali Tambang',
      price: '10k',
      duration: '3 hari',
      image: '/Image/tali.webp',
      slug: 'tali-pramuka', // Adjusted slug to match likely data
    },

  ];

  // Logic Intersection Observer untuk mendeteksi scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  // Handle Responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);

  useEffect(() => {
    setCurrentSlide(0);
  }, [itemsPerView]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const visibleProducts = products.slice(
    currentSlide * itemsPerView,
    currentSlide * itemsPerView + itemsPerView
  );

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#FDF8F3] py-16 px-4 md:px-8 lg:px-12 overflow-hidden ${dmSans.className}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header dengan Animasi Fade Down */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Produk Sewa
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
            Lengkapi kebutuhan perkemahan ambalanmu dengan peralatan berkualitas.
            Siap pakai, bersih, dan terawat.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative w-full">

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between pointer-events-none z-10 px-2 md:-px-4">
            <button
              onClick={prevSlide}
              className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 text-gray-800 transition-all transform hover:scale-110 border border-gray-100 duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 text-gray-800 transition-all transform hover:scale-110 border border-gray-100 duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Products Grid */}
          <div
            className="grid gap-4 md:gap-6 px-4 md:px-12 py-4"
            style={{
              gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`,
            }}
          >
            {visibleProducts.map((product, index) => (
              // MENGUBAH HREF KE FOLDER Detail_Produk
              <Link
                href={`/${product.slug}`}
                key={product.id}
                // Animasi Staggering (muncul berurutan)
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`group block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 ease-out border border-gray-100 flex flex-col transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
              >
                {/* Image Container */}
                <div
                  className="relative w-full aspect-square overflow-hidden bg-[#F2E6D8]"
                >
                  <div className="absolute inset-0 bg-[#C9826B]/10 group-hover:bg-[#C9826B]/20 transition-colors duration-300 z-10" />

                  <div className="relative w-full h-full p-6">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex flex-col flex-grow justify-between bg-white relative z-20">
                  <div>
                    <h3 className="text-gray-900 font-bold text-lg md:text-xl mb-1 line-clamp-1 tracking-tight" title={product.name}>
                      {product.name}
                    </h3>
                    <div className="w-12 h-1 bg-[#E07D5F] rounded-full mb-3 opacity-50 group-hover:w-full transition-all duration-500 ease-in-out" />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest">Harga Sewa</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#E07D5F] text-xl font-bold">{product.price}</span>
                        <span className="text-gray-400 text-sm font-medium">/ {product.duration}</span>
                      </div>
                    </div>

                    {/* Tombol Sewa:
                        - Diubah dari <button> menjadi <div> agar valid di dalam <Link>
                        - Tampilan tetap sama seperti tombol
                    */}
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shadow-lg transition-all duration-300 ease-out cursor-pointer
                      opacity-100 translate-y-0 
                      lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0
                    ">
                      Sewa
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dots Navigation */}
        {totalSlides > 1 && (
          <div
            className={`flex justify-center gap-2 mt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
          >
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${currentSlide === index
                  ? 'bg-[#E07D5F] w-8 h-2'
                  : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div
          className={`flex justify-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
          {/* Bungkus tombol dengan Link ke halaman Produk */}
          <Link href="/produk_kami">
            <button className="px-8 py-3 bg-white border-2 border-[#C9A86A] text-[#C9A86A] hover:bg-[#6B4D27] hover:text-white text-base font-bold rounded-full transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 tracking-wide">
              Lihat Semua Produk
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Produk;