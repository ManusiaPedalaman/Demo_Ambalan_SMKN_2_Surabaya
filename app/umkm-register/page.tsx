'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getUserProfileByEmail, registerUMKM, getUserUMKM } from '@/app/actions';
import Image from 'next/image';
import { Store, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UMKMRegisterPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nama_umkm: '',
        nama_lengkap: '', // Owner name
        no_wa: '',
        kelas: '',
        jurusan: ''
    });

    useEffect(() => {
        const init = async () => {
            if (session?.user?.email) {
                const profile = await getUserProfileByEmail(session.user.email);
                if (profile) {
                    setUserId(profile.id_login);
                    // Autofill some data
                    setFormData(prev => ({
                        ...prev,
                        nama_lengkap: profile.nama_lengkap || '',
                        no_wa: profile.no_wa || '',
                        kelas: profile.kelas || '',
                        jurusan: profile.jurusan || ''
                    }));

                    // Check if already has UMKM
                    const existing = await getUserUMKM(profile.id_login);
                    if (existing) {
                        router.push('/dashboard/user/umkm'); // Redirect back if already exists
                        return;
                    }
                }
            }
            setChecking(false);
        };
        init();
    }, [session, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!userId) {
            alert('User session not found');
            setLoading(false);
            return;
        }

        const res = await registerUMKM({
            id_user: userId,
            ...formData
        });

        if (res.success) {
            router.push('/dashboard/user/umkm');
        } else {
            alert('Gagal mendaftar: ' + res.error);
        }
        setLoading(false);
    };

    if (checking) return <div className="h-screen flex items-center justify-center bg-[#F5F6FA]"><Loader2 className="animate-spin text-[#997B55]" /></div>;

    return (
        <div className="min-h-screen bg-[#F5F6FA] flex flex-col items-center justify-center p-4 font-dm-sans">
             <div className="w-full max-w-lg">
                <Link href="/dashboard/user/umkm" className="inline-flex items-center text-gray-500 hover:text-[#997B55] mb-6 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Kembali ke Dashboard
                </Link>
                
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-[#997B55] p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Store size={32} />
                        </div>
                        <h1 className="text-2xl font-bold">Daftar UMKM</h1>
                        <p className="text-white/80 text-sm mt-2">Mulai perjalanan bisnis Anda bersama Ambalan</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-gray-700">Nama UMKM / Bisnis</label>
                             <input 
                                required
                                name="nama_umkm"
                                value={formData.nama_umkm} 
                                onChange={handleChange}
                                placeholder="Contoh: Keripik Pisang Mantap"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#997B55] focus:outline-none"
                             />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nama Pemilik</label>
                                <input 
                                    required
                                    name="nama_lengkap"
                                    value={formData.nama_lengkap} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#997B55] focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nomor WhatsApp</label>
                                <input 
                                    required
                                    name="no_wa"
                                    value={formData.no_wa} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#997B55] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Kelas</label>
                                <input 
                                    required
                                    name="kelas"
                                    value={formData.kelas} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#997B55] focus:outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Jurusan</label>
                                <input 
                                    required
                                    name="jurusan"
                                    value={formData.jurusan} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#997B55] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-[#997B55] text-white font-bold rounded-xl mt-4 hover:bg-[#8B6E4A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#997B55]/30"
                        >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                        </button>
                    </form>
                </div>
             </div>
        </div>
    );
}
