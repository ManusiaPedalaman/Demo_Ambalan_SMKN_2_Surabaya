'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link'; 
import Image from 'next/image';
import { Instagram, Heart } from 'lucide-react'; 
import { DM_Sans } from 'next/font/google';

// Konfigurasi Font DM Sans
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

// Icon TikTok Custom
const TikTokIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-5 h-5"
  >
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-.997-.104z"/>
  </svg>
);

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  // Logic Animasi Scroll
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

    if (footerRef.current) observer.observe(footerRef.current);
    return () => {
      if (footerRef.current) observer.disconnect();
    };
  }, []);

  // Data Link
  const linksLeft = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/tentang' },
    { name: 'Latihan', path: '/latihan' },
    { name: 'Hubungi Kami', path: '/hubungi_kami' },
  ];

  const linksRight = [
    { name: 'Ketentuan Penggunaan', path: '/terms' },
    { name: 'Kebijakan Privasi', path: '/privacy' },
    { name: 'FAQ', path: '/tentang' },
    { name: 'Kontak', path: '/kontak' },
  ];

  // Tahun otomatis
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      ref={footerRef}
      className={`w-full bg-white border-t border-gray-100 pt-16 pb-8 px-6 md:px-12 lg:px-[150px] ${dmSans.className}`}
    >
      {/* === MAIN CONTENT === */}
      <div className={`max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 transition-all duration-1000 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        {/* === LEFT SECTION: Tentang & Deskripsi === */}
        <div className="w-full lg:w-[45%]">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6 tracking-tight">
            Tentang.
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-md">
            Ambalan adalah satuan organisasi dalam Gerakan Pramuka 
            untuk golongan Pramuka Penegak, yang terdiri dari beberapa 
            sangga dan berfungsi sebagai wadah untuk berlatih, 
            berkarya, dan mengembangkan kepemimpinan bagi anggota.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a 
              href="https://www.tiktok.com/@arsmekda?is_from_webapp=1&sender_device=pc" 
              className="w-12 h-12 bg-[#EAEAEA] rounded-full flex items-center justify-center text-gray-600 hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="TikTok"
            >
              <TikTokIcon />
            </a>
            <a 
              href="https://www.instagram.com/arsmekda.scout?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              className="w-12 h-12 bg-[#EAEAEA] rounded-full flex items-center justify-center text-gray-600 hover:bg-[#1A1A1A] hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* === RIGHT SECTION: Logo & Links Grid === */}
        <div className="w-full lg:w-[55%] flex flex-col">
          
          {/* Logo Brand Area */}
          <div className="mb-10">
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <Image
                src="/Logo/LogoAmbalan.svg"
                alt="Logo Ambalan"
                width={40}
                height={40}
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="flex flex-col leading-tight">
                <span
                  className="text-xl font-bold tracking-wide text-[#56ABD7]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  AMBALAN
                </span>
                <span
                  className="text-[10px] tracking-[0.15em] text-[#7A7A7A]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  -SMKN 2 SURABAYA-
                </span>
              </div>
            </Link>
          </div>

          {/* Links Grid System */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
            {/* Column 1 Links */}
            <div className="flex flex-col gap-4">
              {linksLeft.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.path}
                  className="text-gray-500 font-medium hover:text-[#C7A682] hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Column 2 Links */}
            <div className="flex flex-col gap-4">
              {linksRight.map((link, idx) => (
                <Link 
                  key={idx} 
                  href={link.path}
                  className="text-gray-500 font-medium hover:text-[#C7A682] hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* === COPYRIGHT SECTION (NEW) === */}
      <div className={`max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 transition-all duration-1000 delay-300 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
             &copy; {currentYear} <span className="font-medium text-gray-600">Ambalan Gajah Mada - Tungga Dewi</span>. All rights reserved.
          </p>
          
          <p className="text-gray-400 text-sm flex items-center gap-1.5">
            Created with <Heart size={14} className="text-red-400 fill-red-400" /> by 
            <span className="font-bold text-[#56ABD7] cursor-pointer hover:underline">
              Alan Nuklir
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;