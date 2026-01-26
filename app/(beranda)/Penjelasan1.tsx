'use client';

import { useEffect, useRef, useState } from 'react';


if (typeof document !== 'undefined') {
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap';
  fontLink.rel = 'stylesheet';
  if (!document.querySelector(`link[href="${fontLink.href}"]`)) {
    document.head.appendChild(fontLink);
  }
}


const hexToRgb = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, index }: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, index * 150);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col items-center md:items-start text-center md:text-left
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >

      <div className="absolute inset-0 bg-gradient-to-br rounded-2xl 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 
        transform group-hover:scale-105 transition-transform"
        style={{ backgroundImage: 'linear-gradient(to bottom right, rgba(122, 95, 61, 0.1), transparent)' }} />


      <div className="mb-4 md:mb-6 relative">
        <div className="absolute inset-0 rounded-full blur-xl opacity-0 
          group-hover:opacity-60 transition-opacity duration-500 transform scale-150"
          style={{ backgroundColor: 'rgba(122, 95, 61, 0.3)' }} />
        <div className="relative transform group-hover:scale-110 group-hover:rotate-3 
          transition-all duration-500 ease-out">
          {icon}
        </div>
      </div>


      <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-3 md:mb-4 
        transition-colors duration-300"
        style={{
          color: '#1A1A1A',
          '--group-hover-color': '#7A5F3D'
        } as React.CSSProperties & { '--group-hover-color': string }}
      >
        <span className="group-hover:text-[#7A5F3D] transition-colors duration-300">{title}</span>
      </h3>


      <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xs md:max-w-none
        group-hover:text-gray-700 transition-colors duration-300 text-justify">
        {description}
      </p>


      <div className="absolute bottom-0 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0
        w-0 group-hover:w-12 h-1 
        transition-all duration-500 rounded-full mt-4"
        style={{ backgroundImage: `linear-gradient(to right, #7A5F3D, ${hexToRgb('#7A5F3D', 0.6)})` }} />
    </div>
  );
};

interface Penjelasan1Props {
  paddingTop?: string;
  paddingBottom?: string;
}

