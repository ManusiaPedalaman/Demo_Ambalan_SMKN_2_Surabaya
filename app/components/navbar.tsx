'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [hoveredLink, setHoveredLink] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();

  const isTransparentPage = pathname === '/' || pathname === '/tentang';

  // FUNGSI UNTUK MENANGANI FILE YANG DIPILIH (Simulasi ganti avatar)
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        // Simpan ke LocalStorage agar tidak hilang saat refresh
        if (typeof window !== 'undefined') {
          localStorage.setItem('userAvatar', base64String);
        }
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  // FUNGSI UNTUK MENGAKTIFKAN PEMILIHAN FILE DARI TOMBOL
  const handleProfileImageChange = () => {
    setIsProfileMenuOpen(false); // Tutup dropdown
    fileInputRef.current?.click(); // Memicu klik pada input file tersembunyi
  };


  // LOGIKA: Menutup dropdown saat klik di luar area profil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && event.target instanceof Node) {
        if (!profileRef.current.contains(event.target)) {
          setIsProfileMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside as EventListener);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
    };
  }, []);

  // LOGIKA: Load avatar dari LocalStorage saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAvatar = localStorage.getItem('userAvatar');
      if (storedAvatar) {
        setPreviewImage(storedAvatar);
      }
    }
  }, []);

  // LOGIKA: Mengubah state saat scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper untuk menentukan Warna Navbar Background
  const getNavbarBg = () => {
    if (isMobileMenuOpen) return 'bg-white';
    if (isTransparentPage && !isProfileMenuOpen) {
      return isScrolled ? 'bg-white shadow-md' : 'bg-transparent';
    }
    return 'bg-white shadow-sm';
  };

  // Helper untuk menentukan Warna Text Menu
  const getLinkClass = (href: string) => {
    const isActive = href === '/'
      ? pathname === href
      : pathname.startsWith(href);

    if (isActive) {
      return "text-[#C7A682] font-bold";
    }

    if (hoveredLink === href) {
      return "text-[#C7A682]";
    }

    const isTransparentText = isTransparentPage && !isScrolled && !isMobileMenuOpen && !isProfileMenuOpen;

    if (isTransparentText) {
      return "text-white";
    }

    return "text-[#3D3D3D]";
  };

  // Helper untuk warna Text Logo (Ambalan)
  const getLogoTextColor = () => {
    if (isTransparentPage && !isScrolled && !isMobileMenuOpen && !isProfileMenuOpen) {
      return { title: 'text-[#A4D8F3]', subtitle: 'text-gray-200' };
    }
    return { title: 'text-[#56ABD7]', subtitle: 'text-[#7A7A7A]' };
  };

  const logoColors = getLogoTextColor();

  // Helper untuk mendapatkan inisial user
  const getUserInitials = () => {
    if (session?.user?.name) {
      const names = session.user.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return session.user.name.substring(0, 2).toUpperCase();
    }
    return 'AB';
  };

  const isAdmin = (session?.user as any)?.role === 'ADMIN';

  return (
    <>
      {/* Input File Tersembunyi untuk mengganti gambar profil */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        accept="image/*"
        className="hidden"
      />

      {/* Desktop & Mobile Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBg()}`}
      >
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-[315px] py-4">
          <div className="flex items-center justify-between">

            {/* === LOGO === */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/Logo/LogoAmbalan.svg"
                alt="Logo Ambalan"
                width={40}
                height={40}
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="flex flex-col leading-tight">
                <span
                  className={`text-xl font-bold tracking-wide transition-all duration-300 ${logoColors.title}`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  AMBALAN
                </span>
                <span
                  className={`text-[10px] tracking-[0.15em] transition-colors duration-300 ${logoColors.subtitle}`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  -SMKN 2 SURABAYA-
                </span>
              </div>
            </Link>

            {/* === DESKTOP MENU === */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-8 px-8">
              <Link
                href="/"
                onMouseEnter={() => setHoveredLink('/')}
                onMouseLeave={() => setHoveredLink('')}
                className={`font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${getLinkClass('/')}`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Beranda
              </Link>
              <Link
                href="/tentang"
                onMouseEnter={() => setHoveredLink('/tentang')}
                onMouseLeave={() => setHoveredLink('')}
                className={`font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${getLinkClass('/tentang')}`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Tentang
              </Link>
              <Link
                href="/latihan"
                onMouseEnter={() => setHoveredLink('/latihan')}
                onMouseLeave={() => setHoveredLink('')}
                className={`font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${getLinkClass('/latihan')}`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Latihan
              </Link>
              <Link
                href="/produk_kami"
                onMouseEnter={() => setHoveredLink('/produk_kami')}
                onMouseLeave={() => setHoveredLink('')}
                className={`font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${getLinkClass('/produk_kami')}`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Produk Kami
              </Link>
            </div>

            {/* === CTA & PROFILE (DESKTOP) === */}
            <div className="hidden lg:flex items-center gap-3 relative" ref={profileRef}>

              {session ? (
                // === LOGGED IN STATE: Tampilkan Hubungi Kami & Profile Avatar ===
                <>
                  {/* Tombol Hubungi Kami (Opsional, bisa diubah sesuai kebutuhan navigasi login) */}
                  <Link
                    href="/hubungi_kami"
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap inline-block shadow-md hover:shadow-lg hover:-translate-y-0.5 
                      bg-[#6B4D27] hover:bg-[#7A5F3D] text-white
                    `}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Hubungi Kami
                  </Link>

                  {/* Tombol Profile Avatar/Inisial */}
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ring-2 ring-offset-2 hover:ring-offset-1 
                      ${session.user?.image ? 'p-0 bg-transparent' : 'bg-[#C7A682]'} ring-transparent hover:ring-[#7A5F3D]
                    `}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    aria-label="User Profile Menu"
                  >
                    {previewImage || session.user?.image ? (
                      <Image
                        src={previewImage || session.user?.image || ''}
                        alt="Profile Avatar"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-4 w-64 bg-[#3D3D3D] rounded-xl shadow-2xl py-2 transition-all duration-300 origin-top animate-fade-in">

                      {/* Bagian Atas Dropdown (Email dan Avatar) */}
                      <div className="flex flex-col items-center p-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2 overflow-hidden
                            ${session.user?.image ? 'p-0 bg-transparent' : 'bg-[#C7A682]'}
                        `}>
                          {previewImage || session.user?.image ? (
                            <Image
                              src={previewImage || session.user?.image || ''}
                              alt="Profile Avatar"
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                        <span className="text-sm text-gray-300 truncate w-full text-center">
                          {session.user?.email}
                        </span>
                      </div>

                      {/* Menu Navigasi Dropdown */}
                      <div className='flex flex-col p-2 pt-0'>

                        {/* Tombol EDIT PROFILE: Memicu Input File */}
                        <button
                          onClick={handleProfileImageChange}
                          className="flex items-center gap-3 w-full text-left px-3 py-3 text-lg font-medium text-white hover:bg-[#4a4a4a] rounded-lg transition-colors"
                        >
                          <User size={20} className='text-gray-300' />
                          Edit Profile
                        </button>

                        {/* Menu Khusus Admin */}
                        {isAdmin && (
                          <Link
                            href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 w-full text-left px-3 py-3 text-lg font-medium text-white hover:bg-[#4a4a4a] rounded-lg transition-colors"
                          >
                            <LayoutDashboard size={20} className='text-gray-300' />
                            Dashboard
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            signOut({ callbackUrl: '/' });
                            setIsProfileMenuOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-3 py-3 text-lg font-medium text-white hover:bg-[#4a4a4a] rounded-lg transition-colors"
                        >
                          <LogOut size={20} className='text-red-400' />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // === LOGGED OUT STATE: Tampilkan Masuk & Daftar (Sesuai Gambar) ===
                <>
                  <Link
                    // Menggunakan rute berdasarkan struktur file Anda: /login/masuk
                    href="/login"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap inline-block 
                      ${isTransparentPage && !isScrolled ? 'text-white hover:bg-white/10' : 'text-[#6B4D27] hover:bg-[#C7A682]/10'}
                    `}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Masuk
                  </Link>
                  <Link
                    // Menggunakan rute berdasarkan struktur file Anda: /login/daftar
                    href="/register"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap inline-block shadow-md hover:shadow-lg hover:-translate-y-0.5 
                      bg-[#6B4D27] hover:bg-[#7A5F3D] text-white
                    `}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>

            {/* === MOBILE HAMBURGER BUTTON === */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsProfileMenuOpen(false); // Tutup dropdown profil saat membuka menu mobile
              }}
              className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${isMobileMenuOpen
                ? 'bg-[#5E4B35] hover:bg-[#4a3b2a]'
                : 'bg-[#A68B6C] hover:bg-[#8f765b]'
                }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-white" strokeWidth={2.5} />
              ) : (
                <Menu size={20} className="text-white" strokeWidth={2.5} />
              )}
            </button>

          </div>
        </div>
      </nav>

      {/* === MOBILE MENU DROPDOWN === */}
      <div
        className={`fixed top-[72px] left-0 right-0 bg-white shadow-xl z-40 lg:hidden transition-all duration-300 origin-top ${isMobileMenuOpen ? 'max-h-screen opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0 overflow-hidden'
          }`}
      >
        <div className="flex flex-col py-6 px-6 space-y-4">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 ${pathname === '/' ? 'text-[#C7A682] font-bold' : 'text-[#3D3D3D]'
              }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Beranda
          </Link>
          <Link
            href="/tentang"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 ${pathname === '/tentang' ? 'text-[#C7A682] font-bold' : 'text-[#3D3D3D]'
              }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Tentang
          </Link>
          <Link
            href="/latihan"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 ${pathname === '/latihan' ? 'text-[#C7A682] font-bold' : 'text-[#3D3D3D]'
              }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Latihan
          </Link>
          <Link
            href="/produk_kami"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 ${pathname.startsWith('/produk_kami') ? 'text-[#C7A682] font-bold' : 'text-[#3D3D3D]'
              }`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Produk Kami
          </Link>

          {/* Jika sudah login, tampilkan Profile, Keluar, dan Hubungi Kami */}
          {session ? (
            <>
              {/* Tombol Profile di Mobile memicu input file tersembunyi */}
              <button
                onClick={() => {
                  handleProfileImageChange();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 text-[#3D3D3D]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Edit Profile
              </button>

              {isAdmin && (
                <Link
                  href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-left font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 text-[#3D3D3D]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 text-red-600"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Keluar
              </button>
              <Link
                href="/hubungi_kami"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#7A5F3D] hover:bg-[#6B4D27] text-white px-6 py-3 rounded-full font-medium text-center transition-all duration-300 mt-4 shadow-md"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Hubungi Kami
              </Link>
            </>
          ) : (
            // Jika BELUM login, tampilkan Masuk dan Daftar
            <div className='flex flex-col space-y-4 pt-4'>
              <Link
                // Menggunakan rute berdasarkan struktur file Anda: /login/masuk
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-gray-100 border border-[#6B4D27] text-[#6B4D27] px-6 py-3 rounded-full font-medium text-center transition-all duration-300 shadow-sm"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Masuk
              </Link>
              <Link
                // Menggunakan rute berdasarkan struktur file Anda: /login/daftar
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-[#6B4D27] hover:bg-[#7A5F3D] text-white px-6 py-3 rounded-full font-medium text-center transition-all duration-300 shadow-md"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Daftar
              </Link>
            </div>
          )}

        </div>
      </div>
    </>
  );
}