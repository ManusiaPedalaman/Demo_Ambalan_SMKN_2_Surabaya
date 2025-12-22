'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
    ChevronLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MessageSquare,
    Briefcase,
    Shield,
    CheckCircle2,
    XCircle,
    Building2,
    GraduationCap,
    BookOpen,
    Clock
} from 'lucide-react';
import { getJoinById, getContactById, getUserById, getAdminById } from '@/app/actions';

export default function UserDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();

    const id = params.id as string;
    const type = searchParams.get('type') as string; // 'join', 'contact', 'user_login', 'admin'

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                let result = null;
                if (type === 'join') {
                    result = await getJoinById(id);
                } else if (type === 'contact') {
                    result = await getContactById(id);
                } else if (type === 'user_login') {
                    result = await getUserById(id);
                } else if (type === 'admin') {
                    result = await getAdminById(id);
                }
                setData(result);
            } catch (error) {
                console.error('Failed to load detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id && type) {
            loadData();
        }
    }, [id, type]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#9C7C5B]/30 border-t-[#9C7C5B] rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 font-dm-sans">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] font-dm-sans">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle size={32} className="text-gray-400" />
                </div>
                <h1 className="text-xl font-bold text-gray-800 mb-2">Data tidak ditemukan</h1>
                <p className="text-gray-500 mb-6">Data yang Anda cari mungkin telah dihapus atau ID tidak valid.</p>
                <button
                    onClick={() => router.back()}
                    className="px-6 py-2 bg-[#9C7C5B] text-white rounded-full font-bold hover:bg-[#8B6E4A] transition-colors"
                >
                    Kembali
                </button>
            </div>
        );
    }


    const StatusBadge = ({ status, activeLabel = 'Aktif', inactiveLabel = 'Nonaktif' }: { status: string | boolean, activeLabel?: string, inactiveLabel?: string }) => {
        // Handle boolean or string status
        const isActive = status === 'Aktif' || status === true || status === 'Terjawab';
        const isPending = status === 'Belum Terjawab';

        let colors = isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200";
        if (isPending) colors = "bg-amber-100 text-amber-700 border-amber-200";

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colors}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : isPending ? 'bg-amber-500' : 'bg-red-500'}`} />
                {status?.toString() || 'Unknown'}
            </span>
        );
    };

    const InfoCard = ({ icon: Icon, label, value, fullWidth = false }: any) => (
        <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 ${fullWidth ? 'col-span-full' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-[#FDFBF9] flex items-center justify-center flex-shrink-0 text-[#9C7C5B]">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">{label}</p>
                <p className="text-gray-900 font-medium text-sm md:text-base break-words">{value || '-'}</p>
            </div>
        </div>
    );


    const renderContent = () => {
        switch (type) {
            case 'join':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B] border-2 border-white shadow-lg">
                                <User size={40} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{data.nama}</h1>
                                <p className="text-gray-400">Anggota Baru</p>
                            </div>
                        </div>

                        <InfoCard icon={Calendar} label="Tanggal Lahir" value={data.tanggal_lahir} />
                        <InfoCard icon={Phone} label="WhatsApp" value={data.no_wa} />
                        <InfoCard icon={Building2} label="Asal Sekolah" value={data.sekolah} />
                        <InfoCard icon={GraduationCap} label="Kelas" value={data.kelas} />
                        <InfoCard icon={BookOpen} label="Jurusan" value={data.jurusan} />
                        <InfoCard icon={Clock} label="Tanggal Join" value={data.created_at ? new Date(data.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'} />
                        <InfoCard icon={MessageSquare} label="Pesan / Alasan" value={data.pesan} fullWidth />
                    </div>
                );
            case 'contact':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B] border-2 border-white shadow-lg">
                                    <MessageSquare size={36} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{data.nama}</h1>
                                    <p className="text-gray-400">Pesan Masuk</p>
                                </div>
                            </div>
                            <StatusBadge status={data.status || 'Belum Terjawab'} />
                        </div>

                        <InfoCard icon={Mail} label="Email" value={data.email} />
                        <InfoCard icon={Phone} label="WhatsApp" value={data.phone} />
                        <div className="col-span-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2">
                            <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                                <div className="w-8 h-8 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B]">
                                    <MessageSquare size={16} />
                                </div>
                                <h3 className="font-bold text-gray-800">Isi Pesan</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {data.pesan}
                            </p>
                        </div>
                    </div>
                );
            case 'user_login':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B] border-2 border-white shadow-lg">
                                    <User size={40} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{data.email.split('@')[0]}</h1>
                                    <p className="text-gray-400">Registered User</p>
                                </div>
                            </div>
                            <StatusBadge status={data.status} />
                        </div>

                        <InfoCard icon={Mail} label="Email" value={data.email} fullWidth />
                        <InfoCard icon={Shield} label="Role" value={data.role} />
                        <InfoCard icon={CheckCircle2} label="Status Akun" value={data.status} />
                    </div>
                );
            case 'admin':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B] border-2 border-white shadow-lg">
                                    <Briefcase size={40} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{data.username}</h1>
                                    <p className="text-gray-400">Administrator</p>
                                </div>
                            </div>
                            <span className="bg-[#9C7C5B] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm shadow-[#9C7C5B]/30">
                                {data.role}
                            </span>
                        </div>

                        <InfoCard icon={User} label="Username" value={data.username} />
                        <InfoCard icon={Mail} label="Email" value={data.email} />
                        <InfoCard icon={Shield} label="Access Level" value="Full Access" />
                        <InfoCard icon={CheckCircle2} label="Status" value={data.status || 'Active'} />
                    </div>
                );
            default:
                return <p>Unknown Type</p>;
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] font-dm-sans text-gray-800 pb-20">

            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#9C7C5B] cursor-pointer transition-colors group"
                    >
                        <div className="bg-white border border-gray-200 p-2 rounded-full group-hover:border-[#9C7C5B] transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="font-bold text-sm tracking-wide uppercase">KEMBALI</span>
                    </div>


                    <div className="hidden md:flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            <User size={18} className="text-gray-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-gray-900 leading-tight">Master Admin</p>
                            <p className="text--[10px] text-gray-400 leading-tight">AdminMada@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <span className="text-[#9C7C5B] font-bold tracking-wider text-xs uppercase mb-2 block">
                        Detail Informasi
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {type === 'join' && 'Data Anggota'}
                        {type === 'contact' && 'Pesan Masuk'}
                        {type === 'user_login' && 'User Account'}
                        {type === 'admin' && 'Admin Account'}
                    </h1>
                </div>

                {renderContent()}
            </main>
        </div>
    );
}
