'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { updateUserProfile, getUserProfileByEmail } from '@/app/actions';
import Image from 'next/image';
import { Camera, Save, Loader2 } from 'lucide-react';
import AlertModal from '@/app/components/AlertModal';

export default function UserProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    const [alertState, setAlertState] = useState<{
        isOpen: boolean;
        type: 'success' | 'error' | 'warning';
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        no_wa: '',
        tgl_lahir: '',
        sekolah: '',
        kelas: '',
        jurusan: '',
        foto: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (session?.user?.email) {
                const profile = await getUserProfileByEmail(session.user.email);
                if (profile) {
                    setUserId(profile.id_login);
                    setFormData({
                        nama: profile.nama_lengkap || session.user.name || '',
                        email: profile.email || '',
                        no_wa: profile.no_wa || '',
                        tgl_lahir: profile.tgl_lahir ? new Date(profile.tgl_lahir).toISOString().split('T')[0] : '',
                        sekolah: profile.sekolah_instansi || '',
                        kelas: profile.kelas || '',
                        jurusan: profile.jurusan || '',
                        foto: profile.foto || session.user.image || ''
                    });
                }
            }
            setLoading(false);
        };

        fetchProfile();
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, foto: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const showAlert = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
        setAlertState({
            isOpen: true,
            type,
            title,
            message
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        if (!userId) {
            showAlert('error', 'Error', 'User ID not found. Please re-login.');
            setSaving(false);
            return;
        }

        try {
            const result = await updateUserProfile({
                id: userId,
                ...formData
            });

            if (result.success) {
                showAlert('success', 'Berhasil', 'Profil berhasil diperbarui!');
            } else {
                showAlert('error', 'Gagal', 'Gagal memperbarui profil: ' + result.error);
            }
        } catch (error) {
             showAlert('error', 'Error', 'Terjadi kesalahan sistem.');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#997B55]" />
            </div>
        );
    }

    return (
        <div className="p-8 font-dm-sans">
            <AlertModal 
                isOpen={alertState.isOpen}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
                type={alertState.type}
                title={alertState.title}
                message={alertState.message}
            />

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</h1>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Foto Profil */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100">
                                {formData.foto ? (
                                    <img src={formData.foto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                                        <Camera size={40} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 p-2 bg-[#997B55] text-white rounded-full cursor-pointer hover:bg-[#8B6E4A] transition-colors shadow-lg">
                                <Camera size={18} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Klik ikon kamera untuk mengganti foto</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nama Lengkap */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#997B55]/20 focus:border-[#997B55] transition-all"
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>

                        {/* Email (Read only) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        {/* No WA */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Nomor WhatsApp</label>
                            <input
                                type="text"
                                name="no_wa"
                                value={formData.no_wa}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#997B55]/20 focus:border-[#997B55] transition-all"
                                placeholder="Contoh: 81234567890"
                            />
                        </div>

                        {/* Tanggal Lahir */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Tanggal Lahir</label>
                            <input
                                type="date"
                                name="tgl_lahir"
                                value={formData.tgl_lahir}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#997B55]/20 focus:border-[#997B55] transition-all"
                            />
                        </div>

                        {/* Sekolah / Instansi */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Sekolah / Instansi</label>
                            <input
                                type="text"
                                name="sekolah"
                                value={formData.sekolah}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#997B55]/20 focus:border-[#997B55] transition-all"
                                placeholder="Nama Sekolah"
                            />
                        </div>

                        {/* Kelas (Optional) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Kelas</label>
                            <input
                                type="text"
                                name="kelas"
                                value={formData.kelas}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#997B55]/20 focus:border-[#997B55] transition-all"
                                placeholder="Contoh: XII"
                            />
                        </div>

                        {/* Jurusan (Optional) */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Jurusan</label>
                            <input
                                type="text"
                                name="jurusan"
                                value={formData.jurusan}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#997B55]/20 focus:border-[#997B55] transition-all"
                                placeholder="Contoh: RPL"
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-8 py-3 bg-[#997B55] text-white rounded-xl font-bold hover:bg-[#8B6E4A] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#997B55]/20"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save size={20} />
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