const Penjelasan1 = ({
  paddingTop = "100px",
  paddingBottom = "100px",
}: Penjelasan1Props) => {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHeaderVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  return (
    <section

      className="w-full relative overflow-hidden px-6 md:px-12 lg:px-[100px] bg-white bg-gradient-to-b from-white to-[#7A5F3D]/5 transition-colors duration-500"
      style={{
        paddingTop,
        paddingBottom,
        fontFamily: "'DM Sans', sans-serif"
      }}
    >

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -z-10"
        style={{ backgroundColor: 'rgba(122, 95, 61, 0.08)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl -z-10"
        style={{ backgroundColor: 'rgba(122, 95, 61, 0.05)' }} />

      <div className="max-w-7xl mx-auto relative">

        <div
          ref={headerRef}
          className={`mb-12 md:mb-16 transition-all duration-1000 ease-out
            ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
        >
          <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-5 
            leading-tight transition-all duration-700 delay-300
            ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Kenapa Harus{' '}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to right, #7A5F3D, rgba(122, 95, 61, 0.8))' }}>
              Pramuka?
            </span>
          </h2>

          <p className={`text-gray-600 text-base md:text-lg lg:text-xl leading-relaxed max-w-4xl
            transition-all duration-700 delay-500
            ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            Karena Pramuka hadir untuk membentuk karakter, keterampilan, dan jiwa kepemimpinan generasi muda.
          </p>


          <div className={`mt-6 h-1.5 w-24 rounded-full
            transition-all duration-700 delay-700
            ${headerVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'} origin-left`}
            style={{ backgroundImage: 'linear-gradient(to right, #7A5F3D, rgba(122, 95, 61, 0.6))' }} />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">

          <FeatureCard
            index={0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 md:w-20 md:h-30 drop-shadow-lg" viewBox="0 0 68 68" fill="none">
                <path d="M32.1619 5.41875C33.3731 5.17438 34.6163 5.17438 35.8275 5.41875L55.7494 9.40313C56.9394 9.63688 57.8 10.6888 57.8 11.9C57.8 13.1113 56.9394 14.1631 55.7494 14.3969L47.6 16.0331V22.525C47.6 29.8031 41.7031 35.7 34.425 35.7C27.1469 35.7 21.25 29.8031 21.25 22.525V16.2031L15.3 15.0131V22.1L16.9681 30.4513C16.9894 30.5469 17 30.6531 17 30.7594C17 31.6094 16.3094 32.3106 15.4488 32.3106H11.7406C10.8906 32.3106 10.1894 31.62 10.1894 30.7594C10.1894 30.6531 10.2 30.5575 10.2213 30.4513L11.9 22.1V14.3013C10.8906 13.9506 10.2 12.9944 10.2 11.9C10.2 10.6888 11.0606 9.63688 12.2506 9.40313L32.1619 5.41875ZM26.35 22.1V22.525C26.35 26.9875 29.9625 30.6 34.425 30.6C38.8875 30.6 42.5 26.9875 42.5 22.525V22.1H26.35ZM24.9688 39.5144C25.84 39.3231 26.7431 39.61 27.3594 40.2581L34.0106 47.2919L40.6619 40.2581C41.2781 39.61 42.1813 39.3338 43.0525 39.5144C51.4888 41.3206 57.8213 48.8219 57.8213 57.8V58.65C57.8213 60.0631 56.6844 61.2 55.2713 61.2C53.8581 61.2 52.7213 60.0631 52.7213 58.65V57.8C52.7213 51.765 48.7794 46.6331 43.3288 44.8588L36.55 52.0094V58.65C36.55 60.0631 35.4131 61.2 34 61.2C32.5869 61.2 31.45 60.0631 31.45 58.65V52.0094L24.6925 44.8588C19.2419 46.6331 15.3 51.765 15.3 57.8V58.65C15.3 60.0631 14.1631 61.2 12.75 61.2C11.3369 61.2 10.2 60.0631 10.2 58.65V57.8C10.2 48.8219 16.5325 41.3206 24.9688 39.5144Z" fill="#7A5F3D" />
              </svg>
            }
            title="Pembentukan Karakter"
            description="Pramuka menanamkan nilai disiplin, tanggung jawab, dan kerjasama melalui kegiatan berlandaskan Dasa Dharma dan Satya Pramuka."
          />


          <FeatureCard
            index={1}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 md:w-20 md:h-30 drop-shadow-lg" viewBox="0 0 68 68" fill="none">
                <path d="M42.4362 8.24502C43.5094 9.14814 43.6581 10.7631 42.7444 11.8363L37.3256 18.2856L59.9994 45.2413C60.775 46.1656 61.2 47.3238 61.2 48.5244V53.55C61.2 55.8981 59.2981 57.8 56.95 57.8H11.05C8.70186 57.8 6.79999 55.8981 6.79999 53.55V48.5244C6.79999 47.3238 7.22499 46.1656 8.00061 45.2413L30.6744 18.2856L25.2556 11.8363C24.3525 10.7631 24.4906 9.14814 25.5637 8.24502C26.6369 7.34189 28.2519 7.48002 29.155 8.55314L34 14.3225L38.845 8.56377C39.7481 7.49064 41.3631 7.34189 42.4362 8.25564V8.24502ZM11.9 48.5244V52.7H18.615L20.2406 50.9575L32.1406 38.2075C32.6187 37.6869 33.2987 37.4 34 37.4C34.7012 37.4 35.3812 37.6975 35.8594 38.2075L47.7594 50.9575L49.385 52.7H56.1V48.5244L34 22.2381L11.9 48.5244ZM25.585 52.7H42.4044L33.9894 43.69L25.5744 52.7H25.585Z" fill="#7A5F3D" />
              </svg>
            }
            title="Keterampilan Hidup"
            description="Melatih anggota untuk mandiri dengan keterampilan survival, pertolongan pertama, hingga penguasaan tali-temali dan pioneering."
          />


          <FeatureCard
            index={2}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 md:w-20 md:h-30 drop-shadow-lg" viewBox="0 0 68 68" fill="none">
                <path d="M22.6667 5.66663V14.1666" stroke="#7A5F3D" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M45.3333 5.66663V14.1666" stroke="#7A5F3D" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.91669 25.755H58.0834" stroke="#7A5F3D" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M62.3334 53.8333C62.3334 55.9583 61.7383 57.97 60.69 59.67C58.735 62.9567 55.1367 65.1667 51 65.1667C48.1384 65.1667 45.5317 64.1183 43.5484 62.3333C42.67 61.5967 41.905 60.69 41.31 59.67C40.2617 57.97 39.6667 55.9583 39.6667 53.8333C39.6667 47.5717 44.7384 42.5 51 42.5C54.4 42.5 57.4317 44.0016 59.5 46.3533C61.2567 48.365 62.3334 50.9717 62.3334 53.8333Z" stroke="#7A5F3D" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M46.58 53.8333L49.385 56.6383L55.42 51.0566" stroke="#7A5F3D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M59.5 24.0833V46.3533C57.4317 44.0016 54.4 42.5 51 42.5C44.7383 42.5 39.6667 47.5716 39.6667 53.8333C39.6667 55.9583 40.2617 57.97 41.31 59.67C41.905 60.69 42.67 61.5966 43.5483 62.3333H22.6667C12.75 62.3333 8.5 56.6666 8.5 48.1666V24.0833C8.5 15.5833 12.75 9.91663 22.6667 9.91663H45.3333C55.25 9.91663 59.5 15.5833 59.5 24.0833Z" stroke="#7A5F3D" strokeWidth="4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M33.9872 38.8167H34.0127" stroke="#7A5F3D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23.5005 38.8167H23.526" stroke="#7A5F3D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M23.5005 47.3167H23.526" stroke="#7A5F3D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            title="Kegiatan Beragam"
            description="Dari latihan mingguan, perkemahan, lomba, hingga bakti sosial, semua kegiatan pramuka dirancang untuk mengasah jiwa kepemimpinan dan kepedulian sosial."
          />
        </div>
      </div>
    </section>
  );
};

export default Penjelasan1;