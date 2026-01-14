'use client';

import React from 'react';
import { Package } from 'lucide-react';

export default function AdminConfirmProductPage() {
    return (
        <div className="p-8 font-dm-sans">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Konfirmasi Produk UMKM</h1>
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                <Package size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">Fitur Sedang Dikembangkan</h3>
                <p className="text-gray-400 text-center max-w-md mt-2">
                    Halaman ini nantinya akan menampilkan daftar produk baru yang diajukan oleh UMKM.
                </p>
            </div>
        </div>
    );
}
