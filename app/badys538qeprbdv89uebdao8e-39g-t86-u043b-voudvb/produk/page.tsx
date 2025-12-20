'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
// import { supabase } from '@/lib/supabase'; // Removed direct Supabase usage
import { useRouter } from 'next/navigation';
import {
    Users,
    Package,
    BarChart3,
    UserCog,
    Home,
    User,
    FileText,
    Layers,
    Plus,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    FileSpreadsheet
} from 'lucide-react';
import {
    getDashboardStats,
    getAdminUsers,
    getJoinsList,
    getBookingsList,

    getContactsList,
    getRentersList,
    getUsersList,
    getMateriList,
    getProductsList,
    deleteJoinMember,
    deleteRenter,
    deleteUser,
    deleteAdmin,
    deleteContactMessage,
    deleteProduct,
    deleteMateri,
    deleteBooking,
    updateProductStatus,
    updateBookingStatus,
    updateRenterPaymentStatus
} from '@/app/actions';
import XLSX from 'xlsx-js-style';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, CheckCircle2 } from 'lucide-react';

// --- CHART COMPONENT ---
const MonthlyChart = ({ data, color = '#997B55', label }: { data: number[]; color?: string; label: string }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Determine scale max (round up to nearest 10)
    const rawMax = Math.max(...data, 10);
    const maxVal = Math.ceil(rawMax / 10) * 10;

    // Create 5 steps for Y-axis (0, 20%, 40%, 60%, 80%, 100% of maxVal)
    // Actually let's just do 5 intervals -> 6 lines (0, 1/5, 2/5 ...)
    const steps = 5;

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 font-dm-sans">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700">{label}</h3>
                <div className="text-sm text-gray-400">Tahun ini</div>
            </div>

            <div className="flex gap-4">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[10px] text-gray-400 py-1 h-64 text-right min-w-[20px]">
                    {[...Array(steps + 1)].map((_, i) => {
                        // Reverse index for rendering top-to-bottom
                        const val = Math.round((maxVal / steps) * (steps - i));
                        return <span key={i}>{val.toString().padStart(2, '0')}</span>;
                    })}
                </div>

                {/* Chart Area */}
                <div className="relative h-64 flex-1 flex items-end justify-between gap-2">
                    {/* Y-Axis Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[...Array(steps + 1)].map((_, i) => (
                            <div key={i} className={`w-full border-b border-gray-100 ${i === 0 ? 'border-solid border-gray-200' : 'border-dashed'}`} />
                        ))}
                    </div>

                    {/* Bars */}
                    {data.map((val, idx) => (
                        <div key={idx} className="flex flex-col items-center flex-1 z-10 group h-full justify-end">
                            <div className="relative w-full flex justify-center items-end h-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(val / maxVal) * 100}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                                    className="w-3/4 rounded-t-lg relative"
                                    style={{ backgroundColor: color }}
                                >
                                    {/* Tooltip */}
                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-20">
                                        {val} Record
                                    </div>
                                </motion.div>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-2 font-medium">{months[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function DashboardPage() {
    const { data: session } = useSession();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // State to track active card
    const [activeCard, setActiveCard] = useState<number>(1);

    useEffect(() => {
        const savedImage = localStorage.getItem('userAvatar');
        if (savedImage) {
            setPreviewImage(savedImage);
        }
    }, []);

    // --- REAL DATA STATE ---
    const [joinsData, setJoinsData] = useState<any[]>([]);
    const [bookingsData, setBookingsData] = useState<any[]>([]);
    const [contactsData, setContactsData] = useState<any[]>([]);
    const [rentersData, setRentersData] = useState<any[]>([]);
    const [userData, setUserData] = useState<any[]>([]); // New State for Users
    const [materiData, setMateriData] = useState<any[]>([]); // New State for Materi
    const [productData, setProductData] = useState<any[]>([]); // New State for Products
    const [adminData, setAdminData] = useState<any[]>([]); // New State for Admins
    const [statsCounts, setStatsCounts] = useState({
        adminCount: 0,
        userCount: 0,
        productCount: 0,
        eventCount: 0,
        joinsCount: 0,
        bookingsCount: 0,
        contactsCount: 0,
        rentersCount: 0
    });

    // Monthly Data for Charts
    const [bookingsChart, setBookingsChart] = useState<number[]>(new Array(12).fill(0));
    const [rentersChart, setRentersChart] = useState<number[]>(new Array(12).fill(0));

    useEffect(() => {
        const monthlyCounts = new Array(12).fill(0);

        bookingsData.forEach(item => {
            let dateStr = item.start_date || ''; // Assuming Booking structure

            if (dateStr && dateStr !== '-') {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    monthlyCounts[d.getMonth()]++;
                }
            }
        });

        setBookingsChart(monthlyCounts);
        setRentersChart([...monthlyCounts]); // Renters follow the same timeline as bookings
    }, [bookingsData]);

    const [loading, setLoading] = useState(true);

    // --- DELETE MODAL STATE ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const executeDelete = async () => {
        if (!deleteItemId) return;
        setIsDeleting(true);
        try {
            let result: any = { success: false, error: '' };
            switch (activeCard) {
                case 1: result = await deleteBooking(deleteItemId); if (result.success) setBookingsData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 3:
                    result = await deleteRenter(deleteItemId);
                    if (result.success) {
                        setRentersData(p => p.filter(i => i.id !== deleteItemId));
                        // Refresh bookings to reflect cascading delete
                        getBookingsList().then(setBookingsData);
                    }
                    break;
                case 5: result = await deleteProduct(deleteItemId); if (result.success) setProductData(p => p.filter(i => i.id !== deleteItemId)); break;
            }

            if (!result.success) {
                alert('Gagal menghapus: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat menghapus data.');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setDeleteItemId(null);
        }
    };

    // --- FETCH DATA FROM SERVER ACTIONS ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Stats
                const counts = await getDashboardStats();
                setStatsCounts(counts);

                // 2. Fetch Admin List
                const admins = await getAdminUsers();
                setAdminData(admins);

                // 3. Fetch Lists via Server Actions
                const joins = await getJoinsList();
                setJoinsData(joins);

                const bookings = await getBookingsList();
                setBookingsData(bookings);

                const contacts = await getContactsList();
                setContactsData(contacts);

                const renters = await getRentersList();
                setRentersData(renters);

                const users = await getUsersList();
                setUserData(users);

                const materi = await getMateriList();
                setMateriData(materi);

                const products = await getProductsList();
                setProductData(products);

            } catch (error) {
                console.error('Dashboard Fetch Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 8 Summary Cards Data (Dynamic Values)
    const stats = [
        {
            id: 1,
            title: 'Total Produk yang Tersewa',
            value: `${statsCounts.bookingsCount} Produk Tersewa`,
            icon: FileText,
            subText: statsCounts.bookingsCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 3,
            title: 'Total User yang Menyewa',
            value: `${statsCounts.rentersCount} User Menyewa`,
            icon: Users,
            subText: statsCounts.rentersCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 5,
            title: 'Total Produk yang Tersedia',
            value: `${statsCounts.productCount} Produk Tersedia`,
            icon: Package,
            subText: statsCounts.productCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
    ];

    // Helper to render Action Button
    // Moved useRouter outside of component loop if possible, but ActionButton is component inside component.
    // Better to use useRouter at top level and pass router or navigation function? NO, hook rule.
    // So ActionButton must use hook if it's a component.
    const ActionButton = ({ itemId, index, totalItems }: { itemId: string; index: number; totalItems: number }) => {
        const router = useRouter(); // Using hook here is valid since ActionButton is a React Component
        const [isOpen, setIsOpen] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);
        let menuItems: { label: string; color?: string; action?: string }[] = [];

        const handleUpdateStatus = async (status: string) => {
            // Optimistic update
            setProductData(prev => prev.map(item =>
                item.id === itemId ? { ...item, status } : item
            ));
            setIsOpen(false);

            try {
                const result: any = await updateProductStatus(itemId, status);
                if (!result.success) {
                    throw new Error(result.error);
                }
            } catch (error) {
                console.error('Failed to update status:', error);
                alert('Gagal mengubah status produk');
            }
        };

        const handleDelete = async () => {
            setDeleteItemId(itemId);
            setIsDeleteModalOpen(true);
        };

        const handleDetail = () => {
            let type = 'product';
            if (activeCard === 1) type = 'booking';
            else if (activeCard === 3) type = 'renter';
            else if (activeCard === 5) type = 'product';

            router.push(`/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/produk/detail/${itemId}?type=${type}`);
        };

        // Define menu items based on activeCard
        switch (activeCard) {
            case 1: // Produk Tersewa
                menuItems = [
                    { label: 'Sudah', action: 'status_sudah' },
                    { label: 'Belum', color: 'text-red-600', action: 'status_belum' },
                    { label: 'Detail', action: 'detail' }
                ];
                break;
            case 5: // Produk Tersedia (Tersedia/Tidak Tersedia/Hapus)
                menuItems = [
                    { label: 'Tersedia', action: 'status_tersedia' },
                    { label: 'Tidak Tersedia', color: 'text-red-600', action: 'status_tidak_tersedia' },
                    { label: 'Hapus', action: 'delete' } // Detail for product not explicitly requested in list but good to have? Design shows Detail page for Products.
                    // Wait, looking at the code I'm replacing... case 5 didn't have Detail in my previous view? 
                    // Let's check the code snippet I saw earlier (lines 323-327).
                    // It had: Tersedia, Tidak Tersedia, Hapus. No Detail.
                    // User Request: "ketika admin klik detail pada action di ketiga tabel" -> So I MUST add Detail to activeCard 5 too.
                ];
                // Updating to include Detail
                menuItems = [
                    { label: 'Tersedia', action: 'status_tersedia' },
                    { label: 'Tidak Tersedia', color: 'text-red-600', action: 'status_tidak_tersedia' },
                    { label: 'Detail', action: 'detail' },
                    { label: 'Hapus', action: 'delete' }
                ];
                break;
            case 3: // Renters
                menuItems = [
                    { label: 'Sudah', action: 'status_bayar_sudah' },
                    { label: 'Belum', color: 'text-red-600', action: 'status_bayar_belum' },
                    { label: 'Detail', action: 'detail' },
                    { label: 'Hapus', color: 'text-red-600', action: 'delete' }
                ];
                break;
            default:
                menuItems = [{ label: 'Detail', action: 'detail' }];
        }

        return (
            <div className="relative inline-block font-dm-sans">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }}
                    disabled={isDeleting}
                    className={`text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 ${isOpen ? 'bg-gray-100 text-gray-600' : ''}`}
                >
                    <MoreHorizontal size={18} />
                </button>

                {isOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                {isOpen && (
                    <div className={`absolute right-full mr-2 w-32 bg-white shadow-lg rounded-lg border border-gray-100 z-50 overflow-hidden ${index < totalItems / 2 ? 'top-0' : 'bottom-0'
                        }`}>
                        {menuItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.action === 'delete') {
                                        handleDelete();
                                    } else if (item.action === 'detail') {
                                        handleDetail();
                                    } else if (item.action === 'status_tersedia') {
                                        handleUpdateStatus('Tersedia');
                                    } else if (item.action === 'status_tidak_tersedia') {
                                        handleUpdateStatus('Tidak Tersedia');
                                    } else if (item.action === 'status_sudah') {
                                        setBookingsData(prev => prev.map(booking =>
                                            booking.id === itemId ? { ...booking, status: 'Sudah' } : booking
                                        ));
                                        setIsOpen(false);
                                        updateBookingStatus(itemId, 'Sudah').catch(e => console.error(e));
                                    } else if (item.action === 'status_belum') {
                                        setBookingsData(prev => prev.map(booking =>
                                            booking.id === itemId ? { ...booking, status: 'Belum' } : booking
                                        ));
                                        setIsOpen(false);
                                        updateBookingStatus(itemId, 'Belum').catch(e => console.error(e));
                                    } else if (item.action === 'status_bayar_sudah') {
                                        setRentersData(prev => prev.map(renter =>
                                            renter.id === itemId ? { ...renter, status_bayar: 'Sudah' } : renter
                                        ));
                                        setIsOpen(false);
                                        updateRenterPaymentStatus(itemId, 'Sudah').catch(e => console.error(e));
                                    } else if (item.action === 'status_bayar_belum') {
                                        setRentersData(prev => prev.map(renter =>
                                            renter.id === itemId ? { ...renter, status_bayar: 'Belum' } : renter
                                        ));
                                        setIsOpen(false);
                                        updateRenterPaymentStatus(itemId, 'Belum').catch(e => console.error(e));
                                    } else {
                                        setIsOpen(false);
                                    }
                                }}
                                className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${item.color || 'text-gray-700'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // --- EXPORT FUNCTIONS ---
    const handleExport = () => {
        let title = '';
        let formattedData: any[] = [];

        // Helper to format specific fields
        switch (activeCard) {
            case 1: // Produk Tersewa
                title = 'Data_Produk_Tersewa';
                formattedData = bookingsData.map(item => ({
                    'Nama Peminjam': item.user_info?.name || item.user_id || '-',
                    'Nama Produk': item.product_slug,
                    'Tanggal Ambil': item.start_date,
                    'Tanggal Kembali': item.end_date,
                    'Jam Sewa': `${item.pickup_time || '-'} - ${item.return_time || '-'}`,
                    'Jumlah (Qty)': item.quantity,
                    'Status': 'Tersewa'
                }));
                break;
            case 3: // User Penyewa (Renters)
                title = 'Data_User_Penyewa';
                formattedData = rentersData.map(item => ({
                    'Nama Customer': item.nama_customer,
                    'Sekolah / Instansi': item.sekolah_instansi,
                    'Produk Disewa': item.produk_disewa,
                    'No WhatsApp': item.no_wa,
                    'Metode Bayar': item.metode_bayar,
                    'Jam Sewa': `${item.jam_pengambilan || '-'} - ${item.jam_pengembalian || '-'}`
                }));
                break;
            case 5: // Produk Tersedia
                title = 'Data_Produk_Tersedia';
                formattedData = productData.map(item => ({
                    'ID Produk': item.id,
                    'Nama Produk': item.nama,
                    'Status': item.status || 'Tersedia'
                }));
                break;
            default:
                return;
        }

        if (formattedData.length === 0) {
            alert('Tidak ada data untuk diexport');
            return;
        }

        // --- Create Workbook & Sheet ---
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);

        // --- Apply Styling (Borders for All Cells) ---
        const range = XLSX.utils.decode_range(ws['!ref']!);

        // Define Border Style
        const borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        };

        // Apply style to every cell in range
        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellRef]) continue;

                // Initialize s (style) object if not present
                if (!ws[cellRef].s) ws[cellRef].s = {};

                // Apply borders
                ws[cellRef].s.border = borderStyle;

                // Optional: Make header bold
                if (R === 0) {
                    ws[cellRef].s.font = { bold: true };
                    ws[cellRef].s.fill = { fgColor: { rgb: "EEEEEE" } };
                }
            }
        }

        // Set column widths (optional, auto-width approximation)
        const cols = Object.keys(formattedData[0]).map(() => ({ wch: 20 }));
        ws['!cols'] = cols;

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

        // --- Trigger Download ---
        XLSX.writeFile(wb, `${title}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    // --- RENDER CONTENT BASED ON ACTIVE CARD ---
    const renderContent = () => {
        if (loading) {
            return (
                <tbody>
                    <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-400">Loading data...</td>
                    </tr>
                </tbody>
            );
        }

        switch (activeCard) {
            case 1: // Produk yang Tersewa
                if (bookingsData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada produk yang disewa.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Nama Peminjam</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Produk</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Tgl Ambil</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Tgl Kembali</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Jam</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Jumlah Produk</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingsData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.user_info?.name || item.user_id || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.product_slug}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.start_date}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.end_date}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.pickup_time} - {item.return_time}</td>
                                    <td className="px-6 py-4 border border-gray-300">
                                        <span className={`px-3 py-1 rounded-md text-xs font-semibold ${item.status === 'Belum'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {item.quantity} Unit
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={bookingsData.length} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                );
            case 3: // User yang Menyewa
                if (rentersData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada user menyewa.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Nama Customer</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Sekolah/Instansi</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Produk</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Jam Sewa</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">No WA</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Metode Bayar</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentersData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.nama_customer}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.sekolah_instansi}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-[150px] border border-gray-300">{item.produk_disewa}</td>
                                    <td className="px-6 py-4 text-gray-600 font-medium border border-gray-300">
                                        {item.jam_pengambilan} - {item.jam_pengembalian}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.no_wa}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status_bayar === 'Belum'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700' // Matches the "Sudah" / Active color style
                                            }`}>
                                            {item.metode_bayar}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={rentersData.length} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                );
            case 5: // Produk yang Tersedia
                if (productData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada produk tersedia.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">ID Produk</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Nama Produk</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Harga</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.id}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.nama}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">
                                        {/* @ts-ignore */}
                                        <span dangerouslySetInnerHTML={{ __html: (item.price || '-').replace(' / ', '<span class="text-xs text-gray-400">/</span>').replace(/(\d+k)/, '<span class="text-[#EF4444] font-bold">$1</span>') }} />
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Tersedia'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={productData.length} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                );
            default:
                return (
                    <tbody>
                        <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-400">
                                Data untuk kategori ini belum tersedia.
                            </td>
                        </tr>
                    </tbody>
                );
        }
    };

    return (
        <div className="font-dm-sans min-h-screen p-4 md:p-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Produk</h1>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative">
                        {previewImage || session?.user?.image ? (
                            <Image src={previewImage || session?.user?.image || ''} alt="Profile" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#8B6E4A] text-white text-xs font-bold">
                                {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'AD'}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{session?.user?.name || 'Jamal'}</span>
                        <span className="text-[10px] text-gray-400">{session?.user?.email || 'backoffice@gmail.com'}</span>
                    </div>
                </div>
            </div>

            {/* Scale-able Card Grid/Scroll - 8 Items */}
            <div className="mb-10 w-full overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                    {stats.map((stat, index) => {
                        const isActive = activeCard === stat.id;
                        return (
                            <div
                                key={index}
                                onClick={() => setActiveCard(stat.id)}
                                className={`
                                    cursor-pointer transition-all duration-300 ease-in-out
                                    min-w-[240px] w-[240px] p-5 rounded-xl border flex flex-col justify-between min-h-[100px] shadow-sm
                                    ${isActive
                                        ? 'bg-[#9C7C5B] border-[#9C7C5B] text-white transform scale-100 shadow-md ring-2 ring-[#9C7C5B]/20'
                                        : 'bg-white border-gray-100 text-gray-600 hover:border-[#9C7C5B] hover:shadow'
                                    }
                                `}
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20 text-white' : 'bg-[#F9F5F0] text-[#9C7C5B]'}`}>
                                        <stat.icon size={18} />
                                    </div>
                                    <div className="flex items-center text-[10px] gap-1 opacity-80">
                                        <span>{stat.subText}</span>
                                        <span className="bg-gray-400/30 rounded-full p-[2px]"><MoreHorizontal size={8} /></span>
                                    </div>
                                </div>
                                <div>
                                    <p className={`text-[10px] font-medium mb-1 ${isActive ? 'text-white/90' : 'text-gray-400'}`}>
                                        {stat.title}
                                    </p>
                                    <h3 className={`text-base font-bold ${isActive ? 'text-white' : 'text-gray-800'}`}>
                                        {stat.value}
                                    </h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Dynamic Content Section */}
            {activeCard === 1 && (
                <MonthlyChart data={bookingsChart} label="Produk Tersewa" color="#997B55" />
            )}
            {activeCard === 3 && (
                <MonthlyChart data={rentersChart} label="User Menyewa" color="#997B55" />
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] p-6">

                {/* Table Header / Title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#8B6E4A]">
                            {stats.find(s => s.id === activeCard)?.title.replace('Total ', '') || 'Detail Data'}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Data {stats.find(s => s.id === activeCard)?.title || ''}
                        </p>
                    </div>
                    {/* Optional: Filter / Detail Button */}
                    <div className="flex items-center gap-3">
                        {/* Show Sheets Button for appropriate cards */}
                        {[1, 3, 5, 7].includes(activeCard) && (
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 border border-green-500 text-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors"
                            >
                                <FileSpreadsheet size={18} />
                                <span>Sheets</span>
                            </button>
                        )}

                        {/* Specific Action Buttons */}
                        {/* Specific Action Buttons - ADD (+ Button) */}
                        {activeCard === 5 && ( // Produk Tersedia
                            <button className="flex items-center gap-2 bg-[#8B6E4A] hover:bg-[#7a5f3d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                <Plus size={18} />
                                <span>Produk</span>
                            </button>
                        )}
                        {activeCard === 7 && ( // Materi
                            <Link href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan" className="flex items-center gap-2 bg-[#8B6E4A] hover:bg-[#7a5f3d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                <span>Detail</span>
                            </Link>
                        )}


                    </div>
                </div >

                {/* Table */}
                <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-sm text-left">
                        {renderContent()}
                    </table>
                </div >

                {/* Pagination Footer */}
                <div className="flex items-center justify-between mt-6 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <span>Rows :</span>
                        <div className="bg-[#F2EAE0] text-gray-700 px-2 py-1 rounded">
                            {(() => {
                                switch (activeCard) {
                                    case 1: return bookingsData.length;
                                    case 3: return rentersData.length;
                                    case 5: return productData.length;
                                    default: return 0;
                                }
                            })()}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>1 of 2 Page</span>
                        <div className="flex gap-2 text-gray-400">
                            <button className="hover:text-gray-800"><ChevronLeft size={16} /></button>
                            <button className="hover:text-gray-800"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div >

            </div>
            {/* === DELETE CONFIRMATION MODAL === */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-dm-sans"
                        onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle size={32} className="text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Data?</h3>
                                <p className="text-gray-500 text-sm mb-6">
                                    "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
                                </p>

                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={executeDelete}
                                        disabled={isDeleting}
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isDeleting ? <Loader2 size={18} className="animate-spin" /> : 'Hapus'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}