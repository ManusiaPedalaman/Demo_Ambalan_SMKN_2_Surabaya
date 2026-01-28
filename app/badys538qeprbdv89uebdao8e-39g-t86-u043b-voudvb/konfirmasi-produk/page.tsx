'use client';

import React, { useState, useEffect } from 'react';
import { getPendingProductList, updateUMKMProductStatus } from '@/app/actions';
import { Package, CheckCircle, XCircle, Loader2, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationPopup from '@/app/components/ConfirmationPopup';

export default function AdminConfirmProductPage() {
    const [loading, setLoading] = useState(true);
    const [productList, setProductList] = useState<any[]>([]);
    const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
    const [rejectReason, setRejectReason] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    // Approval Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });

    const loadData = async () => {
        setLoading(true);
        const data = await getPendingProductList();
        setProductList(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleApproveClick = (id: string) => {
        setConfirmModal({ isOpen: true, id });
    };

    const executeApprove = async () => {
        if (!confirmModal.id) return;
        
        const id = confirmModal.id;
        setProcessingId(id);
        
        // Close modal immediately or keep open with loading? 
        // Better to keep open with loading state if ConfirmationPopup supports it, 
        // but here we might want to just show global processing or rely on the button spinner inside modal.
        // My ConfirmationPopup has isLoading prop. Let's use it.
        // Note: I need to manage loading state specifically for the modal action if I want the spinner THERE.
        // But processingId is mostly used for the table button.
        // Let's rely on processingId to indicate loading, but I need to pass it to the popup.
        
        const res = await updateUMKMProductStatus(id, 'APPROVED');
        
        if (res.success) {
            setProductList(prev => prev.filter(item => item.id !== id));
            setConfirmModal({ isOpen: false, id: null });
        } else {
            alert('Gagal menyetujui: ' + res.error);
            setConfirmModal({ isOpen: false, id: null });
        }
        setProcessingId(null);
    };

    const handleReject = async () => {
        if (!rejectModal.id) return;
        setProcessingId(rejectModal.id);
        const res = await updateUMKMProductStatus(rejectModal.id, 'REJECTED', rejectReason);
        if (res.success) {
            setProductList(prev => prev.filter(item => item.id !== rejectModal.id));
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
                <h1 className="text-2xl font-bold text-gray-800">Konfirmasi Produk UMKM</h1>
            </div>

            {/* Stat Card */}
            <div className="mb-8">
                <div className="bg-[#997B55] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden w-full md:w-1/3">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 opacity-80">
                            <Package size={20} />
                            <span className="text-sm font-medium">Menunggu Konfirmasi</span>
                        </div>
                        <h2 className="text-4xl font-bold">{productList.length}</h2>
                        <p className="text-xs mt-2 opacity-70">Produk baru dari UMKM</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10">
                        <Package size={120} />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Package size={18} className="text-[#997B55]" />
                        Daftar Pengajuan Produk
                    </h3>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center text-gray-400">
                        <Loader2 className="animate-spin" />
                    </div>
                ) : productList.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p>Tidak ada pengajuan produk baru.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                                <tr>
                                    <th className="p-4">Nama Produk</th>
                                    <th className="p-4">Harga</th>
                                    <th className="p-4">Asal UMKM</th>
                                    <th className="p-4 text-center">Foto Produk</th>
                                    <th className="p-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {productList.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-800">{item.nama_produk}</div>
                                            <div className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">{item.deskripsi}</div>
                                        </td>
                                        <td className="p-4 font-bold text-[#997B55]">Rp {item.harga}</td>
                                        <td className="p-4 text-gray-600">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                                                {item.nama_umkm}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {item.gambar ? (
                                                <button 
                                                    onClick={() => setPreviewImage(item.gambar)}
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
                                                    onClick={() => handleApproveClick(item.id)}
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
                                    Tolak Produk
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
                            <img src={previewImage} alt="Foto Produk" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Approve Confirmation Popup */}
            <ConfirmationPopup 
                isOpen={confirmModal.isOpen}
                title="Setujui Produk?"
                message="Produk akan ditampilkan di katalog UMKM utama. Pastikan data produk sudah sesuai."
                confirmText="Setujui"
                confirmColor="bg-green-600"
                icon="check"
                onConfirm={executeApprove}
                onCancel={() => setConfirmModal({ isOpen: false, id: null })}
                isLoading={!!processingId && processingId === confirmModal.id}
            />
        </div>
    );
}
