'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    getContactsList,
    getUsersList,
    deleteJoinMember,
    deleteUser,
    deleteAdmin,
    deleteContactMessage
} from '@/app/actions';
import XLSX from 'xlsx-js-style';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Loader2, CheckCircle2 } from 'lucide-react';


const MonthlyChart = ({ data, color = '#997B55', label }: { data: number[]; color?: string; label: string }) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const rawMax = Math.max(...data, 10);
    const maxVal = Math.ceil(rawMax / 10) * 10;
    const steps = 5;

    return (
        <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 font-dm-sans">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700">{label}</h3>
                <div className="text-sm text-gray-400">Tahun ini</div>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col justify-between text-[10px] text-gray-400 py-1 h-64 text-right min-w-[20px]">
                    {[...Array(steps + 1)].map((_, i) => {
                        const val = Math.round((maxVal / steps) * (steps - i));
                        return <span key={i}>{val.toString().padStart(2, '0')}</span>;
                    })}
                </div>
                <div className="relative h-64 flex-1 flex items-end justify-between gap-2">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[...Array(steps + 1)].map((_, i) => (
                            <div key={i} className={`w-full border-b border-gray-100 ${i === 0 ? 'border-solid border-gray-200' : 'border-dashed'}`} />
                        ))}
                    </div>
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


    const [activeCard, setActiveCard] = useState<number>(0);

    useEffect(() => {
        const savedImage = localStorage.getItem('userAvatar');
        if (savedImage) {
            setPreviewImage(savedImage);
        }
    }, []);


    const [joinsData, setJoinsData] = useState<any[]>([]);
    const [contactsData, setContactsData] = useState<any[]>([]);
    const [userData, setUserData] = useState<any[]>([]);
    const [adminData, setAdminData] = useState<any[]>([]);


    const [statsCounts, setStatsCounts] = useState({
        adminCount: 0,
        userCount: 0,
        joinsCount: 0,
        contactsCount: 0
    });


    const [joinsChart, setJoinsChart] = useState<number[]>(new Array(12).fill(0));
    const [userChart, setUserChart] = useState<number[]>(new Array(12).fill(0));

    useEffect(() => {

        const joinsCounts = new Array(12).fill(0);
        joinsData.forEach(item => {
            const dateStr = item.created_at;
            if (dateStr) {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    joinsCounts[d.getMonth()]++;
                }
            } else {

                const now = new Date();
                joinsCounts[now.getMonth()]++;
            }
        });
        setJoinsChart(joinsCounts);
    }, [joinsData]);

    useEffect(() => {

        const userCounts = new Array(12).fill(0);
        userData.forEach(item => {
            const dateStr = item.created_at;
            if (dateStr) {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) {
                    userCounts[d.getMonth()]++;
                }
            } else {
                const now = new Date();
                userCounts[now.getMonth()]++;
            }
        });
        setUserChart(userCounts);
    }, [userData]);

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
                case 2: result = await deleteContactMessage(deleteItemId); if (result.success) setContactsData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 4: result = await deleteUser(deleteItemId); if (result.success) setUserData(p => p.filter(i => i.id !== deleteItemId)); break;
                case 6: result = await deleteAdmin(deleteItemId); if (result.success) setAdminData(p => p.filter(i => i.id !== deleteItemId)); break;
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
                setStatsCounts(prev => ({
                    ...prev,
                    adminCount: counts.adminCount,
                    userCount: counts.userCount,
                    joinsCount: counts.joinsCount,
                    contactsCount: counts.contactsCount
                }));


                const joins = await getJoinsList();
                setJoinsData(joins);

                const contacts = await getContactsList();
                setContactsData(contacts);

                const users = await getUsersList();
                setUserData(users);

                const admins = await getAdminUsers();
                setAdminData(admins);

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
            id: 2,
            title: 'Total User yang Hubungi',
            value: `${statsCounts.contactsCount} User Hubungi`,
            icon: BarChart3,
            subText: statsCounts.contactsCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 4,
            title: 'Total User yang Login',
            value: `${statsCounts.userCount} User Login`,
            icon: Home,
            subText: statsCounts.userCount > 0 ? 'Data Terbaru' : 'Belum ada data'
        },
        {
            id: 6,
            title: 'Jumlah Admin',
            value: `${statsCounts.adminCount} Admin`,
            icon: UserCog,
            subText: statsCounts.adminCount > 0 ? 'Data Terbaru' : 'Belum ada data'
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
            let type = 'join';
            if (activeCard === 0) type = 'join';
            else if (activeCard === 2) type = 'contact';
            else if (activeCard === 4) type = 'user_login';
            else if (activeCard === 6) type = 'admin';

            router.push(`/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb/user/detail/${itemId}?type=${type}`);
        };


        switch (activeCard) {
            case 0:
            case 2:
            case 4:
            case 6:
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

            case 4:
                title = 'Data_User_Login';
                formattedData = userData.map(item => ({
                    'Email User': item.email,
                    'Role': item.role || 'User',
                    'Status': 'Aktif'
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
                                            {item.role === 'Social' ? 'Google' : item.role}
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
                <h1 className="text-2xl font-bold text-gray-800">User</h1>
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


            {activeCard === 0 && (
                <MonthlyChart data={joinsChart} label="Anggota Baru" color="#9C7C5B" />
            )}
            {activeCard === 4 && (
                <MonthlyChart data={userChart} label="User Login" color="#9C7C5B" />
            )}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] p-6">


                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-[#8B6E4A]">
                            {stats.find(s => s.id === activeCard)?.title.replace('Total ', '') || 'Detail Data'}
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            Data {stats.find(s => s.id === activeCard)?.title || ''}
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
                                    case 2: return contactsData.length;
                                    case 4: return userData.length;
                                    case 6: return adminData.length;
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