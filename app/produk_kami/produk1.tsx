'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { DM_Sans } from 'next/font/google';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { getPublicProducts } from '@/app/actions';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});

import { products } from '../data/products';

// Helper to normalize data structure
const normalizeProduct = (p: any, isStatic = false) => {
    if (isStatic) {
        return {
            id: 'static-' + p.id,
            name: p.name,
            price: p.price,
            images: p.images,
            description: p.description,
            duration: p.duration,
            type: 'static',
            spesifikasi: []
        };
    }
    return {
        id: p.id,
        name: p.nama_produk,
        price: 'Rp ' + p.harga,
        images: p.foto_produk && p.foto_produk.length > 0 ? p.foto_produk : (p.gambar ? [p.gambar] : []),
        description: p.deskripsi,
        duration: 'item', // UMKM default?
        type: 'umkm',
        spesifikasi: p.spesifikasi || [],
        umkm_name: p.nama_umkm
    };
};

export default function Produk() {
  const [searchQuery, setSearchQuery] = useState('');
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
      const fetchProducts = async () => {
          const res = await getPublicProducts();
          if (res) setRealProducts(res);
      };
      fetchProducts();
  }, []);

  // Merge static and real
  const allProducts = [
      ...realProducts.map(p => normalizeProduct(p)),
      ...products.map((p, i) => normalizeProduct({ ...p, id: i }, true))
  ];

  const filteredProducts = searchQuery.trim() === ''
    ? allProducts
    : allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const handleOpenDetail = (product: any) => {
      setSelectedProduct(product);
      setCurrentImageIndex(0);
  };

  const nextImage = () => {
      if (!selectedProduct) return;
      setCurrentImageIndex(prev => (prev + 1) % selectedProduct.images.length);
  };

  const prevImage = () => {
      if (!selectedProduct) return;
      setCurrentImageIndex(prev => (prev - 1 + selectedProduct.images.length) % selectedProduct.images.length);
  };

  return (
    <section className={`w-full min-h-screen bg-white py-24 px-4 md:px-8 lg:px-12 ${dmSans.className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-center">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="bg-gray-50 rounded-full p-1.5 flex items-center w-full max-w-3xl border border-gray-200 shadow-sm focus-within:border-[#C9A86A] transition-all duration-300"
          >
            <div className="pl-4 text-gray-400">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari produk UMKM & perlengkapan..."
              className="flex-1 px-4 py-2.5 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                custom={index}
                variants={cardVariants}
                className="group h-full"
                onClick={() => handleOpenDetail(product)}
              >
                <div className="block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer">
                  <div className="relative w-full aspect-square bg-[#F2E6D8] overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    {product.images.length > 0 ? (
                        <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between bg-white relative z-20">
                    <div>
                      {product.umkm_name && <p className="text-xs text-[#C9A86A] font-bold uppercase mb-1">{product.umkm_name}</p>}
                      <h3 className="text-gray-900 font-bold text-lg md:text-xl mb-1 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="w-12 h-1 bg-[#E07D5F] rounded-full mb-3 opacity-50 group-hover:w-24 transition-all duration-500" />
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest">
                          Harga {product.type === 'static' ? 'Sewa' : ''}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-[#E07D5F] text-xl md:text-2xl font-bold">
                            {product.price}
                          </span>
                          <span className="text-gray-400 text-sm font-medium">
                            {product.type === 'static' ? `/ ${product.duration}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">Produk &quot;{searchQuery}&quot; tidak ditemukan.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
          {selectedProduct && (
              <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }} 
                    className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
                    onClick={e => e.stopPropagation()}
                  >
                      <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 bg-white/50 hover:bg-white p-2 rounded-full transition-colors"><X size={24}/></button>

                      {/* Left: Image Gallery */}
                      <div className="w-full md:w-1/2 bg-gray-100 relative max-h-[50vh] md:max-h-full aspect-square md:aspect-auto">
                          {selectedProduct.images.length > 0 ? (
                              <>
                                <Image src={selectedProduct.images[currentImageIndex]} alt={selectedProduct.name} fill className="object-contain" />
                                {selectedProduct.images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-lg"><ChevronLeft size={24}/></button>
                                        <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white shadow-lg"><ChevronRight size={24}/></button>
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                            {selectedProduct.images.map((_: any, idx: number) => (
                                                <div key={idx} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[#997B55] w-6' : 'bg-gray-400'}`} />
                                            ))}
                                        </div>
                                    </>
                                )}
                              </>
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                          )}
                      </div>

                      {/* Right: Info */}
                      <div className="w-full md:w-1/2 p-8 overflow-y-auto">
                          {selectedProduct.umkm_name && <span className="inline-block px-3 py-1 bg-[#997B55]/10 text-[#997B55] rounded-full text-xs font-bold mb-3">{selectedProduct.umkm_name}</span>}
                          
                          <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                          <p className="text-2xl font-bold text-[#E07D5F] mb-6">{selectedProduct.price}</p>

                          <div className="space-y-6">
                              <div>
                                  <h3 className="font-bold text-gray-900 mb-2">Deskripsi</h3>
                                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{selectedProduct.description || 'Tidak ada deskripsi.'}</p>
                              </div>

                              {/* Specifications */}
                              {selectedProduct.spesifikasi && selectedProduct.spesifikasi.length > 0 && (
                                  <div>
                                      <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><List size={18}/> Spesifikasi</h3>
                                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                          {selectedProduct.spesifikasi.map((spec: any, idx: number) => (
                                              <div key={idx} className="flex justify-between border-b last:border-0 border-gray-200 pb-2 last:pb-0">
                                                  <span className="text-gray-500 font-medium">{spec.label}</span>
                                                  <span className="text-gray-900 font-bold">{spec.value}</span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </div>

                          <div className="mt-8 pt-6 border-t border-gray-100">
                             <a 
                                href={selectedProduct.type === 'static' ? '#' : `https://wa.me/?text=Saya tertarik dengan produk ${selectedProduct.name}`} 
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full py-4 bg-[#2D2A29] text-white text-center rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl"
                             >
                                 Hubungi Penjual
                             </a>
                          </div>
                      </div>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>
    </section>
  );
}