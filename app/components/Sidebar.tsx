'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, FileText, Phone, LogOut, ChevronDown, ChevronRight, Flame, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
    const pathname = usePathname();

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const isUserActive = pathname.startsWith('/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/user');

    return (
        <>

            <button
                onClick={toggleMobile}
                className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-[#8B6E4A] transition-colors"
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
                        className="fixed inset-0 bg-black/50 z-[40] lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-dm-sans"
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
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Keluar</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    "Apakah Anda yakin ingin keluar dari akun Anda?"
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setShowLogoutModal(false)}
                                        className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-200"
                                    >
                                        Keluar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <div className={`
                fixed top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col z-[50] font-dm-sans w-64
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


                </nav>


                <div className="p-6">
                    <div className="h-[1px] w-full bg-gray-100 mb-6"></div>
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex items-center gap-3 group px-2 transition-all duration-200 hover:pl-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#F8E7E7] text-[#D35E5E] flex items-center justify-center group-hover:bg-[#D35E5E] group-hover:text-white transition-colors">
                            <LogOut size={20} strokeWidth={2} className="ml-1" />
                        </div>
                        <span className="font-medium text-[#D35E5E] group-hover:font-semibold">Keluar</span>
                    </button>
                </div>
            </div>
        </>
    );
}
