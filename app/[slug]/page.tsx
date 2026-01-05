'use client';



import React, { useState, use, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DM_Sans } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { submitBookingForm, getProductStatusByName } from '../actions';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  Edit3,
  ShoppingCart,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


import { products } from '../data/products';
import Skeleton from '../components/Skeleton';

export default function DetailProduct({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = use(params);



  const product = (products as any[]).find(p => p.slug === slug) || products[0];

  const [activeImage, setActiveImage] = useState(0);
  const [dbStatus, setDbStatus] = useState<string>('Memuat...');


  React.useEffect(() => {
    async function fetchStatus() {

      const queryName = product.dbName || product.name;
      const res = await getProductStatusByName(queryName);
      if (res.success) {
        setDbStatus(res.status);
      } else {

        setDbStatus(product.status);
      }
    }
    fetchStatus();
  }, [product.name, product.dbName]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPickupOpen(false);
        setIsReturnOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: session, status } = useSession();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);


  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [quantity, setQuantity] = useState(1);


  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPickupOpen(false);
        setIsReturnOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  /* Logic Logic untuk button Booking invalid */
  const isFormValid = () => {
    // Validasi basic state yang sudah ada
    if (!startDate || !endDate || !pickupTime || !returnTime || !paymentMethod || !quantity) return false;

    // Untuk input text yg diambil lewat querySelector saat submit,
    // kita sebaiknya tambahkan state agar bisa re-render button disabled state.
    // Tapi karena code existing menggunakan querySelector di onSubmit,
    // kita akan cek manual element value tapi React tidak re-render otomatis jika DOM berubah tanpa state.
    // SOLUSI: Sebaiknya kita tambahkan state untuk input-input tersebut agar button bisa reactive.
    // Namun untuk meminimalisir refactor besar, kita pakai approach:
    // User ingin button "gray" sebelum memasukkan data. 
    // Kita cek 'errors' object? Tidak cukup krn error muncul setelah validasi.

    // Kita akan tetap menggunakan querySelector check inside a useEffect or similar? 
    // No, React way is controlled components. 
    // Looking at the code:
    // Input 'Nama Lengkap', 'No WhatsApp', 'Sekolah', 'Pesan' TIDAK CONTROLLED (tidak ada value={state}).
    // Mereka pakai onInput utk regex tapi tidak set state.
    // Kita HARUS mengubah input-input ini menjadi Controlled Components agar bisa mendeteksi isian user secara real-time.
    return false; // Placeholder logic, see below
  };

  // --- REFACTORING TO CONTROLLED INPUTS ---
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    school: '',
    message: ''
  });

  const validateBooking = () => {
    const newErrors: { [key: string]: boolean } = {};

    if (!formData.name) newErrors.name = true;
    if (!startDate) newErrors.startDate = true;
    if (!endDate) newErrors.endDate = true;
    if (!pickupTime) newErrors.pickupTime = true;
    if (!returnTime) newErrors.returnTime = true;
    if (!formData.whatsapp) newErrors.whatsapp = true;
    if (!formData.school) newErrors.school = true;
    if (!paymentMethod) newErrors.paymentMethod = true;
    if (!formData.message) newErrors.message = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isBookingValid = Boolean(
    formData.name &&
    startDate &&
    endDate &&
    pickupTime &&
    returnTime &&
    formData.whatsapp &&
    formData.school &&
    paymentMethod &&
    formData.message &&
    quantity > 0 &&
    dbStatus === 'Tersedia'
  );


  const calculateTotal = () => {
    if (!startDate || !endDate) return { price: 0, days: 0 };

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();


    if (diffTime < 0) return { price: 0, days: 0 };

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


    if (diffDays <= 0) return { price: 0, days: 0 };

    const durationNum = parseInt(product.duration.split(' ')[0]) || 1;

    const periods = Math.ceil(diffDays / durationNum);
    const totalPrice = periods * product.price * quantity;

    return { price: totalPrice, days: diffDays };
  };

  const { price: totalPrice, days: totalDays } = calculateTotal();


  const timeOptions = Array.from({ length: 11 }, (_, i) => i + 7).map((hour) =>
    `${hour < 10 ? '0' + hour : hour}.00`
  );


  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);


  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.disconnect(); };
  }, []);


  React.useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) setItemsPerView(1);
        else if (window.innerWidth < 1024) setItemsPerView(2);
        else setItemsPerView(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (idx: number) => setCurrentSlide(idx);

  const visibleProducts = products.slice(
    currentSlide * itemsPerView,
    currentSlide * itemsPerView + itemsPerView
  );

  return (
    <section ref={sectionRef} className={`min-h-screen bg-[#FDF8F3] py-32 px-4 md:px-8 lg:px-12 ${dmSans.className}`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        <div className="w-full lg:w-[40%] flex flex-col gap-6 lg:sticky lg:top-32 h-fit">

          <div className="w-full aspect-[4/3] bg-[#C9826B]/20 rounded-2xl relative overflow-hidden border border-[#C9826B]/30 p-8 flex items-center justify-center group">
            <div className="absolute inset-0 opacity-10 bg-[url('/Image/Vector.webp')] bg-repeat bg-cover mix-blend-overlay"></div>

            <Image
              src={product.images[activeImage]}
              alt={product.name}
              width={500}
              height={500}
              className="object-contain w-full h-full drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="flex gap-4">
            {product.images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-24 h-24 bg-[#C9826B]/20 rounded-xl border-2 overflow-hidden relative cursor-pointer transition-all
                  ${activeImage === idx ? 'border-[#C9A86A]' : 'border-transparent hover:border-[#C9A86A]/50'}
                `}
              >
                <Image
                  src={img}
                  alt="thumbnail"
                  fill
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>

          <div className="w-full bg-white rounded-xl border border-gray-100 p-8 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">by:</span>
              <span className="text-gray-800 font-bold">Gajah Mada - Tungga Dewi</span>
              <BadgeCheck className="w-5 h-5 text-blue-500 fill-blue-50" />
            </div>
            <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
              <div className="w-5 h-5 bg-[#8A6A4B] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-gray-700 text-sm font-bold">SMKN 2 Surabaya</span>
            </div>
          </div>

          <div className="w-full bg-red-50/50 rounded-xl border border-red-200 p-8 flex flex-col gap-2 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg tracking-wide uppercase">Disclaimer!!!</h3>
            </div>
            <p className="text-red-500 text-center text-xs md:text-sm leading-relaxed font-medium">
              “Silakan datang langsung untuk memastikan kualitas, warna, dan ukuran barang sesuai keinginan. Pemilihan dilakukan oleh pelanggan dan tidak dapat diganti setelah transaksi.”
            </p>
          </div>
        </div>


        <div className="w-full lg:w-[60%] flex flex-col gap-8">

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">{product.name}</h1>
              {dbStatus === 'Memuat...' ? (
                <Skeleton className="mt-2 md:mt-0 w-32 h-8 rounded-full" />
              ) : (
                <div className={`mt-2 md:mt-0 flex flex-shrink-0 items-center gap-2 px-3 py-1.5 rounded-full border ${dbStatus === 'Tersedia' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
                  }`}>
                  <span className={`font-bold text-sm ${dbStatus === 'Tersedia' ? 'text-green-700' : 'text-red-700'}`}>
                    {dbStatus}
                  </span>
                  {dbStatus === 'Tersedia' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Rp {product.price.toLocaleString('id-ID')} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">/ {product.duration}</span>
              </h2>
              <span className="text-gray-400 line-through font-medium dark:text-gray-500">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-gray-100 mb-8">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Berat</p>
                <p className="font-medium text-gray-800">{product.specs.berat}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Muat</p>
                <p className="font-medium text-gray-800">{product.specs.muat}</p>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Dimensi (P x L x T)</p>
                <p className="font-medium text-gray-800">{product.specs.dimensi}</p>
              </div>
              <div className="col-span-2 lg:col-span-1">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Tingkat Ketahanan Air</p>
                <p className="font-medium text-gray-800">{product.specs.ketahananAir}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#C9A86A]">
                <Edit3 className="w-5 h-5" />
                <h3 className="font-bold text-lg">Deskripsi</h3>
              </div>

              <div className="space-y-4 text-gray-600 text-sm leading-relaxed text-justify">
                <p className="font-bold text-gray-900">{product.name} (Ridge Tent)</p>
                <p>{product.description}</p>

                <div className="pt-2">
                  <p className="font-bold text-gray-900 mb-2">Fitur Umum {product.name.split('/')[0]}:</p>
                  <ul className="space-y-3 list-disc pl-5">
                    {product.features.map((feature: { title: string; desc: string }, i: number) => (
                      <li key={i}>
                        <strong className="text-gray-800">{feature.title}:</strong> {feature.desc}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm border-t-4 border-t-[#8A6A4B]">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#FDF8F3] p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-[#8A6A4B]" />
              </div>
              <h2 className="text-2xl font-bold text-[#8A6A4B]">Booking</h2>
            </div>

            <form className="space-y-6">

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan Nama Lengkap..."
                  className={`w-full border rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none transition-all ${errors.name
                    ? 'border-red-500 ring-red-200 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#C9A86A] focus:border-transparent'
                    }`}
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                    setFormData({ ...formData, name: val });
                    if (errors.name) setErrors({ ...errors, name: false });
                  }}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">silahkan masukan contoh Nama Lengkap anda</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4" ref={dropdownRef}>
                <div className="md:col-span-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Pengambilan</label>
                  <div className="relative ">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (errors.startDate) setErrors(prev => ({ ...prev, startDate: false }));
                      }}
                      className={`w-full border rounded-lg p-3 text-sm text-gray-900 focus:ring-2 outline-none accent-[#9C7C5B] ${errors.startDate
                        ? 'border-red-500 ring-red-200 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#C9A86A]'
                        }`}
                      style={{ accentColor: '#9C7C5B' }}
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">silahkan masukan contoh Tanggal anda</p>}
                  </div>
                </div>

                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jam</label>
                  <div
                    className={`w-full border rounded-lg p-3 text-sm text-gray-900 flex justify-between items-center cursor-pointer bg-white ${errors.pickupTime ? 'border-red-500 ring-red-200 ring-1' : 'border-gray-300'
                      }`}
                    onClick={() => {
                      setIsPickupOpen(!isPickupOpen);
                      if (errors.pickupTime) setErrors({ ...errors, pickupTime: false });
                    }}
                  >
                    <span>{pickupTime || 'Pilih Jam'}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isPickupOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  {errors.pickupTime && <p className="text-red-500 text-xs mt-1">silahkan pilih jam pengambilan</p>}

                  {isPickupOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                      {timeOptions.map((time) => (
                        <div
                          key={time}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-[#8A6A4B] hover:text-white cursor-pointer transition-colors"
                          onClick={() => {
                            setPickupTime(time);
                            setIsPickupOpen(false);
                          }}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-1 flex items-center justify-center pt-6 font-bold text-gray-400">s.d</div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Pengembalian</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        if (errors.endDate) setErrors(prev => ({ ...prev, endDate: false }));
                      }}
                      className={`w-full border rounded-lg p-3 text-sm text-gray-900 focus:ring-2 outline-none accent-[#9C7C5B] ${errors.endDate
                        ? 'border-red-500 ring-red-200 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#C9A86A]'
                        }`}
                      style={{ accentColor: '#9C7C5B' }}
                    />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">silahkan masukan contoh Tanggal anda</p>}
                  </div>
                </div>

                <div className="md:col-span-2 relative">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jam</label>
                  <div
                    className={`w-full border rounded-lg p-3 text-sm text-gray-900 flex justify-between items-center cursor-pointer bg-white ${errors.returnTime ? 'border-red-500 ring-red-200 ring-1' : 'border-gray-300'
                      }`}
                    onClick={() => {
                      setIsReturnOpen(!isReturnOpen);
                      if (errors.returnTime) setErrors({ ...errors, returnTime: false });
                    }}
                  >
                    <span>{returnTime || 'Pilih Jam'}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isReturnOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  {errors.returnTime && <p className="text-red-500 text-xs mt-1">silahkan pilih jam pengembalian</p>}

                  {isReturnOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto">
                      {timeOptions.map((time) => (
                        <div
                          key={time}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-[#8A6A4B] hover:text-white cursor-pointer transition-colors"
                          onClick={() => {
                            setReturnTime(time);
                            setIsReturnOpen(false);
                          }}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">No WhatsApp</label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="08..."
                      className={`w-full border rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none ${errors.whatsapp
                        ? 'border-red-500 ring-red-200 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#C9A86A]'
                        }`}
                      value={formData.whatsapp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, whatsapp: val });
                        if (errors.whatsapp) setErrors({ ...errors, whatsapp: false });
                      }}
                    />
                    {errors.whatsapp && <p className="text-red-500 text-xs mt-1">silahkan masukan nomor whatsapp anda</p>}

                    <p className="text-[10px] text-green-600 mt-1">*Mohon pastikan nomor yang Anda masukkan sudah benar.*</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Sekolah/Instansi</label>
                  <input
                    type="text"
                    placeholder="Masukkan Nama Sekolah / Instansi..."
                    className={`w-full border rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none ${errors.school
                      ? 'border-red-500 ring-red-200 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-[#C9A86A]'
                      }`}
                    value={formData.school}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^a-zA-Z0-9\s]/g, '');
                      setFormData({ ...formData, school: val });
                      if (errors.school) setErrors({ ...errors, school: false });
                    }}
                  />
                  {errors.school && <p className="text-red-500 text-xs mt-1">silahkan masukan contoh Asal Sekolah anda</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px] items-start">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jumlah Produk</label>
                  <div className="flex items-center justify-between border-2 border-[#8A6A4B] rounded-full px-4 py-2 w-[140px] text-[#8A6A4B] font-bold bg-[#FAF8F5]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#8A6A4B] hover:text-white rounded-full transition-colors pb-0.5"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setQuantity(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="w-12 text-center text-gray-900 text-base font-bold bg-transparent outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-[#8A6A4B] hover:text-white rounded-full transition-colors pb-0.5"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Metode Pembayaran</label>
                  <div className={`p-3 rounded-xl transition-all ${errors.paymentMethod ? 'border border-red-500 bg-red-50/30' : 'border border-transparent'}`}>
                    <div className="flex flex-wrap gap-2">
                      {['BCA', 'Mandiri', 'BRI', 'GoPay', 'Qris', 'Cash'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => {
                            setPaymentMethod(method);
                            if (errors.paymentMethod) setErrors({ ...errors, paymentMethod: false });
                          }}
                          className={`px-4 py-2 rounded-full border text-sm font-bold transition-all
                                   ${paymentMethod === method
                              ? 'bg-[#8A6A4B] border-[#8A6A4B] text-white shadow-md'
                              : 'bg-white border-gray-300 text-gray-600 hover:border-[#8A6A4B] hover:text-[#8A6A4B]'}
                                `}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                  {errors.paymentMethod && <p className="text-red-500 text-xs mt-1 ml-3">silahkan pilih metode pembayaran</p>}
                </div>
              </div>


              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Pesan</label>
                <textarea
                  rows={4}
                  placeholder="Tulis pesan di sini..."
                  className={`w-full border rounded-lg p-3 text-sm text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none resize-none transition-all ${errors.message
                    ? 'border-red-500 ring-red-200 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-[#C9A86A]'
                    }`}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors({ ...errors, message: false });
                  }}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">silahkan masukan pesan anda</p>}
              </div>

              <div className="pt-6 border-t border-dashed border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-500 font-bold">Total Biaya Sewa</p>
                  <h3 className="text-4xl font-bold text-gray-800">
                    Rp {totalPrice.toLocaleString('id-ID')} <span className="text-lg text-gray-500 font-medium">/ {totalDays} hari</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={async () => {

                    if (dbStatus !== 'Tersedia') {
                      setShowStatusModal(true);
                      return;
                    }
                    const isValid = validateBooking();
                    if (session) {
                      if (isValid) {
                        try {
                          const bookingData = {
                            userId: session.user?.email || 'unknown',
                            slug: product.slug,
                            startDate,
                            endDate,
                            pickupTime,
                            returnTime,
                            quantity,
                            totalPrice: calculateTotal().price,
                            paymentMethod,
                            userName: formData.name,
                            whatsapp: formData.whatsapp,
                            school: formData.school,
                            message: formData.message
                          };

                          await submitBookingForm(bookingData);
                          // Reset Form
                          setFormData({ name: '', whatsapp: '', school: '', message: '' });
                          setStartDate('');
                          setEndDate('');
                          setPickupTime('');
                          setReturnTime('');
                          setPaymentMethod('');
                          setQuantity(1);

                          setShowSuccessModal(true);
                        } catch (e) {
                          console.error('Booking failed', e);
                        }
                      }
                    } else {
                      setShowLoginModal(true);
                    }
                  }}
                  disabled={!isBookingValid}
                  className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1
                    ${isBookingValid
                      ? 'bg-[#322F2D] hover:bg-[#1E1C1B] text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:none transform-none'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Booking Sekarang
                </button>
              </div>

            </form>
          </div>
        </div>
      </div >

      {
        showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform scale-100 transition-transform duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Login Diperlukan</h3>
              <p className="text-gray-500 mb-8">
                Silakan login atau daftar terlebih dahulu untuk melakukan pemesanan barang.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <Link href="/login" className="px-6 py-2.5 rounded-lg bg-[#322F2D] text-white font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl">
                  Login / Daftar
                </Link>
              </div>
            </div>
          </div>
        )
      }

      {
        showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl transform scale-100 transition-transform duration-300 relative overflow-hidden">

              <div className="flex flex-col items-center text-center mb-6">
                <div className="flex items-center gap-2 text-red-600 mb-3">
                  <AlertTriangle className="w-6 h-6" />
                  <span className="font-bold text-lg tracking-wide">DISCLAIMER!!!</span>
                </div>
                <p className="text-red-500 text-sm font-medium leading-relaxed px-4">
                  “Silakan datang langsung untuk memastikan kualitas, warna, dan ukuran barang sesuai keinginan. Pemilihan dilakukan oleh pelanggan dan tidak dapat diganti setelah transaksi.”
                </p>
              </div>

              <div className="border-t border-gray-100 my-6"></div>

              <div className="flex flex-col items-center text-center mb-8">
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="font-bold text-lg tracking-wide uppercase">Pemberitahuan</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Terima kasih sudah menyewa. Kami akan menghubungi Anda lewat Nomor WhatsApp yang Anda masukkan untuk informasi berikutnya.
                </p>
                <p className="text-green-600 text-xs font-bold">
                  “Mohon pastikan nomor yang Anda masukkan sudah benar.”
                </p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-[#008000] hover:bg-[#006400] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Selesai
              </button>
            </div>
          </div>
        )
      }

      <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-dashed border-gray-300">
        <div className={`text-center mb-12 transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Produk Lainnya</h2>
          <p className="text-gray-500">Cari perlengkapan lain yang kamu butuhkan</p>
        </div>

        <div className="relative w-full">

          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between pointer-events-none z-10 px-2 md:-px-4">
            <button
              onClick={prevSlide}
              className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 text-gray-800 transition-all transform hover:scale-110 border border-gray-100 duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className={`pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 text-gray-800 transition-all transform hover:scale-110 border border-gray-100 duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div
            className="grid gap-4 md:gap-6 px-4 md:px-12 py-4"
            style={{
              gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`,
            }}
          >
            {visibleProducts.map((p, index) => (
              <Link
                href={`/${p.slug}`}
                key={index}
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`group block h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-700 ease-out border border-gray-100 flex flex-col transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                  }`}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-[#F2E6D8]">
                  <div className="absolute inset-0 bg-[#C9826B]/10 group-hover:bg-[#C9826B]/20 transition-colors duration-300" />
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    className="w-full h-full object-contain p-6 transform group-hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between bg-white relative z-20">
                  <div>
                    <h3 className="text-gray-900 font-bold text-lg md:text-xl mb-1 line-clamp-1 tracking-tight" title={p.name}>
                      {p.name}
                    </h3>
                    <div className="w-12 h-1 bg-[#E07D5F] rounded-full mb-3 opacity-50 group-hover:w-full transition-all duration-500 ease-in-out" />
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col">
                      <span className="text-[10px] md:text-xs text-gray-500 uppercase font-bold tracking-widest">Harga Sewa</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[#E07D5F] text-xl font-bold">{typeof p.price === 'string' ? p.price : `${(p.price / 1000)}k`}</span>
                        <span className="text-gray-400 text-sm font-medium">/ {p.duration}</span>
                      </div>
                    </div>
                    <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shadow-lg transition-all duration-300 ease-out cursor-pointer opacity-100 translate-y-0 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0">
                      Sewa
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {totalSlides > 1 && (
          <div className={`flex justify-center gap-2 mt-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${currentSlide === index
                  ? 'bg-[#E07D5F] w-8 h-2'
                  : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        )}
      </div>


      <AnimatePresence>
        {showStatusModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-dm-sans"
            onClick={() => setShowStatusModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-4 ring-red-50/50">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Barang Tidak Tersedia
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed mb-8">
                  "Mohon maaf, stok barang ini sedang kosong atau dalam masa perawatan. Silakan pilih produk lain."
                </p>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => setShowStatusModal(false)}
                    className="w-full py-3.5 bg-[#322F2D] hover:bg-[#1E1C1B] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Pilih Produk Lain
                  </button>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section >
  );
}