'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
    ChevronLeft,
    User,
    Layers,
    FileText,
    List,
    Code,
    Box
} from 'lucide-react';
import { getMateriById } from '@/app/actions';

export default function MateriDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const id = params.id as string;

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const result = await getMateriById(id);
                setData(result);
            } catch (error) {
                console.error('Failed to load materi:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) loadData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#9C7C5B]/30 border-t-[#9C7C5B] rounded-full animate-spin" />
                    <p className="text-sm text-gray-400 font-dm-sans">Memuat materi...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] font-dm-sans">
                <h1 className="text-xl font-bold text-gray-800 mb-2">Materi tidak ditemukan</h1>
                <button onClick={() => router.back()} className="text-[#9C7C5B] font-bold">Kembali</button>
            </div>
        );
    }

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
                            <p className="text-[10px] text-gray-400 leading-tight">AdminMada@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8">

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#9C7C5B]/5 rounded-bl-full -mr-10 -mt-10" />

                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-[#FDFBF9] border border-gray-100 flex items-center justify-center text-[#9C7C5B] shadow-sm">

                                <Layers size={40} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#9C7C5B] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        Materi Latihan
                                    </span>
                                    <span className="text-gray-400 text-xs font-mono">ID: {data.id}</span>
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.nama}</h1>
                                <div className="flex gap-2">
                                    {data.topik.map((t: string, i: number) => (
                                        <span key={i} className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            #{t.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-[#9C7C5B]" />
                            Konten Materi (JSON Content)
                        </h3>
                        <div className="bg-[#1E1E1E] text-gray-300 p-6 rounded-2xl font-mono text-sm overflow-x-auto shadow-inner border border-gray-800">
                            <pre>{JSON.stringify(data.content, null, 2)}</pre>
                        </div>
                    </div>

                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Struktur Data</h4>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Box size={16} className="text-[#9C7C5B]" />
                                        <span className="text-sm font-medium text-gray-700">Type</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">Quiz / Module</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <List size={16} className="text-[#9C7C5B]" />
                                        <span className="text-sm font-medium text-gray-700">Items</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">{Array.isArray(data.content) ? data.content.length : '1'} Questions</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
