'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
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

export default function DashboardPage() {
    const { data: session } = useSession();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [activeCard, setActiveCard] = useState<number>(0);

    useEffect(() => {
        const savedImage = localStorage.getItem('userAvatar');
        if (savedImage) {
            setPreviewImage(savedImage);
        }
    }, []);


    const [joinsData, setJoinsData] = useState<any[]>([]);
    const [bookingsData, setBookingsData] = useState<any[]>([]);
    const [contactsData, setContactsData] = useState<any[]>([]);
    const [rentersData, setRentersData] = useState<any[]>([]);
    const [userData, setUserData] = useState<any[]>([]);
    const [materiData, setMateriData] = useState<any[]>([]);
    const [productData, setProductData] = useState<any[]>([]);
    const [adminData, setAdminData] = useState<any[]>([]);

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

    const [loading, setLoading] = useState(true);


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const executeDelete = async () => {
        if (!deleteItemId) return;
        setIsDeleting(true);
        try {
            let result: any = { success: false, error: '' };
            switch (activeCard) {
                case 0: result = await deleteJoinMember(deleteItemId); if (result.success) setJoinsData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 1: result = await deleteBooking(deleteItemId); if (result.success) setBookingsData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 2: result = await deleteContactMessage(deleteItemId); if (result.success) setContactsData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 3:
                    result = await deleteRenter(deleteItemId);
                    if (result.success) {
                        setRentersData(p => p.filter(i => i.id !== deleteItemId));

                        getBookingsList().then(setBookingsData);
                    }
                    break;
                case 4: result = await deleteUser(deleteItemId); if (result.success) setUserData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 5: result = await deleteProduct(deleteItemId); if (result.success) setProductData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 6: result = await deleteAdmin(deleteItemId); if (result.success) setAdminData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 7: result = await deleteMateri(deleteItemId); if (result.success) setMateriData(p => p.filter(i => i.id !== deleteItemId)); break;
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


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {

                const counts = await getDashboardStats();
                setStatsCounts(counts);


                const admins = await getAdminUsers();
                setAdminData(admins);


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


    const stats = [
        {
            id: 0,
            title: 'Total Anggota yang Join',
            value: `${statsCounts.joinsCount} Anggota Join`,
            icon: BarChart3,
            subText: statsCounts.joinsCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 1,
            title: 'Total Produk yang Tersewa',
            value: `${statsCounts.bookingsCount} Produk Tersewa`,
            icon: FileText,
            subText: statsCounts.bookingsCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 2,
            title: 'Total User yang Hubungi',
            value: `${statsCounts.contactsCount} User Hubungi`,
            icon: BarChart3,
            subText: statsCounts.contactsCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 3,
            title: 'Total User yang Menyewa',
            value: `${statsCounts.rentersCount} User Menyewa`,
            icon: Users,
            subText: statsCounts.rentersCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 4,
            title: 'Total User yang Login',
            value: `${statsCounts.userCount} User Login`,
            icon: Home,
            subText: statsCounts.userCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 5,
            title: 'Total Produk yang Tersedia',
            value: `${statsCounts.productCount} Produk Tersedia`,
            icon: Package,
            subText: statsCounts.productCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 6,
            title: 'Jumlah Admin',
            value: `${statsCounts.adminCount} Admin`,
            icon: UserCog,
            subText: statsCounts.adminCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 7,
            title: 'Total Materi Latihan',
            value: `${statsCounts.eventCount} Materi`,
            icon: Layers,
            subText: statsCounts.eventCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
    ];


    const ActionButton = ({ itemId, index, totalItems }: { itemId: string; index: number; totalItems: number }) => {
        const router = useRouter();
        const [isOpen, setIsOpen] = useState(false);
        const [isDeleting, setIsDeleting] = useState(false);
        let menuItems: { label: string; color?: string; action?: string }[] = [];

        const handleUpdateStatus = async (status: string) => {

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
            if (activeCard === 7) {

                router.push(`/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan/detail/${itemId}`);
                return;
            }

            let type = '';
            let basePath = '';


            if (activeCard === 1) { type = 'booking'; basePath = 'produk'; }
            else if (activeCard === 3) { type = 'renter'; basePath = 'produk'; }
            else if (activeCard === 5) { type = 'product'; basePath = 'produk'; }
            else if (activeCard === 0) { type = 'join'; basePath = 'user'; }
            else if (activeCard === 2) { type = 'contact'; basePath = 'user'; }
            else if (activeCard === 4) { type = 'user_login'; basePath = 'user'; }
            else if (activeCard === 6) { type = 'admin'; basePath = 'user'; }

            if (type && basePath) {
                router.push(`/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/${basePath}/detail/${itemId}?type=${type}`);
            }
        };


        switch (activeCard) {
            case 1:
                menuItems = [
                    { label: 'Sudah', action: 'status_sudah' },
                    { label: 'Belum', color: 'text-red-600', action: 'status_belum' },
                    { label: 'Detail', action: 'detail' }
                ];
                break;

            case 5:
                menuItems = [
                    { label: 'Tersedia', action: 'status_tersedia' },
                    { label: 'Tidak Tersedia', color: 'text-red-600', action: 'status_tidak_tersedia' },
                    { label: 'Detail', action: 'detail' },
                    { label: 'Hapus', action: 'delete' }
                ];
                break;

            case 3:
                menuItems = [
                    { label: 'Sudah', action: 'status_bayar_sudah' },
                    { label: 'Belum', color: 'text-red-600', action: 'status_bayar_belum' },
                    { label: 'Detail', action: 'detail' },
                    { label: 'Hapus', color: 'text-red-600', action: 'delete' }
                ];
                break;





            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
                menuItems = [
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


    const handleExport = () => {
        let title = '';
        let formattedData: any[] = [];


        switch (activeCard) {

            case 0:
                title = 'Data_Anggota_Join';
                formattedData = joinsData.map(item => ({
                    'Nama Lengkap': item.nama,
                    'Tanggal Lahir': item.tanggal_lahir,
                    'No WhatsApp': item.no_wa,
                    'Asal Sekolah': item.sekolah || item.asal_sekolah,
                    'Kelas': item.kelas,
                    'Jurusan': item.jurusan,
                    'Pesan': item.pesan
                }));
                break;

            case 1:
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

            case 2:
                title = 'Data_User_Hubungi';
                formattedData = contactsData.map(item => ({
                    'Nama Lengkap': item.nama,
                    'Email': item.email,
                    'No Phone': item.phone,
                    'Pesan': item.message,
                    'Status': item.status || 'Belum Terjawab'
                }));
                break;

            case 3:
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

            case 4:
                title = 'Data_User_Login';
                formattedData = userData.map(item => ({
                    'Email User': item.email,
                    'Role': item.role || 'User',
                    'Status': 'Aktif'
                }));
                break;

            case 5:
                title = 'Data_Produk_Tersedia';
                formattedData = productData.map(item => ({
                    'ID Produk': item.id,
                    'Nama Produk': item.nama,
                    'Status': item.status || 'Tersedia'
                }));
                break;

            case 6:
                title = 'Data_Admin_Terdaftar';
                formattedData = adminData.map(item => ({
                    'Username': item.username,
                    'Email': item.email,
                    'Status': 'Admin'
                }));
                break;

            case 7:
                title = 'Data_Materi_Latihan';
                formattedData = materiData.map(item => ({
                    'ID Materi': item.id,
                    'Nama Materi': item.nama,
                    'Topik': Array.isArray(item.topik) ? item.topik.join(', ') : item.topik
                }));
                break;
            default:
                return;
        }

        if (formattedData.length === 0) {
            alert('Tidak ada data untuk diexport');
            return;
        }


        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);


        const range = XLSX.utils.decode_range(ws['!ref']!);


        const borderStyle = {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
        };


        for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                if (!ws[cellRef]) continue;


                if (!ws[cellRef].s) ws[cellRef].s = {};


                ws[cellRef].s.border = borderStyle;


                if (R === 0) {
                    ws[cellRef].s.font = { bold: true };
                    ws[cellRef].s.fill = { fgColor: { rgb: "EEEEEE" } };
                }
            }
        }


        const cols = Object.keys(formattedData[0]).map(() => ({ wch: 20 }));
        ws['!cols'] = cols;

        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");


        XLSX.writeFile(wb, `${title}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };


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
            case 0:
                if (joinsData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada data anggota yang join.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Nama Lengkap</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Tanggal Lahir</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">No WA</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Asal Sekolah</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Kelas</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Jurusan</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {joinsData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.nama}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.tanggal_lahir}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.no_wa}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.sekolah}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.kelas}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-[150px] border border-gray-300">{item.jurusan}</td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={joinsData.length} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                );

            case 1:
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

            case 2:
                if (contactsData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada data pesan masuk.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Nama Lengkap</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Email</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Phone</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Pesan</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactsData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.nama}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.email}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.phone}</td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px] border border-gray-300">{item.pesan}</td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={contactsData.length} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                );

            case 3:
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
                                            : 'bg-green-100 text-green-700'
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

            case 4:
                if (userData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada user login.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Email</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Role</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.email}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.status}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                                            {item.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={userData.length} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                );

            case 5:
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
            case 6: 
                if (adminData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada data admin.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Username</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Email</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Role</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Tanggal Buat</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.username}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.email}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">
                                            {item.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.created_at}</td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={adminData.length} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </>
                );
            case 7: 
                if (materiData.length === 0) {
                    return (
                        <tbody>
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Belum ada materi latihan.</td>
                            </tr>
                        </tbody>
                    );
                }
                return (
                    <>
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">ID Materi</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Nama Produk</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-700 text-center border border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiData.map((item, idx) => (
                                <tr key={idx} className={`${idx % 2 === 0 ? 'bg-[#F6F1EB]' : 'bg-white'} hover:bg-[#EBE5DE] transition-colors border-b border-gray-100/50`}>
                                    <td className="px-6 py-4 font-medium text-gray-600 border border-gray-300">{item.id}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">{item.nama}</td>
                                    <td className="px-6 py-4 text-gray-600 border border-gray-300">
                                        <div className="flex gap-2">
                                            {item.topik.map((t: string, i: number) => (
                                                <span key={i} className="px-2 py-1 bg-[#D4C3A3] text-[#5A4633] rounded text-xs font-bold">
                                                    {t.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center border border-gray-300">
                                        <ActionButton itemId={item.id} index={idx} totalItems={materiData.length} />
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

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
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


            <div className="mb-10 w-full overflow-x-auto pb-4 scrollbar-hide">
                <div className="flex gap-4 min-w-max">
                    {stats.map((stat, index) => {
                        const isActive = activeCard === index;
                        return (
                            <div
                                key={index}
                                onClick={() => setActiveCard(index)}
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


            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] p-6">


                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#8B6E4A]">
                            {activeCard === 0 ? 'Anggota yang Join' : stats[activeCard].title.replace('Total ', '')}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Data {stats[activeCard].title}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {[1, 3, 5, 7].includes(activeCard) && (
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 border border-green-500 text-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors"
                            >
                                <FileSpreadsheet size={18} />
                                <span>Sheets</span>
                            </button>
                        )}

                        {activeCard === 5 && (
                            <Link href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/produk" className="flex items-center gap-2 bg-[#8B6E4A] hover:bg-[#7a5f3d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                <Plus size={18} />
                                <span>Produk</span>
                            </Link>
                        )}
                        {activeCard === 7 && (
                            <Link href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan" className="flex items-center gap-2 bg-[#8B6E4A] hover:bg-[#7a5f3d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                <span>Detail</span>
                            </Link>
                        )}

                        {[0, 2, 4, 6].includes(activeCard) && (
                            <Link href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/user" className="bg-[#8B6E4A] hover:bg-[#7a5f3d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                Detail
                            </Link>
                        )}

                        {[1, 3].includes(activeCard) && (
                            <Link href="/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/produk" className="bg-[#8B6E4A] hover:bg-[#7a5f3d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                Detail
                            </Link>
                        )}
                    </div>
                </div >


                <div className="w-full overflow-x-auto border border-gray-200 rounded-xl">
                    <table className="w-full text-sm text-left">
                        {renderContent()}
                    </table>
                </div >


                <div className="flex items-center justify-between mt-6 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        <span>Rows :</span>
                        <div className="bg-[#F2EAE0] text-gray-700 px-2 py-1 rounded">
                            {(() => {
                                switch (activeCard) {
                                    case 0: return joinsData.length;
                                    case 1: return bookingsData.length;
                                    case 2: return contactsData.length;
                                    case 3: return rentersData.length;
                                    case 4: return userData.length;
                                    case 5: return productData.length;
                                    case 6: return adminData.length;
                                    case 7: return materiData.length;
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