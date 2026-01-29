'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, FileText, Phone, ArrowLeft, ChevronDown, ChevronRight, Flame, Menu, X, Store } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
    const pathname = usePathname();

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const isUserActive = pathname.startsWith('/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/user');

    return (
        <>

            <button
                onClick={toggleMobile}
                className="lg:hidden fixed top-4 left-4 z-[110] p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-[#8B6E4A] transition-colors"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>


            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[90] lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>


            <div className={`
                fixed top-0 left-0 bottom-0 h-[100dvh] bg-white border-r border-gray-100 flex flex-col z-[100] font-dm-sans w-64
                transform transition-transform duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>

                <div className="pt-8 pb-6 flex flex-col items-center">
                    <Link href="/" className="flex flex-col items-center gap-2 group">
                        <Image
                            src="/Logo/LogoAmbalan.svg"
                            alt="Logo Ambalan"
                            width={50}
                            height={50}
                            className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="flex flex-col leading-tight text-center mt-2">
                            <span className="text-[#56ABD7] text-xl font-bold tracking-widest" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                AMBALAN
                            </span>
                            <span className="text-[#8B5E34] text-[10px] font-semibold tracking-[0.2em]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                -SMKN 2 SURABAYA-
                            </span>
                        </div>
                    </Link>
                </div>


                <nav className="flex-1 overflow-y-auto py-8 px-6 space-y-4">


                    <Link
                        href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <LayoutDashboard size={22} className={pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">Dashboard</span>
                    </Link>


                    <Link
                        href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/produk"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/produk'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <Package size={22} className={pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/produk' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">Produk</span>
                    </Link>



                    <Link
                        href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/user"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${isUserActive
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <Users size={22} className={isUserActive ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">User</span>
                    </Link>


                    <Link
                        href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <Flame size={22} className={pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">Latihan</span>
                    </Link>



                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Konfirmasi User</p>
                    </div>

                    <Link
                        href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/konfirmasi-umkm"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/konfirmasi-umkm'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <Store size={22} className={pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/konfirmasi-umkm' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">Konfirmasi UMKM</span>
                    </Link>

                    <Link
                        href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/konfirmasi-produk"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/konfirmasi-produk'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <Package size={22} className={pathname === '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/konfirmasi-produk' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">Konfirmasi Produk</span>
                    </Link>
                </nav>


                <div className="p-6">
                    <div className="h-[1px] w-full bg-gray-100 mb-6"></div>
                    <Link
                        href="/"
                        className="flex items-center gap-3 group px-2 transition-all duration-200 hover:pl-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center group-hover:bg-[#8B6E4A] group-hover:text-white transition-colors">
                            <ArrowLeft size={20} strokeWidth={2} className="ml-1" />
                        </div>
                        <span className="font-medium text-gray-600 group-hover:font-semibold group-hover:text-[#8B6E4A]">Kembali</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
