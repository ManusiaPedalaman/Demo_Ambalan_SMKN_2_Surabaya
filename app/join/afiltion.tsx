'use client';

import React from 'react';
import Image from 'next/image';

const AffiliationSlider = () => {
  const affiliations = [
    '/Icon/Logo-1.svg',
    '/Icon/Logo-2.svg',
    '/Icon/Logo-3.svg',
    '/Icon/Logo-4.svg',
    '/Icon/Logo-5.svg',
    '/Icon/Logo.svg',
  ];

  // Definisi CSS Keyframes sebagai string biasa
  const styles = `
    @keyframes infinite-scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-100%); }
    }
    .animate-infinite-scroll {
      animation: infinite-scroll 25s linear infinite;
    }
    .group:hover .animate-infinite-scroll {
      animation-play-state: paused;
    }
  `;

  return (
    <section
      className="w-full bg-[#1a1a1a] py-10 overflow-hidden relative"
      suppressHydrationWarning={true}
    >
      {/* Inject CSS Style */}
      <style>{styles}</style>

      {/* Container Utama 
          UPDATE: Padding kiri kanan 150px pada layar besar (lg) 
      */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-12 lg:px-[315px] relative">

        {/* Gradient Mask (Efek pudar di kiri kanan) 
            Lebar gradient disesuaikan agar menyatu dengan padding
        */}
        <div className="absolute top-0 left-0 z-10 w-20 md:w-32 lg:w-[1000px] h-full bg-gradient-to-r from-[#1a1a1a] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 z-10 w-20 md:w-32 lg:w-[1000px] h-full bg-gradient-to-l from-[#1a1a1a] to-transparent pointer-events-none" />

        {/* Slider Track */}
        <div className="flex overflow-hidden group cursor-pointer">

          {/* Set Logo 1 */}
          <div className="flex animate-infinite-scroll gap-12 md:gap-24 pr-12 md:pr-24">
            {affiliations.map((logo, index) => (
              <div key={`logo-1-${index}`} className="flex items-center justify-center min-w-[120px] md:min-w-[180px]">
                <Image
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  width={180}
                  height={60}
                  className="h-10 md:h-14 w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Set Logo 2 (Duplikat untuk looping) */}
          <div className="flex animate-infinite-scroll gap-12 md:gap-24 pr-12 md:pr-24" aria-hidden="true">
            {affiliations.map((logo, index) => (
              <div key={`logo-2-${index}`} className="flex items-center justify-center min-w-[120px] md:min-w-[180px]">
                <Image
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  width={180}
                  height={60}
                  className="h-10 md:h-14 w-auto object-contain opacity-50 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-110"
                  draggable={false}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default AffiliationSlider;