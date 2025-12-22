'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';
import {
    getMateriById
} from '@/app/actions';
import {
    ChevronLeft,
    Clock,
    PlayCircle,
    BookOpen,
    HelpCircle,
    CheckCircle2,
    AlertTriangle,
    Layers,
    Menu,
    ChevronDown,
    Anchor,
    Binary,
    Compass,
    Ruler,
    HeartPulse,
    Flame,
    Users
} from 'lucide-react';

export default function MateriDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session } = useSession();
    const [materi, setMateri] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeSubCatIndex, setActiveSubCatIndex] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {


                const data = await getMateriById(id);
                if (data) {
                    setMateri(data);
                } else {

                }
            } catch (error) {
                console.error("Error loading materi:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#FAFAFA]">
                <div className="text-[#8B6E4A] font-bold animate-pulse">Loading Materi...</div>
            </div>
        );
    }

    if (!materi) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-[#FAFAFA] gap-4">
                <div className="text-gray-500">Materi tidak ditemukan.</div>
                <Link href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan" className="px-4 py-2 bg-[#8B6E4A] text-white rounded-lg text-sm">Kembali</Link>
            </div>
        );
    }


    const contentData = materi.content || { subCategories: [] };
    const subCategories = contentData.subCategories || [];
    const activeSubCat = subCategories[activeSubCatIndex];

    return (
        <div className="font-dm-sans min-h-screen bg-[#FAFAFA] p-4 md:p-8 pb-20">

            <div className="max-w-6xl mx-auto mb-8">
                <Link href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#8B6E4A] mb-4 text-sm font-medium transition-colors">
                    <ChevronLeft size={16} />
                    Kembali ke Daftar Materi
                </Link>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{materi.nama}</h1>
                        <p className="text-gray-500 text-sm">
                            Kategori: <span className="text-[#8B6E4A] font-bold">{materi.topik.join(', ')}</span>
                        </p>
                    </div>


                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                            {session?.user?.image ? (
                                <Image src={session?.user?.image || ''} alt="Profile" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#8B6E4A] text-white text-xs font-bold">
                                    {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'AD'}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col hidden md:flex">
                            <span className="text-sm font-bold text-gray-800">{session?.user?.name || 'Admin'}</span>
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">


                <div className="order-2 lg:order-1 lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Kategori Latihan</h3>
                        <div className="flex flex-col gap-2">
                            {subCategories.length > 0 ? (
                                subCategories.map((sub: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveSubCatIndex(idx)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between
                                            ${activeSubCatIndex === idx
                                                ? 'bg-[#F9F5F0] text-[#8B6E4A] border border-[#8B6E4A]/20'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                            }
                                        `}
                                    >
                                        <span className="truncate">{sub.title}</span>
                                        {activeSubCatIndex === idx && <div className="w-1.5 h-1.5 rounded-full bg-[#8B6E4A]" />}
                                    </button>
                                ))
                            ) : (
                                <div className="text-xs text-gray-400 italic px-2">Tidak ada sub-kategori.</div>
                            )}
                        </div>
                    </div>
                </div>


                <div className="order-1 lg:order-2 lg:col-span-3">
                    {activeSubCat ? (
                        <div className="flex flex-col gap-8">


                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">

                                    <Layers className="text-[#8B6E4A]" />
                                    {activeSubCat.title}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Pilih materi spesifik di bawah ini.</p>


                            </div>


                            {subCategories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {subCategories.map((sub: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveSubCatIndex(idx)}
                                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border
                                                ${activeSubCatIndex === idx
                                                    ? 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            {sub.title}
                                        </button>
                                    ))}
                                </div>
                            )}


                            {activeSubCat.explanationFrames && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                                        <BookOpen size={16} className="text-[#8B6E4A]" />
                                        Penjelasan Materi
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {activeSubCat.explanationFrames.map((frame: any, idx: number) => (
                                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-8 h-1 bg-[#D4C3A3] mb-4 rounded-full" />
                                                <h4 className="font-bold text-gray-800 mb-2 text-sm">{frame.title}</h4>
                                                <p className="text-xs text-gray-500 leading-relaxed text-justify">
                                                    {frame.content}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {activeSubCat.videoId && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                                        <PlayCircle size={16} className="text-[#8B6E4A]" />
                                        Video Tutorial
                                    </h3>
                                    <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-black aspect-video relative group">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${activeSubCat.videoId}`}
                                            title="Video Tutorial"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="absolute inset-0"
                                        />
                                    </div>
                                </div>
                            )}



                            {activeSubCat.quiz && activeSubCat.quiz.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
                                        <HelpCircle size={16} className="text-[#8B6E4A]" />
                                        Latihan Soal (Preview)
                                    </h3>
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#8B6E4A] uppercase tracking-wider">
                                            <Clock size={12} /> Quiz Mode
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-800 mb-6">{activeSubCat.quiz[0].question}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {activeSubCat.quiz[0].options.map((opt: string, idx: number) => (
                                                <div key={idx} className={`p-4 rounded-xl border text-sm font-medium flex items-center justify-between
                                                    ${idx === activeSubCat.quiz[0].correct
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-white text-gray-500 border-gray-100'
                                                    }
                                                `}>
                                                    <span>{opt}</span>
                                                    {idx === activeSubCat.quiz[0].correct && <CheckCircle2 size={16} />}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-center text-xs text-gray-400 mt-4">
                                            *Hanya menampilkan soal pertama sebagai preview.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                            <Layers size={48} className="mb-4 opacity-20" />
                            <p>Data konten belum lengkap untuk materi ini.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
