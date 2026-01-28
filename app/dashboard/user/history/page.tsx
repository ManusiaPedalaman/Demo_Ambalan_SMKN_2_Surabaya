'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
    updateHistoryItem,
    deleteBooking,
    deleteContactMessage,
    deleteJoinMember,
    deleteQuizResult
} from '@/app/actions';
import { Loader2, Edit, Save, X, Eye, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserDashboard } from '../UserContext';

// Simple Tabs Component
const Tabs = ({ children, activeTab, onTabChange }: any) => {
    return <div>{React.Children.map(children, child => 
        React.isValidElement(child) 
            ? React.cloneElement(child, { activeTab, onTabChange } as any) 
            : child
    )}</div>;
};

const TabList = ({ children, activeTab, onTabChange }: any) => (
    <div className="flex gap-4 border-b border-gray-100 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        {React.Children.map(children, child =>
            React.isValidElement(child)
                ? React.cloneElement(child, { activeTab, onTabChange } as any)
                : child
        )}
    </div>
);
const TabTrigger = ({ value, activeTab, onTabChange, children }: any) => (
    <button
        onClick={() => onTabChange(value)}
        className={`pb-3 px-2 font-medium transition-colors relative flex-shrink-0 ${activeTab === value ? 'text-[#997B55]' : 'text-gray-400 hover:text-gray-600'}`}
    >
        {children}
        {activeTab === value && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#997B55]" />}
    </button>
);
const TabContent = ({ value, activeTab, children }: any) => {
    if (value !== activeTab) return null;
    return <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{children}</motion.div>;
};

export default function UserHistoryPage() {
    const { history: historyData, loading, refreshData } = useUserDashboard();
    const [activeTab, setActiveTab] = useState('sewa');
    // const [loading, setLoading] = useState(true); // Handled by context
    // const [historyData, setHistoryData] = useState<any>({ rentals: [], contacts: [], joins: [], quizzes: [] }); // Handled by context
    const [editItem, setEditItem] = useState<any>(null); // Item being edited
    const [editType, setEditType] = useState<string>('');
    const [showDetailModal, setShowDetailModal] = useState<any>(null); // For Quiz detail
    
    // Delete State
    const [deleteItem, setDeleteItem] = useState<{ id: string, type: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Initial load handled by Context Provider

    const handleEdit = (type: string, item: any) => {
        setEditType(type);
        setEditItem({ ...item }); // Clone item
    };

    const handleSaveEdit = async () => {
        if (!editItem) return;
        
        let updateData: any = {};
        if (editType === 'sewa') {
             updateData = { 
                 nama_peminjam: editItem.nama_peminjam,
                 jumlah_produk: editItem.jumlah_produk,
                 tgl_pengambilan: new Date(editItem.tgl_pengambilan),
                 tgl_pengembalian: new Date(editItem.tgl_pengembalian)
             };
        } else if (editType === 'hubungi') {
             updateData = { pesan: editItem.pesan, no_wa: editItem.no_wa };
        } else if (editType === 'join') {
             updateData = { pesan: editItem.pesan, asal_sekolah: editItem.asal_sekolah, kelas: editItem.kelas };
        }

        const res = await updateHistoryItem(editType as any, editItem.id, updateData);
        if (res.success) {
            alert('Data berhasil diperbarui!');
            setEditItem(null);
            refreshData(); // Reload data via context
        } else {
            alert('Gagal update: ' + res.error);
        }
    };

    const confirmDelete = (type: string, id: string) => {
        setDeleteItem({ id, type });
    };

    const executeDelete = async () => {
        if (!deleteItem) return;
        setIsDeleting(true);

        try {
            let res: any = { success: false };
            
            switch (deleteItem.type) {
                case 'sewa': res = await deleteBooking(deleteItem.id); break;
                case 'hubungi': res = await deleteContactMessage(deleteItem.id); break;
                case 'join': res = await deleteJoinMember(deleteItem.id); break;
                case 'kuis': res = await deleteQuizResult(deleteItem.id); break;
            }

            if (res.success) {
                // Remove from local state immediately? No, rely on refresh for consistency or do optimistic update?
                // For simplicity and correctness with context, just refresh. But to make it snappy, we could optimistic update context? 
                // Context doesn't expose setHistory. So just await refresh.
                
                await refreshData();
                setDeleteItem(null);
            } else {
                alert('Gagal menghapus data: ' + res.error);
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat menghapus data.');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (d: string) => {
        if (!d) return '-';
        return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-[#997B55]" /></div>;

    return (
        <div className="p-8 font-dm-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Aktivitas</h1>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 min-h-[500px]">
                <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
                    <TabList>
                        <TabTrigger value="sewa">Penyewaan</TabTrigger>
                        <TabTrigger value="hubungi">Pesan Kontak</TabTrigger>
                        <TabTrigger value="join">Permintaan Join</TabTrigger>
                        <TabTrigger value="kuis">Uji Pemahaman</TabTrigger>
                    </TabList>

                    <TabContent value="sewa">
                        {historyData.rentals.length === 0 ? <p className="text-gray-400 text-center py-10">Belum ada data history.</p> : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-800 font-semibold">
                                        <tr>
                                            <th className="p-3">Barang</th>
                                            <th className="p-3">Tgl Ambil</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.rentals.map((item: any) => (
                                            <tr key={item.id} className="border-b hover:bg-gray-50/50">
                                                <td className="p-3 font-medium">{item.nama_produk || item.produk?.nama_produk}</td>
                                                <td className="p-3">{formatDate(item.tgl_pengambilan)}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs 
                                                        ${item.status_kembali === 'Sudah' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {item.status_kembali || 'Belum'}
                                                    </span>
                                                </td>
                                                <td className="p-3 flex justify-center gap-2">
                                                    <button onClick={() => handleEdit('sewa', item)} className="p-1.5 hover:bg-[#997B55]/10 text-[#997B55] rounded-lg transition-colors" title="Edit">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => confirmDelete('sewa', item.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Hapus">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </TabContent>

                    <TabContent value="hubungi">
                        {historyData.contacts.length === 0 ? <p className="text-gray-400 text-center py-10">Belum ada data history.</p> : (
                             <div className="space-y-4">
                                {historyData.contacts.map((item: any) => (
                                    <div key={item.id} className="p-4 border rounded-xl flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.email}</p>
                                            <p className="text-gray-600 line-clamp-2">{item.pesan}</p>
                                            <span className="text-xs text-gray-400 mt-2 block">Status: {item.status}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit('hubungi', item)} className="text-[#997B55] hover:underline text-sm flex items-center gap-1">
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button onClick={() => confirmDelete('hubungi', item.id)} className="text-red-500 hover:underline text-sm flex items-center gap-1">
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        )}
                    </TabContent>
                    
                    <TabContent value="join">
                         {historyData.joins.length === 0 ? <p className="text-gray-400 text-center py-10">Belum ada data history.</p> : (
                             <div className="space-y-4">
                                {historyData.joins.map((item: any) => (
                                    <div key={item.id} className="p-4 border rounded-xl flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">{item.nama_lengkap}</p>
                                            <p className="text-sm text-gray-500">{item.asal_sekolah} - {item.jurusan}</p>
                                            <p className="text-gray-600 mt-2 text-sm">"{item.pesan}"</p>
                                            <span className="text-xs text-gray-400 mt-2 block">Dibuat: {formatDate(item.created_at)}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit('join', item)} className="text-[#997B55] hover:underline text-sm flex items-center gap-1">
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button onClick={() => confirmDelete('join', item.id)} className="text-red-500 hover:underline text-sm flex items-center gap-1">
                                                <Trash2 size={14} /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        )}
                    </TabContent>

                    <TabContent value="kuis">
                         {historyData.quizzes.length === 0 ? <p className="text-gray-400 text-center py-10">Belum ada data history.</p> : (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {historyData.quizzes.map((item: any) => (
                                    <div key={item.id} className="p-4 border rounded-xl hover:shadow-md transition-shadow relative group">
                                         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); confirmDelete('kuis', item.id); }}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-gray-800">{item.materi?.nama_materi || 'Materi'}</h3>
                                            <span className="text-lg font-bold text-[#997B55] pr-8">{item.skor} Poin</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4">Tanggal: {formatDate(item.tanggal)}</p>
                                        <button 
                                            onClick={() => setShowDetailModal(item)}
                                            className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            <Eye size={16} /> Lihat Detail
                                        </button>
                                    </div>
                                ))}
                             </div>
                        )}
                    </TabContent>
                </Tabs>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Edit Data {editType.toUpperCase()}</h3>
                                <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {editType === 'sewa' && (
                                    <>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700">Nama Peminjam</label>
                                            <input type="text" value={editItem.nama_peminjam || ''} onChange={(e) => setEditItem({...editItem, nama_peminjam: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900 bg-white" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700">Jumlah Produk</label>
                                            <input type="text" value={editItem.jumlah_produk || ''} onChange={(e) => setEditItem({...editItem, jumlah_produk: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900 bg-white" />
                                        </div>
                                    </>
                                )}
                                {(editType === 'hubungi' || editType === 'join') && (
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">Pesan</label>
                                        <textarea value={editItem.pesan || ''} onChange={(e) => setEditItem({...editItem, pesan: e.target.value})} className="w-full border rounded-lg p-2 h-24 text-gray-900 bg-white" />
                                    </div>
                                )}
                                {editType === 'join' && (
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700">Asal Sekolah</label>
                                        <input type="text" value={editItem.asal_sekolah || ''} onChange={(e) => setEditItem({...editItem, asal_sekolah: e.target.value})} className="w-full border rounded-lg p-2 text-gray-900 bg-white" />
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setEditItem(null)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Batal</button>
                                <button onClick={handleSaveEdit} className="px-4 py-2 text-white bg-[#997B55] rounded-lg hover:bg-[#8B6E4A] flex items-center gap-2">
                                    <Save size={18} /> Simpan
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteItem && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => !isDeleting && setDeleteItem(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.9, opacity: 0 }} 
                            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Hapus</h3>
                            <p className="text-gray-500 mb-6">
                                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setDeleteItem(null)} 
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={executeDelete} 
                                    disabled={isDeleting}
                                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="animate-spin" size={18} /> : 'Hapus'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detail Quiz Modal */}
            <AnimatePresence>
                {showDetailModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Detail Hasil Kuis</h3>
                                    <p className="text-sm text-gray-500">{showDetailModal.materi?.nama_materi}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-[#997B55]">{showDetailModal.skor}</p>
                                    <p className="text-xs text-gray-400">Total Skor</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                {showDetailModal.jawaban_user && Array.isArray(showDetailModal.jawaban_user) ? showDetailModal.jawaban_user.map((ans: any, idx: number) => (
                                    <div key={idx} className={`p-4 rounded-xl border-l-4 ${ans.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                        <p className="font-semibold text-gray-800 mb-2">{idx + 1}. {ans.question}</p>
                                        <div className="text-sm">
                                            <p className="mb-1"><span className="font-medium">Jawaban Anda:</span> <span className={ans.isCorrect ? 'text-green-600' : 'text-red-600'}>{ans.selected}</span></p>
                                            {!ans.isCorrect && <p><span className="font-medium text-gray-600">Jawaban Benar:</span> <span className="text-green-600">{ans.correct}</span></p>}
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center">Detail jawaban tidak tersedia.</p>
                                )}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button onClick={() => setShowDetailModal(null)} className="px-6 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-black transition-colors">
                                    Tutup
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
