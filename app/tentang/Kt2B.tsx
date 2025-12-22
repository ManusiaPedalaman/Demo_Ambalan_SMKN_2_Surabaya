'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { DM_Sans } from 'next/font/google';


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


const quotesData = [
  {
    id: 1,
    name: 'Lord Robert Stephenson Smyth Baden-Powell of Gilwell',
    life: '22 Februari 1857 di London, Inggris - 8 Januari 1941 di Nyeri, Kenya',
    quoteEn: '“Try to leave this world a little better than you found it.”',
    quoteId: '(“Berusahalah meninggalkan dunia ini sedikit lebih baik daripada ketika kamu menemukannya.”)',
    image: '/Image/Baden-Powell .webp',
  },
  {
    id: 2,
    name: 'Sri Sultan Hamengkubuwono IX',
    life: '12 April 1912 di Yogyakarta - 2 Oktober 1988 di Washington D.C., Amerika Serikat',
    quoteEn: '“Orang lain boleh pintar, tetapi kita harus lebih pintar. Orang lain boleh maju, tetapi kita harus lebih maju.”',
    quoteId: '(Kalimat ini sering dikaitkan dengan semangat beliau dalam memajukan bangsa, termasuk dalam pembinaan Pramuka.)',
    image: '/Image/Sri Sultan Hamengkubuwono.webp',
  }
];

const Kt2B = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentQuote = quotesData[currentIndex];


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotesData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + quotesData.length) % quotesData.length);
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#231F1E] overflow-hidden ${dmSans.className}`}
    >
      <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px] lg:px-[265px] items-center">

        <div className="relative w-full lg:w-[60%] p-8 md:p-12 lg:py-20 lg:pr-20 flex flex-col justify-center bg-[#231F1E] z-10">

          <div className="absolute inset-0 z-0 opacity-10">
            <img src="/Image/Vector.webp" alt="pattern" className="w-full h-full object-cover" />
          </div>

          <div className={`relative z-10 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 tracking-tight border-b border-gray-700 pb-6 inline-block">
              Kata Kata Bapak
            </h2>

            <div className="space-y-8 max-w-2xl">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#C9A86A] leading-snug">
                  {currentQuote.name}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm mt-2 font-medium leading-relaxed">
                  {currentQuote.life}
                </p>
              </div>

              <div className="space-y-4 pl-6 border-l-4 border-[#C9A86A]/30">
                <p className="text-lg md:text-2xl text-white/95 leading-relaxed font-medium italic">
                  {currentQuote.quoteEn}
                </p>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                  {currentQuote.quoteId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-14">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-gray-600 text-gray-300 flex items-center justify-center hover:bg-white hover:border-white hover:text-[#231F1E] transition-all duration-300 group"
                aria-label="Previous quote"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-[#C9A86A] text-[#231F1E] flex items-center justify-center hover:bg-[#B89554] transition-all duration-300 shadow-lg hover:shadow-[#C9A86A]/20 group"
                aria-label="Next quote"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        <div className={`relative w-full lg:w-[35%] h-[400px] lg:h-[550px] transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
          }`}>
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[#3D2C1F]/20 mix-blend-multiply z-10 pointer-events-none" />

            <img
              src={currentQuote.image}
              alt={currentQuote.name}
              className="w-full h-full object-cover object-top filter contrast-110 saturate-[0.8] hover:scale-105 transition-transform duration-700 ease-in-out"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.backgroundColor = '#A58B6F';
              }}
            />
          </div>

          <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#C9A86A]/30 rounded-2xl -z-10 hidden lg:block" />
        </div>

      </div>
    </section>
  )
}

export default Kt2B;