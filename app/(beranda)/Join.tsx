'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DM_Sans } from 'next/font/google';
import Link from 'next/link'; // 1. Import komponen Link

// Konfigurasi Font DM Sans
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

const Join = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Logic Animasi Scroll (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 } // Memicu animasi saat 30% element terlihat
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`w-full bg-[#231F1E] overflow-hidden ${dmSans.className}`}
    >
      <div className="flex flex-col lg:flex-row min-h-[500px]">
        
        {/* === LEFT SIDE: Text Content === */}
        <div className="relative w-full lg:w-[60%] px-8 py-12 md:px-16 lg:px-[310px] lg:py-24 flex flex-col justify-center bg-[#231F1E]">
          
          {/* Background Pattern (Topography) */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img 
              src="/Image/Vector.webp" 
              alt="Pattern" 
              className="w-full h-full object-cover opacity-100"
            />
          </div>

          {/* Content Container */}
          <div className={`relative z-10 transition-all duration-1000 ease-out transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            
            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Bangun Karakter,<br />
              Asah Keterampilan,<br />
              Raih Prestasi
            </h2>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed mb-10">
              Gabung bersama kami dan wujudkan perjalananmu sebagai generasi berdaya guna.
            </p>

            {/* CTA Button (Updated to Link) */}
            {/* Pastikan route '/join' sesuai dengan nama file page Anda.
                Misal: jika file Anda di app/register/page.tsx, ganti href menjadi '/register'
            */}
            <Link 
              href="/join" 
              className="inline-block bg-[#9C7C5B] hover:bg-[#8A6A4B] text-white font-bold py-3 px-10 md:px-12 rounded-[4px] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm md:text-base tracking-wide text-center"
            >
              Join
            </Link>

          </div>
        </div>

        {/* === RIGHT SIDE: Image === */}
        <div className="relative w-full lg:w-[40%] h-[400px] lg:h-auto">
          {/* Animasi Image Slide-in dari kanan */}
          <div className={`absolute inset-0 w-full h-full transition-all duration-1000 delay-200 ease-out transform ${
             isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}>
            {/* Overlay agar gambar menyatu dengan tema gelap */}
            <div className="absolute inset-0 bg-black/20 z-10" /> 
            
            <img 
              src="/Image/bayangan.webp" 
              alt="Api Unggun Pramuka"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.style.backgroundColor = '#1a1a1a';
                }
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default Join;