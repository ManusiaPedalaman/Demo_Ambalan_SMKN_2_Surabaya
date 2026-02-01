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

    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    const confirmDelete = (type: string, id: string) => {
        setDeleteItem({ id, type });
        setDeleteConfirmationText('');
    };

    const executeDelete = async () => {
        if (!deleteItem) return;
        if (deleteConfirmationText !== 'Hapus') return;

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
    
    const formatDate = (date: string) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const handleSaveEdit = async () => {
        if (!editItem) return;
        
        let updateData: any = {};
        if (editType === 'sewa') {
             updateData = { 
                 nama_peminjam: editItem.nama_peminjam,
                 sekolah_instansi: editItem.sekolah_instansi,
                 nama_produk: editItem.nama_produk,
                 no_wa: editItem.no_wa,
                 metode_bayar: editItem.metode_bayar,
                 jam_sewa: editItem.jam_sewa,
                 jam_kembali: editItem.jam_kembali,
                 jumlah_produk: editItem.jumlah_produk,
                 tgl_pengambilan: new Date(editItem.tgl_pengambilan),
                 tgl_pengembalian: new Date(editItem.tgl_pengembalian)
             };
        } else if (editType === 'hubungi') {
             updateData = { 
                 nama_lengkap: editItem.nama_lengkap,
                 email: editItem.email,
                 no_wa: editItem.no_wa,
                 pesan: editItem.pesan
             };
        } else if (editType === 'join') {
             updateData = { 
                 nama_lengkap: editItem.nama_lengkap,
                 tanggal_lahir: editItem.tanggal_lahir ? new Date(editItem.tanggal_lahir) : null,
                 no_wa: editItem.no_wa,
                 asal_sekolah: editItem.asal_sekolah,
                 kelas: editItem.kelas,
                 jurusan: editItem.jurusan,
                 pesan: editItem.pesan
             };
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

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Riwayat & Aktivitas</h1>
            
             <Tabs activeTab={activeTab} onTabChange={setActiveTab}>
                <TabList>
                    <TabTrigger value="sewa">Penyewaan</TabTrigger>
                    <TabTrigger value="hubungi">Pesan Kontak</TabTrigger>
                    <TabTrigger value="join">Permintaan Join</TabTrigger>
                    <TabTrigger value="kuis">Hasil Kuis</TabTrigger>
                </TabList>
                
                {/* 
                   WARNING: The original list content seems to have been lost/truncated. 
                   I am retaining the structure but you may need to restore the actual table/list UI.
                */}
                <TabContent value="sewa">
                    {historyData.rentals.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Belum ada riwayat penyewaan.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {historyData.rentals.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Desktop View */}
                                    <div className="hidden md:flex items-center justify-between p-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-gray-800">{item.produk?.nama_produk || item.nama_produk || 'Produk'}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                                    ${item.status_kembali === 'Sudah' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                                `}>
                                                    {item.status_kembali === 'Sudah' ? 'Selesai' : 'Sedang Disewa'}
                                                </span>
                                            </div>
                                            <div className="flex gap-6 text-sm text-gray-500">
                                                <p>Ambil: <span className="text-gray-800 font-medium">{formatDate(item.tgl_pengambilan)}</span></p>
                                                <p>Kembali: <span className="text-gray-800 font-medium">{formatDate(item.tgl_pengembalian)}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pl-4 border-l border-gray-100">
                                            <button 
                                                onClick={() => { setEditItem({...item, type: 'sewa'}); setEditType('sewa'); }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete('sewa', item.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Mobile View */}
                                    <div className="md:hidden p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-sm mb-1">{item.produk?.nama_produk || item.nama_produk || 'Produk'}</h3>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                                    ${item.status_kembali === 'Sudah' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                                `}>
                                                    {item.status_kembali === 'Sudah' ? 'Selesai' : 'Disewa'}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditItem({...item, type: 'sewa'}); setEditType('sewa'); }} className="p-1.5 text-blue-600 bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                                <button onClick={() => confirmDelete('sewa', item.id)} className="p-1.5 text-red-600 bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                                            <div>
                                                <p className="mb-0.5">Ambil</p>
                                                <p className="font-medium text-gray-800">{formatDate(item.tgl_pengambilan)}</p>
                                            </div>
                                            <div>
                                                <p className="mb-0.5">Kembali</p>
                                                <p className="font-medium text-gray-800">{formatDate(item.tgl_pengembalian)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabContent>

                <TabContent value="hubungi">
                    {historyData.contacts.length === 0 ? (
                         <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Belum ada riwayat pesan.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {historyData.contacts.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-gray-800 text-sm truncate">{item.pesan}</h3>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2">{item.email} • {item.no_wa}</p>
                                            <p className="text-[10px] text-gray-400 mt-2">{item.created_at ? formatDate(item.created_at) : 'Baru saja'}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button onClick={() => { setEditItem({...item, type: 'hubungi'}); setEditType('hubungi'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                            <button onClick={() => confirmDelete('hubungi', item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabContent>

                <TabContent value="join">
                    {historyData.joins.length === 0 ? (
                         <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Belum ada riwayat join.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {historyData.joins.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                                     <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 text-sm mb-1">Permintaan Join Ambalan</h3>
                                            <div className="text-xs text-gray-600 space-y-1 mb-2">
                                                <p>Sekolah: <span className="font-medium">{item.asal_sekolah}</span></p>
                                                <p>Jurusan: <span className="font-medium">{item.kelas} {item.jurusan}</span></p>
                                            </div>
                                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 italic">
                                                "{item.pesan}"
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 pt-1">
                                             <button onClick={() => { setEditItem({...item, type: 'join'}); setEditType('join'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                             <button onClick={() => confirmDelete('join', item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabContent>

                <TabContent value="kuis">
                     {historyData.quizzes.length === 0 ? (
                         <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Belum ada riwayat kuis.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {historyData.quizzes.map((item: any) => (
                                <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 mb-1">{item.materi?.nama_materi || 'Materi Kuis'}</h3>
                                            <p className="text-xs text-gray-400">{formatDate(item.tanggal)}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-[#997B55]">{item.skor}</p>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Skor</p>
                                            </div>
                                            <div className="flex flex-col gap-1 pl-4 border-l border-gray-100">
                                                <button 
                                                    onClick={() => setShowDetailModal(item)}
                                                    className="p-2 text-gray-500 hover:text-[#997B55] hover:bg-gray-50 rounded-lg transition-colors"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => confirmDelete('kuis', item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabContent>
            </Tabs>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteItem && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
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
                            <p className="text-gray-500 mb-4 text-sm">
                                Ketik <strong>"Hapus"</strong> di bawah untuk mengonfirmasi penghapusan. Tindakan ini tidak dapat dibatalkan.
                            </p>
                            
                            <input 
                                value={deleteConfirmationText}
                                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                                className="w-full border rounded-xl px-4 py-3 text-center mb-6 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                placeholder='Ketik "Hapus"'
                                autoFocus
                            />

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
                                    disabled={isDeleting || deleteConfirmationText !== 'Hapus'}
                                    className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors
                                        ${deleteConfirmationText === 'Hapus' && !isDeleting ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                    `}
                                >
                                    {isDeleting ? <Loader2 className="animate-spin" size={18} /> : 'Hapus'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
    
            {/* Edit Modal */}
            <AnimatePresence>
                {editItem && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-800">Edit Data {editType === 'sewa' ? 'Penyewaan' : editType === 'hubungi' ? 'Pesan Kontak' : 'Permintaan Join'}</h3>
                                <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                {editType === 'sewa' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Peminjam</label>
                                                <input type="text" value={editItem.nama_peminjam || ''} onChange={(e) => setEditItem({...editItem, nama_peminjam: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:ring-[#997B55] transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Sekolah / Instansi</label>
                                                <input type="text" value={editItem.sekolah_instansi || ''} onChange={(e) => setEditItem({...editItem, sekolah_instansi: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:ring-[#997B55] transition-all" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Produk</label>
                                                <input type="text" value={editItem.nama_produk || ''} onChange={(e) => setEditItem({...editItem, nama_produk: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:ring-[#997B55] transition-all" />
                                            </div>
                                            <div>
                                                 <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jumlah</label>
                                                 <input type="text" value={editItem.jumlah_produk || ''} onChange={(e) => setEditItem({...editItem, jumlah_produk: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:ring-[#997B55] transition-all" />
                                            </div>
                                        </div>
                                         <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">No WhatsApp</label>
                                                <input type="text" value={editItem.no_wa || ''} onChange={(e) => setEditItem({...editItem, no_wa: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:ring-[#997B55] transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Metode Bayar</label>
                                                <input type="text" value={editItem.metode_bayar || ''} onChange={(e) => setEditItem({...editItem, metode_bayar: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50 focus:bg-white focus:ring-[#997B55] transition-all" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tgl Ambil</label>
                                                <input type="date" value={editItem.tgl_pengambilan ? new Date(editItem.tgl_pengambilan).toISOString().split('T')[0] : ''} onChange={(e) => setEditItem({...editItem, tgl_pengambilan: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jam Ambil</label>
                                                <input type="time" value={editItem.jam_sewa || ''} onChange={(e) => setEditItem({...editItem, jam_sewa: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                        </div>
                                         <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tgl Kembali</label>
                                                <input type="date" value={editItem.tgl_pengembalian ? new Date(editItem.tgl_pengembalian).toISOString().split('T')[0] : ''} onChange={(e) => setEditItem({...editItem, tgl_pengembalian: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jam Kembali</label>
                                                <input type="time" value={editItem.jam_kembali || ''} onChange={(e) => setEditItem({...editItem, jam_kembali: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                {editType === 'hubungi' && (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Lengkap</label>
                                            <input type="text" value={editItem.nama_lengkap || ''} onChange={(e) => setEditItem({...editItem, nama_lengkap: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email</label>
                                                <input type="email" value={editItem.email || ''} onChange={(e) => setEditItem({...editItem, email: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                             <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">No WhatsApp</label>
                                                <input type="text" value={editItem.no_wa || ''} onChange={(e) => setEditItem({...editItem, no_wa: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Pesan</label>
                                            <textarea value={editItem.pesan || ''} onChange={(e) => setEditItem({...editItem, pesan: e.target.value})} className="w-full border rounded-lg p-2.5 h-32 text-gray-900 bg-gray-50" />
                                        </div>
                                    </>
                                )}

                                {editType === 'join' && (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Lengkap</label>
                                            <input type="text" value={editItem.nama_lengkap || ''} onChange={(e) => setEditItem({...editItem, nama_lengkap: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                             <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal Lahir</label>
                                                <input type="date" value={editItem.tanggal_lahir ? new Date(editItem.tanggal_lahir).toISOString().split('T')[0] : ''} onChange={(e) => setEditItem({...editItem, tanggal_lahir: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                             <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">No WhatsApp</label>
                                                <input type="text" value={editItem.no_wa || ''} onChange={(e) => setEditItem({...editItem, no_wa: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                             <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Asal Sekolah</label>
                                                <input type="text" value={editItem.asal_sekolah || ''} onChange={(e) => setEditItem({...editItem, asal_sekolah: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                             <div>
                                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kelas</label>
                                                <input type="text" value={editItem.kelas || ''} onChange={(e) => setEditItem({...editItem, kelas: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jurusan</label>
                                            <input type="text" value={editItem.jurusan || ''} onChange={(e) => setEditItem({...editItem, jurusan: e.target.value})} className="w-full border rounded-lg p-2.5 text-gray-900 bg-gray-50" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Pesan / Alasan Join</label>
                                            <textarea value={editItem.pesan || ''} onChange={(e) => setEditItem({...editItem, pesan: e.target.value})} className="w-full border rounded-lg p-2.5 h-32 text-gray-900 bg-gray-50" />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button onClick={() => setEditItem(null)} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">Batal</button>
                                <button onClick={handleSaveEdit} className="px-6 py-2 text-white bg-[#997B55] rounded-lg hover:bg-[#8B6E4A] flex items-center gap-2 font-bold shadow-lg shadow-[#997B55]/20">
                                    <Save size={18} /> Simpan Perubahan
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
