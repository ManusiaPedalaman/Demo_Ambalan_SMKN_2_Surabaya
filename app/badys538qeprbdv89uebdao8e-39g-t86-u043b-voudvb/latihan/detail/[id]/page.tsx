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
    Box,
    PlayCircle
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
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <FileText size={20} className="text-[#9C7C5B]" />
                                <h3 className="font-bold text-gray-800 text-lg">Struktur Data Materi</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Type</h4>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <Box size={16} className="text-[#9C7C5B]" />
                                        <span>Interactive Module</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Items</h4>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <List size={16} className="text-[#9C7C5B]" />
                                        <span>{Array.isArray(data.content) ? data.content.length : '1'} Sections</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Icon ID</h4>
                                    <div className="flex items-center gap-2 font-bold text-gray-900">
                                        <Code size={16} className="text-[#9C7C5B]" />
                                        <span className="truncate">{data.icon || 'default'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Pratinjau Konten</h4>

                                <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100 font-mono text-xs text-gray-600 max-h-[400px] overflow-y-auto">
                                    {/* Render specific fields nicely if possible, else structured generic view */}
                                    {data.content ? (
                                        <div className="space-y-6">
                                            {/* Try to map common fields from the JSON structure if known */}
                                            {/* Based on Latihan page structure */}
                                            <div className="grid gap-4">
                                                {/* Explanation Frames */}
                                                {data.content.explanationFrames && (
                                                    <div>
                                                        <span className="badge bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold mb-2 inline-block">EXPLANATION FRAMES</span>
                                                        <div className="grid gap-2">
                                                            {data.content.explanationFrames.map((frame: any, idx: number) => (
                                                                <div key={idx} className="bg-white p-3 rounded border border-gray-200">
                                                                    <div className="font-bold text-gray-900 mb-1">{frame.title}</div>
                                                                    <div className="text-gray-600">{frame.content}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Video */}
                                                {data.content.videoId && (
                                                    <div>
                                                        <span className="badge bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold mb-2 inline-block">VIDEO RESOURCE</span>
                                                        <div className="bg-white p-3 rounded border border-gray-200 break-all">
                                                            <a href={data.content.videoId} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2">
                                                                <PlayCircle size={14} /> {data.content.videoId}
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Images */}
                                                {data.content.imageTutorials && (
                                                    <div>
                                                        <span className="badge bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold mb-2 inline-block">IMAGE TUTORIALS</span>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {data.content.imageTutorials.map((img: any, idx: number) => (
                                                                <div key={idx} className="bg-white p-2 rounded border border-gray-200 text-center">
                                                                    <span className="block text-[10px] bg-gray-100 rounded px-1 mb-1 truncate">{img.title}</span>
                                                                    <div className="aspect-video bg-gray-100 rounded overflow-hidden relative">
                                                                        <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Fallback for other fields */}
                                            {!data.content.explanationFrames && !data.content.videoId && (
                                                <pre className="whitespace-pre-wrap">{JSON.stringify(data.content, null, 2)}</pre>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic">Tidak ada konten tersedia.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
