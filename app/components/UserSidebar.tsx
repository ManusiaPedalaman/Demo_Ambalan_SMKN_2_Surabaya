'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, History, Store, ArrowLeft, Menu, X, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserSidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    // Logout State
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [logoutConfirmationText, setLogoutConfirmationText] = useState('');

    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const handleLogout = async () => {
        if (logoutConfirmationText === 'keluar') {
            await signOut({ callbackUrl: '/login' });
        }
    };

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
                        href="/dashboard/user"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/dashboard/user' || pathname === '/dashboard/user/dashboard'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <LayoutDashboard size={22} className={pathname === '/dashboard/user' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">Dashboard</span>
                    </Link>

                    <Link
                        href="/dashboard/user/profile"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/dashboard/user/profile'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <User size={22} className={pathname === '/dashboard/user/profile' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">Profile</span>
                    </Link>

                    <Link
                        href="/dashboard/user/history"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/dashboard/user/history'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <History size={22} className={pathname === '/dashboard/user/history' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">History</span>
                    </Link>
                    
                     <Link
                        href="/dashboard/user/umkm"
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                            ${pathname === '/dashboard/user/umkm'
                                ? 'bg-[#997B55] text-white shadow-lg shadow-[#997B55]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#997B55]'}
                        `}
                    >
                        <Store size={22} className={pathname === '/dashboard/user/umkm' ? 'text-white' : 'text-gray-400 group-hover:text-[#997B55]'} strokeWidth={1.5} />
                        <span className="font-medium text-[15px]">UMKM</span>
                    </Link>
                </nav>

                <div className="p-6 space-y-2">
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

                    <button
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="w-full flex items-center gap-3 group px-2 transition-all duration-200 hover:pl-4"
                    >
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                            <LogOut size={20} strokeWidth={2} className="ml-1" />
                        </div>
                        <span className="font-medium text-gray-600 group-hover:font-semibold group-hover:text-red-500">Keluar</span>
                    </button>
                </div>
            </div>

            {/* Strict Logout Modal */}
            <AnimatePresence>
                {isLogoutModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[120] flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setIsLogoutModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LogOut size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Keluar</h3>
                            <p className="text-gray-500 mb-4 text-sm">
                                Ketik <strong>"keluar"</strong> di bawah untuk mengonfirmasi logout.
                            </p>
                            
                            <input 
                                value={logoutConfirmationText}
                                onChange={(e) => setLogoutConfirmationText(e.target.value)}
                                className="w-full border rounded-xl px-4 py-3 text-center mb-6 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                placeholder='Ketik "keluar"'
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setIsLogoutModalOpen(false)} 
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleLogout} 
                                    disabled={logoutConfirmationText !== 'keluar'}
                                    className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors
                                        ${logoutConfirmationText === 'keluar' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                    `}
                                >
                                    Keluar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
