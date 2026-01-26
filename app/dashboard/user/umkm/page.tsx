'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getUserProfileByEmail, getUserUMKM, addProductUMKM, updateProductUMKM, deleteProductUMKM, updateUMKMData, publishProductUMKM } from '@/app/actions';
import { Store, Plus, Loader2, Package, AlertCircle, CheckCircle, XCircle, Image as ImageIcon, Pencil, Trash2, X, Globe, Save } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function UMKMDashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [umkmData, setUmkmData] = useState<any>(null);
    
    // Modals & Forms handling
    const [view, setView] = useState<'LIST' | 'FORM_PRODUCT' | 'FORM_UMKM'>('LIST'); 
    const [isEditing, setIsEditing] = useState(false); 
    const [editId, setEditId] = useState<string | null>(null);

    // Delete Confirmation
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: 'PRODUCT' | 'UMKM'; id: string | null }>({ isOpen: false, type: 'PRODUCT', id: null });
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

    // Spec Modal
    const [showSpecModal, setShowSpecModal] = useState(false);

    // Product Form State
    const [productForm, setProductForm] = useState({
        nama_produk: '',
        deskripsi: '',
        harga: '',
        gambar: '', // Primary (backward compat)
        foto_produk: [] as string[], // Multiple images
        spesifikasi: [] as {label: string, value: string}[],
        is_draft: false
    });

    const [umkmForm, setUmkmForm] = useState({
        nama_umkm: '',
        nama_lengkap: '',
        no_wa: '',
        kelas: '',
        jurusan: '',
        kartu_pelajar: ''
    });

    const SPEC_OPTIONS = ["Berat", "Rasa", "Ukuran", "Bahan", "Warna", "Kadaluarsa", "Lainnya"];
    const [tempSpec, setTempSpec] = useState({ label: "Berat", value: "" });

    const init = async () => {
        if (session?.user?.email) {
            const profile = await getUserProfileByEmail(session.user.email);
            if (profile) {
                const umkm = await getUserUMKM(profile.id_login);
                setUmkmData(umkm);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        init();
    }, [session]);

    // --- PRODUCT HANDLERS ---
    const handleProductSubmit = async (e?: React.FormEvent, isDraft = false) => {
        if (e) e.preventDefault();
        setLoading(true);

        const payload = {
            ...productForm,
            is_draft: isDraft,
            // Ensure specs are stringified if needed or pass as object if action accepts json
            // Action updated to accept object array `spesifikasi`
        };

        let res;
        if (isEditing && editId) {
             res = await updateProductUMKM({ id: editId, ...payload });
        } else {
             res = await addProductUMKM({ id_umkm: umkmData.id, ...payload });
        }

        if (res.success) {
            alert(isDraft ? 'Draf berhasil disimpan!' : (isEditing ? 'Produk berhasil diperbarui!' : 'Produk berhasil diajukan!'));
            resetProductForm();
            init();
        } else {
            alert('Gagal: ' + res.error);
        }
        setLoading(false);
    };

    const handlePublish = async (id: string, currentStatus: boolean) => {
        // Toggle publish
        if (!confirm(currentStatus ? "Sembunyikan produk ini dari publik?" : "Tampilkan produk ini ke publik?")) return;
        
        setLoading(true);
        const res = await publishProductUMKM(id, !currentStatus);
        if (res.success) {
            init();
        } else {
            alert('Gagal mengubah status: ' + res.error);
        }
        setLoading(false);
    };

    const resetProductForm = () => {
        setProductForm({ 
            nama_produk: '', deskripsi: '', harga: '', gambar: '', 
            foto_produk: [], spesifikasi: [], is_draft: false 
        });
        setIsEditing(false);
        setEditId(null);
        setView('LIST');
    };

    const openEditProduct = (product: any) => {
        setProductForm({
            nama_produk: product.nama_produk,
            deskripsi: product.deskripsi || '',
            harga: product.harga,
            gambar: product.gambar || '',
            foto_produk: product.foto_produk && product.foto_produk.length > 0 ? product.foto_produk : (product.gambar ? [product.gambar] : []),
            spesifikasi: product.spesifikasi || [],
            is_draft: product.is_draft || false
        });
        setEditId(product.id);
        setIsEditing(true);
        setView('FORM_PRODUCT');
    };

    const handleSpecAdd = () => {
        if (productForm.spesifikasi.length >= 5) return alert("Maksimal 5 spesifikasi.");
        if (!tempSpec.value) return alert("Nilai spesifikasi harus diisi.");
        
        setProductForm(prev => ({
            ...prev,
            spesifikasi: [...prev.spesifikasi, tempSpec]
        }));
        setTempSpec({ label: "Berat", value: "" }); // Reset
        setShowSpecModal(false);
    };

    const removeSpec = (index: number) => {
        setProductForm(prev => ({
            ...prev,
            spesifikasi: prev.spesifikasi.filter((_, i) => i !== index)
        }));
    };

    const handleMultiFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            if (productForm.foto_produk.length + files.length > 10) {
                return alert("Maksimal 10 foto.");
            }
            
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setProductForm(prev => ({
                        ...prev,
                        foto_produk: [...prev.foto_produk, reader.result as string],
                        gambar: prev.gambar || (reader.result as string) // Set primary if empty
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number) => {
        setProductForm(prev => {
            const newPhotos = prev.foto_produk.filter((_, i) => i !== index);
            return {
                ...prev,
                foto_produk: newPhotos,
                gambar: newPhotos.length > 0 ? newPhotos[0] : '' // Reset primary
            };
        });
    };

    // --- UMKM HANDLERS ---
    const openEditUMKM = () => {
        setUmkmForm({
            nama_umkm: umkmData.nama_umkm,
            nama_lengkap: umkmData.nama_lengkap,
            no_wa: umkmData.no_wa,
            kelas: umkmData.kelas,
            jurusan: umkmData.jurusan,
            kartu_pelajar: umkmData.kartu_pelajar || ''
        });
        setView('FORM_UMKM');
    };

    const handleUMKMSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await updateUMKMData({ id: umkmData.id, ...umkmForm });

        if (res.success) {
            alert('Data UMKM berhasil diperbarui dan diajukan ulang!');
            setView('LIST');
            init();
        } else {
            alert('Gagal update UMKM: ' + res.error);
        }
        setLoading(false);
    };

    // --- DELETE HANDLERS ---
    const handleDeleteCheck = (type: 'PRODUCT' | 'UMKM', id: string) => {
        setDeleteModal({ isOpen: true, type, id });
        setDeleteConfirmationText('');
    };

    const executeDelete = async () => {
        if (deleteConfirmationText !== 'hapus') return;
        setLoading(true);
        let res = await deleteProductUMKM(deleteModal.id!);
        
        if (res.success) {
             setDeleteModal({ isOpen: false, type: 'PRODUCT', id: null });
             init();
        } else {
            alert('Gagal menghapus: ' + res.error);
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setter((prev: any) => ({ ...prev, [e.target.name === 'kartu_pelajar' ? 'kartu_pelajar' : 'gambar']: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading && !umkmData) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-[#997B55]" /></div>;

    // --- VIEW: UMKM EDIT FORM ---
    if (view === 'FORM_UMKM') {
        return (
             <div className="p-8 font-dm-sans max-w-2xl mx-auto">
                <button onClick={() => setView('LIST')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800"><X size={20} /> Batal</button>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Informasi UMKM</h2>
                    <form onSubmit={handleUMKMSubmit} className="space-y-4">
                        {/* Shortened for brevity - logic same as before */}
                        <div><label className="block text-sm font-semibold mb-1">Nama UMKM</label><input required value={umkmForm.nama_umkm} onChange={e => setUmkmForm({...umkmForm, nama_umkm: e.target.value})} className="w-full border rounded-xl p-3" /></div>
                        <div className="grid grid-cols-2 gap-4">
                             <div><label className="block text-sm font-semibold mb-1">Nama Pemilik</label><input required value={umkmForm.nama_lengkap} onChange={e => setUmkmForm({...umkmForm, nama_lengkap: e.target.value})} className="w-full border rounded-xl p-3" /></div>
                             <div><label className="block text-sm font-semibold mb-1">No WhatsApp</label><input required value={umkmForm.no_wa} onChange={e => setUmkmForm({...umkmForm, no_wa: e.target.value})} className="w-full border rounded-xl p-3" /></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div><label className="block text-sm font-semibold mb-1">Kelas</label><input required value={umkmForm.kelas} onChange={e => setUmkmForm({...umkmForm, kelas: e.target.value})} className="w-full border rounded-xl p-3" /></div>
                             <div><label className="block text-sm font-semibold mb-1">Jurusan</label><input required value={umkmForm.jurusan} onChange={e => setUmkmForm({...umkmForm, jurusan: e.target.value})} className="w-full border rounded-xl p-3" /></div>
                        </div>
                        <div><label className="block text-sm font-semibold mb-1">Update Kartu Pelajar (Opsional)</label><input type="file" name="kartu_pelajar" onChange={e => handleFileChange(e, setUmkmForm)} className="w-full text-sm text-gray-500" /></div>
                        <button type="submit" className="w-full py-3 bg-[#997B55] text-white font-bold rounded-xl hover:bg-[#8B6E4A] mt-4">Simpan Perubahan</button>
                    </form>
                </div>
             </div>
        )
    }

    // --- VIEW: STATUS PENDING / REJECTED ---
    if (umkmData && (umkmData.status === 'PENDING' || umkmData.status === 'REJECTED')) {
         // Same as before
        return (
            <div className="p-8 font-dm-sans">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Status UMKM</h1>
                <div className={`p-8 rounded-2xl border ${umkmData.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex flex-col items-center text-center">
                        {umkmData.status === 'PENDING' ? (
                            <>
                                <Loader2 size={48} className="text-yellow-600 animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-yellow-800">Menunggu Konfirmasi Admin</h2>
                                <p className="text-yellow-700 mt-2">Permintaan pendaftaran UMKM Anda sedang ditinjau.</p>
                            </>
                        ) : (
                             <>
                                <XCircle size={48} className="text-red-600 mb-4" />
                                <h2 className="text-xl font-bold text-red-800">Pendaftaran Ditolak</h2>
                                <p className="text-red-700 mt-2 mb-6 bg-white/50 px-4 py-2 rounded-lg inline-block border border-red-100">Alasan: {umkmData.alasan_tolak || 'Data tidak memenuhi syarat.'}</p>
                                <div className="flex gap-4">
                                    <button onClick={openEditUMKM} className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"><Pencil size={20} /></button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN DASHBOARD ---
    if (!umkmData) {
         // Register logic
        return (
            <div className="p-8 font-dm-sans flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                    <div className="w-20 h-20 bg-[#F8E7E7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#997B55]"><Store size={40} /></div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada UMKM</h2>
                    <p className="text-gray-500 mb-8">Daftarkan usaha Anda sekarang.</p>
                    <Link href="/umkm-register" className="block w-full py-3 bg-[#997B55] text-white font-bold rounded-xl hover:bg-[#8B6E4A] transition-colors">Daftar UMKM Sekarang</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 font-dm-sans relative">
            {/* Spec Modal */}
            <AnimatePresence>
                {showSpecModal && (
                    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4">
                         <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
                            <h3 className="text-lg font-bold mb-4">Tambah Spesifikasi</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Tipe</label>
                                    <select value={tempSpec.label} onChange={e => setTempSpec({...tempSpec, label: e.target.value})} className="w-full border rounded-lg p-2">
                                        {SPEC_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Nilai / Keterangan</label>
                                    <input autoFocus value={tempSpec.value} onChange={e => setTempSpec({...tempSpec, value: e.target.value})} placeholder="Contoh: 200 gram" className="w-full border rounded-lg p-2"/>
                                </div>
                                <button onClick={handleSpecAdd} className="w-full py-2 bg-[#997B55] text-white rounded-lg font-bold">Tambah</button>
                                <button onClick={() => setShowSpecModal(false)} className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg">Batal</button>
                            </div>
                         </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* DELETE MODAL */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                     {/* Same delete modal */}
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
                         <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Hapus Produk?</h3>
                         <input value={deleteConfirmationText} onChange={(e) => setDeleteConfirmationText(e.target.value)} className="w-full border rounded-lg px-4 py-2 mb-4 text-center" placeholder='Ketik "hapus"' />
                         <div className="flex gap-3">
                             <button onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Batal</button>
                             <button onClick={executeDelete} disabled={deleteConfirmationText !== 'hapus'} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold disabled:opacity-50">Hapus</button>
                         </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{umkmData.nama_umkm}</h1>
                    <p className="text-gray-500">Kelola produk jualan Anda disini</p>
                </div>
                {view === 'LIST' && (
                    <button onClick={() => setView('FORM_PRODUCT')} className="px-6 py-3 bg-[#997B55] text-white font-bold rounded-xl hover:bg-[#8B6E4A] flex items-center gap-2 shadow-lg">
                        <Plus size={20} /> Tambah Produk
                    </button>
                )}
            </div>

            {/* Add/Edit Product Form */}
            {view === 'FORM_PRODUCT' && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">{isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
                        <button onClick={resetProductForm} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                     </div>
                     <form onSubmit={(e) => handleProductSubmit(e, false)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Nama Produk</label>
                                <input required value={productForm.nama_produk} onChange={e => setProductForm({...productForm, nama_produk: e.target.value})} className="w-full border rounded-lg p-3" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Harga (Rp)</label>
                                <input required type="number" value={productForm.harga} onChange={e => setProductForm({...productForm, harga: e.target.value})} className="w-full border rounded-lg p-3" />
                            </div>
                        </div>
                        
                        {/* Specifications */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold">Spesifikasi</label>
                                <button type="button" onClick={() => setShowSpecModal(true)} className="text-xs bg-gray-100 px-3 py-1.5 rounded-lg font-bold text-[#997B55] hover:bg-gray-200">+ Tambah Spesifikasi</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {productForm.spesifikasi.length === 0 && <span className="text-sm text-gray-400 italic">Belum ada spesifikasi.</span>}
                                {productForm.spesifikasi.map((spec, i) => (
                                    <div key={i} className="bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg flex items-center gap-2 text-sm">
                                        <span className="font-semibold text-gray-700">{spec.label}:</span>
                                        <span className="text-gray-600">{spec.value}</span>
                                        <button type="button" onClick={() => removeSpec(i)} className="text-red-400 hover:text-red-600 ml-1"><X size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div><label className="block text-sm font-semibold mb-1">Deskripsi</label><textarea value={productForm.deskripsi} onChange={e => setProductForm({...productForm, deskripsi: e.target.value})} className="w-full border rounded-lg p-3 h-24" /></div>
                        
                        {/* Multiple Images */}
                        <div>
                                <label className="block text-sm font-semibold mb-1">Foto Produk (Max 10)</label>
                                <div className="grid grid-cols-5 gap-2 mb-2">
                                    {productForm.foto_produk.map((src, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                                            <img src={src} className="w-full h-full object-cover"/>
                                            <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
                                        </div>
                                    ))}
                                    {productForm.foto_produk.length < 10 && (
                                        <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:border-[#997B55] hover:text-[#997B55]">
                                            <Plus size={24} />
                                            <input type="file" multiple accept="image/*" onChange={handleMultiFileChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                             {/* Save Draft Button */}
                             {!isEditing && ( // Only show draft for new or draft items (logic simplified)
                                 <button type="button" onClick={() => handleProductSubmit(undefined, true)} className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 flex items-center gap-2">
                                     <Save size={18} /> Simpan Draf
                                 </button>
                             )}
                            <button type="submit" className="px-8 py-3 bg-[#997B55] text-white rounded-xl font-bold hover:bg-[#8B6E4A] shadow-lg">
                                {isEditing ? 'Simpan Perubahan' : 'Ajukan Produk'}
                            </button>
                        </div>
                     </form>
                 </div>
            )}

            {/* Product List */}
            {view === 'LIST' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {umkmData.produk.map((produk: any) => (
                        <div key={produk.id} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative group">
                             {/* Publish Toggle for Approved Products */}
                            
                            <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                                {produk.foto_produk && produk.foto_produk.length > 0 ? (
                                    <img src={produk.foto_produk[0]} className="w-full h-full object-cover" />
                                ) : (produk.gambar ? <img src={produk.gambar} className="w-full h-full object-cover" /> : null)}
                                
                                <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide backdrop-blur-md border border-white/20 shadow-sm
                                    ${produk.status === 'APPROVED' ? 'bg-green-500/90 text-white' : 
                                    produk.status === 'REJECTED' ? 'bg-red-500/90 text-white' : 'bg-yellow-500/90 text-white'}`}>
                                    {produk.is_draft ? 'DRAFT' : (produk.status === 'APPROVED' ? 'Disetujui' : produk.status === 'REJECTED' ? 'Ditolak' : 'Menunggu')}
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{produk.nama_produk}</h3>
                                <div className="flex justify-between items-center">
                                    <p className="text-[#997B55] font-bold text-lg">Rp {produk.harga}</p>
                                    
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                               {produk.status === 'APPROVED' && !produk.is_draft && (
                                   <button 
                                        onClick={() => handlePublish(produk.id, produk.is_published)}
                                        className={`flex-1 h-10 flex items-center justify-center rounded-xl font-bold text-xs gap-1 transition-all ${produk.is_published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-800 text-white hover:bg-black'}`}
                                        title={produk.is_published ? "Unpublish" : "Publish"}
                                   >
                                       <Globe size={16} /> {produk.is_published ? 'Published' : 'Publish'}
                                   </button>
                               )}

                               <button onClick={() => openEditProduct(produk)} className="h-10 w-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Pencil size={18}/></button>
                               <button onClick={() => handleDeleteCheck('PRODUCT', produk.id)} className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
