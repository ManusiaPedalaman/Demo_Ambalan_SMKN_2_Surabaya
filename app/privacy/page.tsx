import React from 'react';
import { DM_Sans } from 'next/font/google';

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-dm-sans',
});

export default function PrivacyPage() {
    return (
        <div className={`min-h-screen bg-[#FDF8F3] py-32 px-4 md:px-8 lg:px-12 ${dmSans.className}`}>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-[#8B6E4A] mb-8">Kebijakan Privasi</h1>

                <div className="space-y-6 text-gray-600 leading-relaxed">
                    <p>
                        Privasi Anda sangat penting bagi kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">1. Informasi yang Kami Kumpulkan</h2>
                    <p>
                        Kami dapat mengumpulkan informasi pribadi seperti nama, alamat email, nomor telepon, dan asal sekolah ketika Anda mendaftar, melakukan pemesanan sewa, atau menghubungi kami.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">2. Penggunaan Informasi</h2>
                    <p>
                        Informasi yang dikumpulkan digunakan untuk memproses pesanan layanan, menghubungi Anda terkait kegiatan Ambalan, dan meningkatkan pengalaman pengguna di website kami.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">3. Keamanan Data</h2>
                    <p>
                        Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi data pribadi Anda dari akses yang tidak sah, perubahan, atau penyalahgunaan.
                    </p>

                    <h2 className="text-xl font-bold text-gray-800 mt-6">4. Pihak Ketiga</h2>
                    <p>
                        Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan data jika diwajibkan oleh hukum atau untuk keperluan operasional layanan (misalnya notifikasi WhatsApp).
                    </p>
                </div>
            </div>
        </div>
    );
}
