import React from 'react';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-dm-sans',
});

export default function TermsPage() {
    return (
        <div className={`min-h-screen bg-[#FDF8F3] py-32 px-4 md:px-8 lg:px-12 ${dmSans.className}`}>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-[#8B6E4A] mb-8">Ketentuan Penggunaan</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p>
                        Selamat datang di Ambalan SMKN 2 Surabaya. Dengan mengakses website ini, Anda dianggap telah membaca dan menyetujui syarat dan ketentuan berikut.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">1. Penggunaan Website</h2>
                    <p>
                        Website ini digunakan untuk memberikan informasi mengenai kegiatan Ambalan, penyewaan peralatan, dan materi kepramukaan. Pengguna dilarang menyalahgunakan konten atau fitur website untuk tujuan ilegal.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">2. Penyewaan Barang</h2>
                    <p>
                        Layanan penyewaan barang tunduk pada ketersediaan stok. Pengguna wajib menjaga kondisi barang yang disewa. Segala kerusakan atau kehilangan menjadi tanggung jawab penyewa sesuai dengan kesepakatan.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">3. Akun Pengguna</h2>
                    <p>
                        Beberapa fitur mungkin mewajibkan Anda untuk mendaftar atau login. Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">4. Perubahan Ketentuan</h2>
                    <p>
                        Kami berhak mengubah ketentuan penggunaan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Pengguna disarankan untuk memeriksa halaman ini secara berkala.
                    </p>
                </div>
            </div>
        </div>
    );
}
