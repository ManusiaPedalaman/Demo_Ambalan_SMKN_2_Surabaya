'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

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
                case 0: result = await deleteMateri(deleteItemId); if (result.success) setMateriData(p => p.filter(i => i.id !== deleteItemId)); break;
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

        const handleDelete = async () => {

            setDeleteItemId(itemId);
            setIsDeleteModalOpen(true);
        };

        const handleDetail = () => {
            router.push(`/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/latihan/detail/${itemId}`);
        };


        switch (activeCard) {
            case 0: 
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
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Nama Materi</th>
                                <th className="px-6 py-4 font-bold text-gray-700 border border-gray-300">Topik</th>
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
                <h1 className="text-2xl font-bold text-gray-800">Latihan</h1>
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
                            {activeCard === 0 ? 'Materi Latihan' : stats[activeCard].title.replace('Total ', '')}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Data {stats[activeCard].title}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        {[0].includes(activeCard) && (
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 border border-green-500 text-green-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors"
                            >
                                <FileSpreadsheet size={18} />
                                <span>Sheets</span>
                            </button>
                        )}



                        {activeCard === 5 && ( 
                            <button className="flex items-center gap-2 bg-[#8B6E4A] hover:bg-[#7a5f3d] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors">
                                <Plus size={18} />
                                <span>Produk</span>
                            </button>
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
                                    case 0: return materiData.length;
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