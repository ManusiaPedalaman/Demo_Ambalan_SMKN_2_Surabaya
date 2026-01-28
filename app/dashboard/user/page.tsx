'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, ShoppingBag, MessageSquare, Flame, Clock, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useUserDashboard } from './UserContext';

export default function UserDashboardPage() {
    const { data: session } = useSession();
    const { profile, history, loading } = useUserDashboard();
    const [stats, setStats] = useState({
        rentals: 0,
        quizzes: 0,
        messages: 0,
        activeRentals: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (loading) return;

        const name = profile?.nama_lengkap || session?.user?.name || 'User';
        setUserName(name);

        // Calculate Stats
        const activeRentals = history.rentals.filter((r: any) => r.status_kembali === 'Belum').length;
        const totalRentals = history.rentals.length;
        const totalQuizzes = history.quizzes.length;
        const totalMessages = history.contacts.length;

        setStats({
            rentals: totalRentals,
            quizzes: totalQuizzes,
            messages: totalMessages,
            activeRentals: activeRentals
        });

        // Combine and Sort Recent Activity
        const allActivity = [
            ...history.rentals.map((r: any) => ({ ...r, type: 'rental', date: new Date(r.tgl_pengambilan || r.createdAt) })),
            ...history.quizzes.map((q: any) => ({ ...q, type: 'quiz', date: new Date(q.tanggal) })),
            ...history.contacts.map((c: any) => ({ ...c, type: 'contact', date: new Date(c.created_at || new Date()) })),
            ...history.joins.map((j: any) => ({ ...j, type: 'join', date: new Date(j.created_at || new Date()) }))
        ].sort((a: any, b: any) => (b.date - a.date)); 

        setRecentActivity(allActivity.slice(0, 5));
    }, [profile, history, loading, session]);

    const statCards = [
        {
            title: 'Barang Dipinjam',
            value: stats.activeRentals,
            label: 'Sedang Dipinjam',
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-600',
            link: '/dashboard/user/history?tab=sewa'
        },
        {
            title: 'Kuis Dikerjakan',
            value: stats.quizzes,
            label: 'Total Kuis',
            icon: Flame,
            color: 'bg-orange-50 text-orange-600',
            link: '/dashboard/user/history?tab=kuis'
        },
        {
            title: 'Pesan Terkirim',
            value: stats.messages,
            label: 'Total Pesan',
            icon: MessageSquare,
            color: 'bg-green-50 text-green-600',
            link: '/dashboard/user/history?tab=hubungi'
        }
    ];

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Memuat data dashboard...</div>;
    }

    return (
        <div className="p-8 font-dm-sans">
            {/* Header / Welcome Banner */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-1">Selamat datang kembali, <span className="font-semibold text-[#997B55]">{userName}</span>!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {statCards.map((card, idx) => (
                    <Link href={card.link} key={idx} className="block group">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                                    <card.icon size={24} />
                                </div>
                                <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-lg">Update Terbaru</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-gray-800 mb-1">{card.value}</h3>
                                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-800">Aktivitas Terbaru</h2>
                    <Link href="/dashboard/user/history" className="text-sm text-[#997B55] hover:underline font-medium">
                        Lihat Semua
                    </Link>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-800 font-semibold">
                            <tr>
                                <th className="p-4">Aktivitas</th>
                                <th className="p-4">Detail</th>
                                <th className="p-4">Status / Skor</th>
                                <th className="p-4">ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentActivity.length > 0 ? recentActivity.map((item, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50/50">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        {item.type === 'rental' && <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><ShoppingBag size={18} /></div>}
                                        {item.type === 'quiz' && <div className="p-2 rounded-lg bg-orange-50 text-orange-600"><Flame size={18} /></div>}
                                        {item.type === 'contact' && <div className="p-2 rounded-lg bg-green-50 text-green-600"><MessageSquare size={18} /></div>}
                                        {item.type === 'join' && <div className="p-2 rounded-lg bg-purple-50 text-purple-600"><UserPlus size={18} /></div>}
                                        
                                        <span>
                                            {item.type === 'rental' && 'Penyewaan Barang'}
                                            {item.type === 'quiz' && 'Mengerjakan Kuis'}
                                            {item.type === 'contact' && 'Mengirim Pesan'}
                                            {item.type === 'join' && 'Permintaan Join'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {item.type === 'rental' && (item.nama_produk || item.produk?.nama_produk || 'Produk')}
                                        {item.type === 'quiz' && (item.materi?.nama_materi || 'Materi Kuis')}
                                        {item.type === 'contact' && (item.pesan ? `"${item.pesan.substring(0, 20)}..."` : 'Pesan')}
                                        {item.type === 'join' && (item.pesan ? `"${item.pesan.substring(0, 20)}..."` : 'Keanggotaan')}
                                    </td>
                                    <td className="p-4">
                                        {item.type === 'rental' && (
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status_kembali === 'Sudah' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {item.status_kembali === 'Sudah' ? 'Dikembalikan' : 'Dipinjam'}
                                            </span>
                                        )}
                                        {item.type === 'quiz' && <span className="font-bold text-[#997B55]">{item.skor} Poin</span>}
                                        {item.type === 'contact' && <span className="text-gray-400 text-xs">{item.status || 'Terkirim'}</span>}
                                        {item.type === 'join' && <span className="text-gray-400 text-xs text-purple-600 font-medium">Terkirim</span>}
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">#{item.id}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-400">Belum ada aktivitas tercatat.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
