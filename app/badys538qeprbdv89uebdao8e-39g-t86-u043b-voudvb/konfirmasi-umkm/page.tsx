'use client';

import React, { useState, useEffect } from 'react';
import { getPendingUMKMList, updateUMKMStatus } from '@/app/actions';
import { Store, CheckCircle, XCircle, Loader2, Eye, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminConfirmUMKMPage() {
    const [loading, setLoading] = useState(true);
    const [umkmList, setUmkmList] = useState<any[]>([]);
    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const [rejectReason, setRejectReason] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        const data = await getPendingUMKMList();
        setUmkmList(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm('Setujui pendaftaran UMKM ini?')) return;
        setProcessingId(id);
        const res = await updateUMKMStatus(id, 'APPROVED');
        if (res.success) {
            setUmkmList(prev => prev.filter(item => item.id !== id));
        } else {
            alert('Gagal menyetujui: ' + res.error);
        }
        setProcessingId(null);
    };

    const handleReject = async () => {
        if (!rejectModal.id) return;
        setProcessingId(rejectModal.id);
        const res = await updateUMKMStatus(rejectModal.id, 'REJECTED', rejectReason);
        if (res.success) {
            setUmkmList(prev => prev.filter(item => item.id !== rejectModal.id));
            setRejectModal({ isOpen: false, id: null });
            setRejectReason('');
        } else {
            alert('Gagal menolak: ' + res.error);
        }
        setProcessingId(null);
    };

    const openRejectModal = (id: string) => {
        setRejectModal({ isOpen: true, id });
    };

    return (
        <div className="p-8 font-dm-sans">
             <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Konfirmasi UMKM</h1>
            </div>

            {/* Stat Card */}
            <div className="mb-8">
                <div className="bg-[#997B55] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden w-full md:w-1/3">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <Store size={20} />
                            <span className="text-sm font-medium">Menunggu Konfirmasi</span>
                        </div>
                        <h2 className="text-4xl font-bold">{umkmList.length}</h2>
                        <p className="text-xs mt-2 opacity-70">Permintaan pendaftaran baru</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Store size={120} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Store size={18} className="text-[#997B55]" />
                        Daftar Pengajuan
                    </h3>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : umkmList.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p>Tidak ada pengajuan UMKM baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="p-4">Nama UMKM</th>
                                    <th className="p-4">Pemilik</th>
                                    <th className="p-4">Kelas / Jurusan</th>
                                    <th className="p-4">No WA</th>
                                    <th className="p-4 text-center">Kartu Pelajar</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {umkmList.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-bold text-gray-800">{item.nama_umkm}</td>
                                        <td className="p-4 text-gray-600">{item.nama_lengkap}</td>
                                        <td className="p-4 text-gray-600">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                                                {item.kelas} {item.jurusan}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{item.no_wa}</td>
                                        <td className="p-4 text-center">
                                            {item.kartu_pelajar ? (
                                                <button 
                                                    onClick={() => setPreviewImage(item.kartu_pelajar)}
                                                    className="inline-flex items-center gap-1 text-[#997B55] hover:underline text-xs font-medium"
                                                >
                                                    <Eye size={14} /> Lihat
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(item.id)}
                                                    disabled={processingId === item.id}
                                                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                                                    title="Terima"
                                                >
                                                    {processingId === item.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => openRejectModal(item.id)}
                                                    disabled={processingId === item.id}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                                                    title="Tolak"
                                                >
                                                     <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reject Reason Modal */}
            <AnimatePresence>
                {rejectModal.isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Alasan Penolakan</h3>
                            <textarea
                                className="w-full border rounded-xl p-3 h-32 mb-4 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                placeholder="Tuliskan alasan penolakan..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={() => setRejectModal({ isOpen: false, id: null })} 
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={handleReject} 
                                    disabled={!rejectReason.trim() || !!processingId}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processingId ? <Loader2 size={16} className="animate-spin" /> : null}
                                    Tolak UMKM
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPreviewImage(null)}>
                        <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                            <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 text-white hover:text-gray-300 z-50">
                                <X size={32} />
                            </button>
                            <img src={previewImage} alt="Kartu Pelajar" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
