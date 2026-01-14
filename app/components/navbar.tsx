'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from 'framer-motion';

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


  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);

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


  const handleProfileImageChange = () => {
    setIsProfileMenuOpen(false);
    fileInputRef.current?.click();
  };



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


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAvatar = localStorage.getItem('userAvatar');
      if (storedAvatar) {
        setPreviewImage(storedAvatar);
      }
    }
  }, []);


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


  const getNavbarBg = () => {
    if (isMobileMenuOpen) return 'bg-white';
    if (isTransparentPage && !isProfileMenuOpen) {
      return isScrolled ? 'bg-white shadow-md' : 'bg-transparent';
    }
    return 'bg-white shadow-sm';
  };


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


  const getLogoTextColor = () => {
    if (isTransparentPage && !isScrolled && !isMobileMenuOpen && !isProfileMenuOpen) {
      return { title: 'text-[#A4D8F3]', subtitle: 'text-gray-200' };
    }
    return { title: 'text-[#56ABD7]', subtitle: 'text-[#7A7A7A]' };
  };

  const logoColors = getLogoTextColor();


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

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <>

      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowLogoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <LogOut size={32} className="text-red-600 ml-1" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Konfirmasi Keluar</h3>
                <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  "Apakah Anda yakin ingin keluar dari akun Anda?"
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-200"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Keluar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelection}
        accept="image/*"
        className="hidden"
      />


      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getNavbarBg()}`}
      >
        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-[315px] py-4">
          <div className="flex items-center justify-between">


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


            <div className="hidden lg:flex items-center gap-3 relative" ref={profileRef}>

              {session ? (

                <>

                  <Link
                    href="/hubungi_kami"
                    className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 whitespace-nowrap inline-block shadow-md hover:shadow-lg hover:-translate-y-0.5 
                      bg-[#6B4D27] hover:bg-[#7A5F3D] text-white
                    `}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Hubungi Kami
                  </Link>


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


                  {isProfileMenuOpen && (
                    <div className="absolute right-0 top-full mt-4 w-64 bg-[#3D3D3D] rounded-xl shadow-2xl py-2 transition-all duration-300 origin-top animate-fade-in">


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


                      <div className='flex flex-col p-2 pt-0'>


                        <button
                          onClick={handleProfileImageChange}
                          className="flex items-center gap-3 w-full text-left px-3 py-3 text-lg font-medium text-white hover:bg-[#4a4a4a] rounded-lg transition-colors"
                        >
                          <User size={20} className='text-gray-300' />
                          Profile
                        </button>


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
                            setShowLogoutModal(true);
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

                <>
                  <Link

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


            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsProfileMenuOpen(false);
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


          {session ? (
            <>

              <button
                onClick={() => {
                  handleProfileImageChange();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left font-medium py-3 transition-all duration-300 text-lg border-b border-gray-100 text-[#3D3D3D]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Profile
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
                  setShowLogoutModal(true);
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

            <div className='flex flex-col space-y-4 pt-4'>
              <Link

                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-gray-100 border border-[#6B4D27] text-[#6B4D27] px-6 py-3 rounded-full font-medium text-center transition-all duration-300 shadow-sm"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Masuk
              </Link>
              <Link

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