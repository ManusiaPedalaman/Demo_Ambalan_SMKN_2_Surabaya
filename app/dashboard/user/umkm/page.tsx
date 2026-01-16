'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getUserProfileByEmail, getUserUMKM, addProductUMKM } from '@/app/actions';
import { Store, Plus, Loader2, Package, AlertCircle, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';


export default function UMKMDashboardPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [umkmData, setUmkmData] = useState<any>(null);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [productForm, setProductForm] = useState({
        nama_produk: '',
        deskripsi: '',
        harga: '',
        gambar: ''
    });

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

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!umkmData) return;

        const res = await addProductUMKM({
            id_umkm: umkmData.id,
            ...productForm
        });

        if (res.success) {
            alert('Produk berhasil ditambahkan! Menunggu konfirmasi admin.');
            setShowAddProduct(false);
            setProductForm({ nama_produk: '', deskripsi: '', harga: '', gambar: '' });
            init(); // Refresh data
        } else {
            alert('Gagal tambah produk: ' + res.error);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductForm(prev => ({ ...prev, gambar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-[#997B55]" /></div>;

    // Belum Punya UMKM
    if (!umkmData) {
        return (
            <div className="p-8 font-dm-sans flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md w-full">
                    <div className="w-20 h-20 bg-[#F8E7E7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#997B55]">
                        <Store size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada UMKM</h2>
                    <p className="text-gray-500 mb-8">Daftarkan usaha Anda sekarang dan mulai berjualan di platform kami.</p>
                    <Link href="/umkm-register" className="block w-full py-3 bg-[#997B55] text-white font-bold rounded-xl hover:bg-[#8B6E4A] transition-colors">
                        Daftar UMKM Sekarang
                    </Link>
                </div>
            </div>
        );
    }

    // Menunggu Konfirmasi / Ditolak
    if (umkmData.status === 'PENDING' || umkmData.status === 'REJECTED') {
        return (
            <div className="p-8 font-dm-sans">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Status UMKM</h1>
                <div className={`p-8 rounded-2xl border ${umkmData.status === 'PENDING' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex flex-col items-center text-center">
                        {umkmData.status === 'PENDING' ? (
                            <>
                                <Loader2 size={48} className="text-yellow-600 animate-spin mb-4" />
                                <h2 className="text-xl font-bold text-yellow-800">Menunggu Konfirmasi Admin</h2>
                                <p className="text-yellow-700 mt-2">Permintaan pendaftaran UMKM Anda sedang ditinjau. Estimasi proses 5 hari kerja.</p>
                            </>
                        ) : (
                             <>
                                <XCircle size={48} className="text-red-600 mb-4" />
                                <h2 className="text-xl font-bold text-red-800">Pendaftaran Ditolak</h2>
                                <p className="text-red-700 mt-2">{umkmData.alasan_tolak || 'Data tidak memenuhi syarat.'}</p>
                                <Link href="/umkm-register" className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                    Daftar Ulang
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // UMKM Approved - Manajemen Produk
    return (
        <div className="p-8 font-dm-sans">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{umkmData.nama_umkm}</h1>
                    <p className="text-gray-500">Kelola produk jualan Anda disini</p>
                </div>
                {!showAddProduct && (
                    <button 
                        onClick={() => setShowAddProduct(true)}
                        className="px-6 py-3 bg-[#997B55] text-white font-bold rounded-xl hover:bg-[#8B6E4A] flex items-center gap-2 shadow-lg shadow-[#997B55]/20"
                    >
                        <Plus size={20} /> Tambah Produk
                    </button>
                )}
            </div>

            {/* Add Product Form Card */}
            {showAddProduct && (
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">Tambah Produk Baru</h3>
                        <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                     </div>
                     <form onSubmit={handleCreateProduct} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1">Nama Produk</label>
                                <input required value={productForm.nama_produk} onChange={e => setProductForm({...productForm, nama_produk: e.target.value})} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1">Harga (Rp)</label>
                                <input required type="number" value={productForm.harga} onChange={e => setProductForm({...productForm, harga: e.target.value})} className="w-full border rounded-lg p-2" />
                            </div>
                        </div>
                        <div>
                                <label className="block text-sm font-semibold mb-1">Deskripsi</label>
                                <textarea value={productForm.deskripsi} onChange={e => setProductForm({...productForm, deskripsi: e.target.value})} className="w-full border rounded-lg p-2 h-20" />
                        </div>
                         <div>
                                <label className="block text-sm font-semibold mb-1">Foto Produk</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#997B55]/10 file:text-[#997B55] hover:file:bg-[#997B55]/20" />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="px-6 py-2 bg-[#997B55] text-white rounded-lg font-bold hover:bg-[#8B6E4A]">Simpan Produk</button>
                        </div>
                     </form>
                 </div>
            )}

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {umkmData.produk.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                        <Package size={48} className="mx-auto mb-4 opacity-50" />
                        <p>Belum ada produk. Tambahkan produk pertama Anda!</p>
                    </div>
                ) : (
                    umkmData.produk.map((produk: any) => (
                        <div key={produk.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="relative aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
                                {produk.gambar ? (
                                    <img src={produk.gambar} alt={produk.nama_produk} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={32} /></div> // Needs correct import for icon
                                )}
                                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold
                                    ${produk.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                      produk.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {produk.status === 'APPROVED' ? 'Disetujui' : produk.status === 'REJECTED' ? 'Ditolak' : 'Menunggu'}
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">{produk.nama_produk}</h3>
                            <p className="text-[#997B55] font-bold">Rp {produk.harga}</p>
                            
                            {produk.status === 'REJECTED' && (
                                <p className="text-red-600 text-xs mt-2 bg-red-50 p-2 rounded">Alasan: {produk.alasan_tolak}</p>
                            )}
                            {produk.status === 'PENDING' && (
                                <p className="text-yellow-600 text-xs mt-2 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Menunggu konfirmasi admin (2 hari)</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
