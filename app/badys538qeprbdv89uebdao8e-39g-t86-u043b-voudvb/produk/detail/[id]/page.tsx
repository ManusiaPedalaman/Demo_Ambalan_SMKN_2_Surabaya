'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import {
    ChevronLeft,
    LogOut,
    Calendar,
    Shield,
    Clock,
    User,
    Phone,
    Briefcase,
    CreditCard,
    Box,
    Info,
    MapPin,
    CheckCircle2,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { getBookingById, getRenterById, getProductById } from '@/app/actions';
import { products as staticProducts } from '@/app/data/products';

const dmSans = DM_Sans({ subsets: ['latin'] });

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'product';

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [staticData, setStaticData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (type === 'booking') {
                    const res = await getBookingById(id);
                    setData(res);
                } else if (type === 'renter') {
                    const res = await getRenterById(id);
                    setData(res);
                } else if (type === 'product') {
                    const res = await getProductById(id);
                    setData(res);
                    if (res) {
                        const staticInfo = staticProducts.find(p =>
                            (p.dbName && p.dbName === res.nama) || p.name === res.nama
                        );
                        setStaticData(staticInfo || null);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id, type]);

    if (loading) return (
        <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-[#9C7C5B]/30 border-t-[#9C7C5B] rounded-full animate-spin" />
                <p className="text-sm text-gray-400 font-dm-sans">Memuat data...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="min-h-screen bg-[#FDFBF9] flex flex-col items-center justify-center gap-4 font-dm-sans">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <XCircle size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Data tidak ditemukan</p>
            <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-[#9C7C5B] text-white rounded-full font-bold hover:bg-[#8B6E4A] transition-colors"
            >
                Kembali
            </button>
        </div>
    );




    const StatusBadge = ({ status, type = 'default' }: { status: string, type?: 'status' | 'payment' | 'default' }) => {
        let colors = "bg-gray-100 text-gray-600 border-gray-200";
        let dotColor = "bg-gray-400";

        if (type === 'status') {
            if (status === 'Tersedia' || status === 'Sudah') {
                colors = "bg-emerald-100 text-emerald-700 border-emerald-200";
                dotColor = "bg-emerald-500";
            }
            if (status === 'Tidak Tersedia' || status === 'Belum' || status === 'Dipinjam') {
                colors = "bg-rose-100 text-rose-700 border-rose-200";
                dotColor = "bg-rose-500";
            }
        } else if (type === 'payment') {
            if (status === 'Lunas' || status === 'Sudah') {
                colors = "bg-blue-100 text-blue-700 border-blue-200";
                dotColor = "bg-blue-500";
            }
            if (status === 'Belum') {
                colors = "bg-amber-100 text-amber-700 border-amber-200";
                dotColor = "bg-amber-500";
            }
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${colors}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                {status?.toString() || 'Unknown'}
            </span>
        );
    };


    const InfoCard = ({ icon: Icon, label, value, subValue, fullWidth = false }: any) => (
        <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 ${fullWidth ? 'col-span-full' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-[#FDFBF9] flex items-center justify-center flex-shrink-0 text-[#9C7C5B]">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">{label}</p>
                <p className="text-gray-900 font-medium text-sm md:text-base break-words leading-snug">{value || '-'}</p>
                {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
            </div>
        </div>
    );



    const renderBookingDetail = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B] border-2 border-white shadow-lg">
                        <Box size={36} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{data.product_slug}</h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <User size={14} /> {data.user_info?.name || 'Unknown User'}
                        </p>
                    </div>
                </div>
                <StatusBadge status={data.status} type="status" />
            </div>


            <InfoCard icon={Box} label="Jumlah" value={`${data.quantity} Unit`} />
            <InfoCard icon={Calendar} label="Tanggal Ambil" value={data.start_date} subValue={data.pickup_time} />
            <InfoCard icon={Calendar} label="Tanggal Kembali" value={data.end_date} subValue={data.return_time} />
            <InfoCard icon={Clock} label="Durasi Total" value={`${data.duration_days || '-'} Hari`} />
        </div>
    );

    const renderRenterDetail = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B] border-2 border-white shadow-lg">
                        <User size={40} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{data.nama_customer}</h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            <Briefcase size={14} /> {data.sekolah_instansi}
                        </p>
                    </div>
                </div>
                <StatusBadge status={data.status_bayar} type="payment" />
            </div>

            <InfoCard icon={Phone} label="WhatsApp" value={data.no_wa} />
            <InfoCard icon={Box} label="Produk Disewa" value={data.produk_disewa} />
            <InfoCard icon={Clock} label="Waktu Pengambilan" value={data.jam_pengambilan} />
            <InfoCard icon={Clock} label="Waktu Pengembalian" value={data.jam_pengembalian} />
            <InfoCard icon={CreditCard} label="Metode Bayar" value={data.metode_bayar} fullWidth />
        </div>
    );

    const renderProductDetail = () => {
        const productInfo = staticData || {};
        const isAvailable = data.status === 'Tersedia';


        const hasImages = productInfo.images && productInfo.images.length > 0;
        const mainImage = hasImages ? productInfo.images[0] : null;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="col-span-full bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#9C7C5B] border-2 border-gray-100 shadow-lg overflow-hidden relative">
                            {mainImage ? (
                                <Image src={mainImage} alt={data.nama} fill className="object-cover" />
                            ) : (
                                <Box size={40} />
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{data.nama}</h1>
                            <p className="text-gray-400">ID: #{data.id}</p>
                        </div>
                    </div>
                    <StatusBadge status={data.status} type="status" />
                </div>


                <InfoCard
                    icon={CreditCard}
                    label="Harga Sewa"
                    value={productInfo.price ? `${productInfo.price / 1000}k` : '-'}
                    subValue={productInfo.duration ? `Per ${productInfo.duration}` : ''}
                />
                <InfoCard icon={CheckCircle2} label="Kondisi" value="Baik (98%)" />


                <div className="col-span-full">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-2 ml-1">Spesifikasi</h3>
                </div>

                <InfoCard icon={Box} label="Dimensi" value={productInfo.specs?.dimensi} />
                <InfoCard icon={User} label="Kapasitas" value={productInfo.specs?.muat} />
                <InfoCard icon={Info} label="Berat" value={productInfo.specs?.berat} />
                <InfoCard icon={Shield} label="Fitur" value={productInfo.specs?.ketahananAir} />


                <div className="col-span-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-4">
                        <div className="w-8 h-8 rounded-full bg-[#FDFBF9] flex items-center justify-center text-[#9C7C5B]">
                            <Info size={16} />
                        </div>
                        <h3 className="font-bold text-gray-800">Deskripsi</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {productInfo.description || 'Tidak ada deskripsi tersedia.'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#FDFBF9] pb-20 font-dm-sans ${dmSans.className} text-gray-800`}>

            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#9C7C5B] cursor-pointer transition-colors group"
                    >
                        <div className="bg-white border border-gray-200 p-2 rounded-full group-hover:border-[#9C7C5B] transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="font-bold text-sm tracking-wide uppercase">KEMBALI</span>
                    </div>


                    <div className="hidden md:flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            <User size={18} className="text-gray-600" />
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-bold text-gray-900 leading-tight">Master Admin</p>
                            <p className="text-[10px] text-gray-400 leading-tight">AdminMada@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8">

                <div className="mb-8">
                    <span className="text-[#9C7C5B] font-bold tracking-wider text-xs uppercase mb-2 block">
                        Detail Informasi
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        {type === 'booking' && 'Peminjaman Barang'}
                        {type === 'renter' && 'Data Penyewa'}
                        {type === 'product' && 'Inventaris Produk'}
                    </h1>
                </div>

                {type === 'booking' && renderBookingDetail()}
                {type === 'renter' && renderRenterDetail()}
                {type === 'product' && renderProductDetail()}
            </main>
        </div>
    );
}
