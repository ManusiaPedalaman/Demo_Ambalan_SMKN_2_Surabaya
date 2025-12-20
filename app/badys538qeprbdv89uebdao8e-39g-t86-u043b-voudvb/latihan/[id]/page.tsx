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

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Determine if ID is dynamic or needs specific lookup
                // For now, assume params.id is the ID we want
                const data = await getMateriById(id);
                if (data) {
                    setMateri(data);
                } else {
                    // console.error("Materi not found");
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

    // Default content structure if JSON is missing/different
    const contentData = materi.content || { subCategories: [] };
    const subCategories = contentData.subCategories || [];
    const activeSubCat = subCategories[activeSubCatIndex];

    return (
        <div className="font-dm-sans min-h-screen bg-[#FAFAFA] p-4 md:p-8 pb-20">
            {/* Header / Nav */}
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

                    {/* Simple User Profile Badge */}
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

            {/* Main Content Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Left Sidebar: SubCategories Navigation */}
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

                {/* Right Content Area */}
                <div className="order-1 lg:order-2 lg:col-span-3">
                    {activeSubCat ? (
                        <div className="flex flex-col gap-8">

                            {/* Title Section */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    {/* Icon Placeholder based on parent logic if needed, or generic */}
                                    <Layers className="text-[#8B6E4A]" />
                                    {activeSubCat.title}
                                </h2>
                                <p className="text-gray-400 text-sm mt-1">Pilih materi spesifik di bawah ini.</p>

                                {/* If there are inner tabs/pills like the design image 'Simpul Mati', 'Simpul Jangkar' inside the specific subcat? 
                                    Actually the design image shows 'Tali Temali' as main header, 'Simpul Mati' | 'Simpul Jangkar' as pills buttons.
                                    And Side menu has 'Tali Temali', 'Sandi & Morse' etc.
                                    
                                    So: 
                                    - Left Side Menu = Materi List (Topik/Materi Utama)
                                    - Top Content Pills = SubCategories (Simpul Mati, Jangkar)
                                    
                                    But here we are viewing ONE Materi (e.g. Tali Temali).
                                    So the Left menu should probably list the SubCategories of THIS Materi? 
                                    OR, the Left menu lists ALL Materis (Navigation)?
                                    
                                    The User Request Image 2 shows:
                                    Left Sidebar: "Kategori Latihan" -> Tali Temali (Active), Sandi & Morse, Navigasi...
                                    Right Content: "Tali Temali" (Title) -> "Simpul Mati" (Active Pill), "Simpul Jangkar" (Pill).
                                    
                                    Wait, my current architecture passes `id` of the Materi.
                                    If I am viewing 'Tali Temali', `id` is 'tali-temali'.
                                    The Content JSON has `subCategories`.
                                    
                                    So:
                                    1. Left Sidebar in design actually navigates between DIFFERENT Materi IDs?
                                       If so, I need to fetch ALL Materi IDs to populate the sidebar.
                                       This is fetching "List of Materi".
                                    
                                    2. The Pills in the content area navigate 'subCategories' of the CURRENT Materi.
                                    
                                    Let's adjust to match likely user intent from the image:
                                    - Left Sidebar: List of available Materi (requires fetching list).
                                    - Main Area Header: Current Materi Title.
                                    - Main Area Tabs (Pills): SubCategories (Simpul Mati, Simpul Jangkar).
                                    - Main Area Content: Explanations, Video, Quiz.
                                    
                                    However, simplified version first: 
                                    - Just display the functionality for THIS Materi.
                                    - The layout I built above has SubCats on the Left. 
                                    - Let's move SubCats to Pills on Top (like design) and make Left Sidebar static or hidden for now?
                                    - No, let's Stick to the prompt: "tampilan baru yang mana menampilkan contoh nya seperti pada gambar".
                                    
                                    Image analysis:
                                    sidebar: Kategori Latihan (Tali Temali, Sandi, etc). This seems to be the global navigation.
                                    content: Tali Temali -> Pills -> Content.
                                    
                                    If I want to perfectly replicate the sidebar, I need to fetch all materi list.
                                    `getMateriList` takes no args and returns list. I can use that.
                                    
                                    Refining the component:
                                    - Fetch both single materi AND list of materi.
                                */
                                }
                            </div>

                            {/* SubCategory Pills (Pilihan Materi Spesifik) */}
                            {/* Only show if multiple subcats exist */}
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

                            {/* Explanation Frames */}
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

                            {/* Video Tutorial */}
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

                            {/* Quiz Preview */}
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
