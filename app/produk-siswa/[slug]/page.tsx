'use client';

import React, { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { getPublicProductById } from '@/app/actions';
import {
  ShieldCheck,
  Check,
  ShoppingCart,
  BadgeCheck,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

// Helper to format currency
const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
};

export default function DetailProdukSiswa({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params); // slug here serves as ID
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  React.useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      const res = await getPublicProductById(slug);
      setProduct(res);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C9A86A]"></div>
        </div>
    );
  }

  if (!product) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8F3] gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Produk Tidak Ditemukan</h1>
            <Link href="/produk_kami" className="text-[#C9A86A] underline hover:text-[#8A6A4B]">Kembali ke Produk Kami</Link>
        </div>
    );
  }

  const handleContactSeller = () => {
    const message = `Halo, saya tertarik dengan produk ${product.nama_produk}. Apakah masih tersedia?`;
    const phoneNumber = product.no_wa || '6281234567890'; // Default fallback if missing
    // Ensure phone number format for WhatsApp link (remove leading 0 if present, add 62)
    const formattedPhone = phoneNumber.startsWith('0') ? '62' + phoneNumber.slice(1) : phoneNumber;
    
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className={`min-h-screen bg-[#FDF8F3] py-32 px-4 md:px-8 lg:px-12 ${dmSans.className}`}>
      <div className="max-w-7xl mx-auto mb-8">
          <Link href="/produk_kami" className="flex items-center gap-2 text-gray-600 hover:text-[#C9A86A] transition-colors w-fit">
              <ArrowLeft size={20} />
              <span className="font-medium">Kembali</span>
          </Link>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Left Column: Images & Seller Info */}
        <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:sticky lg:top-32 h-fit">

          <div className="w-full aspect-square bg-[#C9826B]/20 rounded-2xl relative overflow-hidden border border-[#C9826B]/30 flex items-center justify-center group">
            {product.foto_produk && product.foto_produk.length > 0 ? (
                <Image
                  src={product.foto_produk[activeImage]}
                  alt={product.nama_produk}
                  width={500}
                  height={500}
                  className="object-cover w-full h-full drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="text-gray-400">No Image</div>
            )}
          </div>

          {product.foto_produk && product.foto_produk.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.foto_produk.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 flex-shrink-0 bg-[#C9826B]/20 rounded-xl border-2 overflow-hidden relative cursor-pointer transition-all
                      ${activeImage === idx ? 'border-[#C9A86A]' : 'border-transparent hover:border-[#C9A86A]/50'}
                    `}
                  >
                    <Image
                      src={img}
                      alt="thumbnail"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
          )}

          <div className="w-full bg-white rounded-xl border border-gray-100 p-8 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">UMKM:</span>
              <span className="text-gray-800 font-bold">{product.nama_umkm}</span>
              <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
            </div>
            <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
              <div className="w-5 h-5 bg-[#8A6A4B] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700 text-sm font-bold">Verified by SMKN 2 Surabaya</span>
            </div>
          </div>
          
           <div className="w-full bg-yellow-50/50 rounded-xl border border-yellow-200 p-6 flex flex-col gap-2 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm tracking-wide uppercase">Info Pembelian</h3>
            </div>
            <p className="text-yellow-700 text-xs md:text-sm leading-relaxed font-medium">
              Barang ini dijual langsung oleh siswa/i UMKM. Transaksi dilakukan secara langsung antara pembeli dan penjual melalui WhatsApp.
            </p>
          </div>

        </div>


        {/* Right Column: Product Details */}
        <div className="w-full lg:w-[60%] flex flex-col gap-8">

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">{product.nama_produk}</h1>
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-8">
              <h2 className="text-3xl font-bold text-[#8A6A4B]">
                {formatRupiah(product.harga)}
              </h2>
            </div>

            {/* Spesifikasi if available */}
             {product.spesifikasi && product.spesifikasi.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-y border-gray-100 mb-8">
                     {/* Adapting specificasi structure if it's an array of strings or objects. 
                         The action normalization returns array. Assuming simple list for now or adapt based on data shape.
                         If it's free text array:
                     */}
                     {product.spesifikasi.map((spec: any, idx: number) => (
                         <div key={idx} className="flex gap-2 items-center">
                             <div className="w-2 h-2 rounded-full bg-[#C9A86A]"></div>
                             <p className="text-gray-700">{typeof spec === 'string' ? spec : JSON.stringify(spec)}</p>
                         </div>
                     ))}
                </div>
             )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#C9A86A]">
                <h3 className="font-bold text-lg">Deskripsi Produk</h3>
              </div>

              <div className="space-y-4 text-gray-600 text-sm leading-relaxed text-justify whitespace-pre-line">
                {product.deskripsi}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm border-t-4 border-t-[#25D366]">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#E7FCEB] p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-[#25D366]" />
              </div>
              <h2 className="text-2xl font-bold text-[#25D366]">Tertarik Membeli?</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
                Klik tombol di bawah untuk menghubungi penjual langsung via WhatsApp dan melakukan pemesanan.
            </p>

            <button
                onClick={handleContactSeller}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
            >
                <Image src="/Icon/wa.png" alt="WhatsApp" width={24} height={24} className="invert brightness-0 grayscale-0 filter-none" /> 
                {/* Assuming wa icon exists or use generic icon */}
                Hubungi Penjual
            </button>
          </div>

        </div>
      </div >
    </section>
  );
}
