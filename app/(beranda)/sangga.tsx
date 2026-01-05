'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DM_Sans } from 'next/font/google';


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

interface Sangga {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function SanggaComponent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isVisible, setIsVisible] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;


  const [tiltValues, setTiltValues] = useState<Record<number, { x: number; y: number }>>({});

  const sectionRef = useRef<HTMLElement>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };


  const sanggas: Sangga[] = [
    {
      id: 1,
      title: 'PERINTIS',
      description: 'Melambangkan masa merintis kemerdekaan dengan mengeluarkan ide-ide sebagai pelopor kebaikan.',
      image: '/Icon/tanda_sangga_penegak-1.webp'
    },
    {
      id: 2,
      title: 'PENCOBA',
      description: 'Melambangkan tekad dalam mencoba dan menjalankan gagasan atau ide-ide yang telah direncanakan.',
      image: '/Icon/tanda_sangga_penegak-4.webp'
    },
    {
      id: 3,
      title: 'PENDOBRAK',
      description: 'Melambangkan keberanian untuk mengemukakan kebenaran dan melawan kemungkaran.',
      image: '/Icon/tanda_sangga_penegak-3.webp'
    },
    {
      id: 4,
      title: 'PENEGAS',
      description: 'Melambangkan sikap tegas dan berani dalam menetapkan suatu keputusan.',
      image: '/Icon/tanda_sangga_penegak-2.webp'
    },
    {
      id: 5,
      title: 'PELAKSANA',
      description: 'Melambangkan tanggung jawab dalam melaksanakan semua tugas yang diberikan.',
      image: '/Icon/tanda_sangga_penegak-5.webp'
    }
  ];


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


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerView]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sanggas.length);
    setTiltValues({});
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sanggas.length) % sanggas.length);
    setTiltValues({});
  };

  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % sanggas.length;
      items.push(sanggas[index]);
    }
    return items;
  };

  const visibleSanggas = getVisibleItems();


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();


    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    const centerX = rect.width / 2;
    const centerY = rect.height / 2;


    const rotateX = (centerY - y) / 10;
    const rotateY = (x - centerX) / 10;

    setTiltValues((prev) => ({
      ...prev,
      [index]: { x: rotateX, y: rotateY },
    }));
  };

  const handleMouseLeave = (index: number) => {

    setTiltValues((prev) => ({
      ...prev,
      [index]: { x: 0, y: 0 },
    }));
  };



  return (
    <section
      ref={sectionRef}
      className={`w-full bg-[#1E1C1B] py-20 px-4 md:px-8 lg:px-12 overflow-hidden ${dmSans.className}`}
    >
      <div className="max-w-7xl mx-auto">

        <div className={`mb-12 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Apa itu <span className="text-[#C4A484]">Sangga?</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Sangga adalah tanda satuan terkecil pramuka penegak, Setiap jenis sangga
            melambangkan tahapan perjuangan bangsa, yaitu:
          </p>
        </div>

        <div className="relative">

          {/* Swipe Wrapper */}
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="touch-pan-y"
          >

            <button
              onClick={prevSlide}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <ChevronLeft className="w-6 h-6 text-[#1E1C1B]" />
            </button>

            <button
              onClick={nextSlide}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <ChevronRight className="w-6 h-6 text-[#1E1C1B]" />
            </button>


            <div className={`grid gap-6 transition-all duration-700 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`
              }}
            >
              {visibleSanggas.map((item, idx) => {
                const tilt = tiltValues[idx] || { x: 0, y: 0 };

                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className="group bg-[#252322] rounded-xl overflow-hidden border border-white/5 hover:border-[#C4A484]/50 transition-all duration-300 flex flex-col hover:-translate-y-2 hover:shadow-2xl"
                  >

                    <div
                      className="relative w-full aspect-square bg-[#2A2827] p-8 flex items-center justify-center perspective-container cursor-pointer"
                      style={{ perspective: '1000px' }}
                      onMouseMove={(e) => handleMouseMove(e, idx)}
                      onMouseLeave={() => handleMouseLeave(idx)}
                    >

                      <div
                        className="relative w-full h-full shadow-lg"
                        style={{
                          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.05, 1.05, 1.05)`,
                          transition: 'transform 0.1s ease-out',
                          transformStyle: 'preserve-3d',
                        }}
                      >

                        <div
                          className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)`
                          }}
                        />

                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain drop-shadow-2xl"
                          style={{ transform: 'translateZ(20px)' }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>


                    <div className="p-6 flex flex-col flex-grow relative z-20 bg-[#252322]">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1 group-hover:text-[#C4A484] transition-colors">
                        Sangga
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed text-justify">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* End Swipe Wrapper */}

          {/* Swipe Area Wrapper for Mobile */}
          <div
            className="md:hidden absolute inset-0 z-10"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        </div>

      </div>
    </section >
  );
}