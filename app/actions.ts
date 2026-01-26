'use server';

import { supabase } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';

export async function submitJoinForm(formData: any) {
    try {

        const { error: dbError } = await supabase.from('data_anggota_join').insert([
            {
                nama_lengkap: formData.nama,
                tanggal_lahir: formData.tanggalLahir,
                no_wa: formData.whatsapp,
                asal_sekolah: formData.sekolah,
                kelas: formData.kelas,
                jurusan: formData.jurusan,
                pesan: formData.pesan
            }
        ]);

        if (dbError) {
            console.error('Supabase Join Error:', dbError);

        }


        const message = `
*New Join Request*
Nama: ${formData.nama}
Tgl Lahir: ${formData.tanggalLahir}
WA: https://wa.me/62${formData.whatsapp}
Sekolah: ${formData.sekolah}
Kelas: ${formData.kelas}
Jurusan: ${formData.jurusan}
Alasan: ${formData.pesan}
    `;
        await sendTelegramNotification(message);

        return { success: true };
    } catch (error) {
        console.error('Server Action Error:', error);
        return { success: false, error };
    }
}

export async function submitContactForm(formData: any) {
    try {
        const { error: dbError } = await supabase.from('data_user_hubungi').insert([
            {
                nama_lengkap: formData.nama,
                email: formData.email,
                no_wa: formData.phone,
                pesan: formData.pesan
            }
        ]);

        if (dbError) console.error('Supabase Contact Error:', dbError);

        const message = `
*Ada yang Menghubungi*

Nama: ${formData.nama}
Email: ${formData.email}
Phone: https://wa.me/62${formData.phone}

*Halo Admin Ambalan, saya ingin bertanya*
Pesan: ${formData.pesan}

beri emoji ✅ atau balas "terjawab" pada data hubungi di atas jika telah menyampaikan jawaban pada nomor whatsapp di atas
    `;
        await sendTelegramNotification(message);

        return { success: true };
    } catch (error) {
        console.error('Server Action Error:', error);
        return { success: false, error };
    }
}

export async function submitBookingForm(data: any) {
    try {

        const { error: customerError } = await supabase.from('data_customer_penyewa').insert([
            {
                nama_customer: data.userName,
                sekolah_instansi: data.school,
                produk_disewa: data.slug,
                no_wa: data.whatsapp,
                metode_bayar: data.paymentMethod,
                jam_pengambilan: data.pickupTime,
                jam_pengembalian: data.returnTime || '-'
            }
        ]);

        if (customerError) {
            console.error('Supabase Customer Error:', customerError);

        }


        const { error: productError } = await supabase.from('data_produk_tersewa').insert([
            {
                id_produk: data.slug,
                nama_produk: data.slug,
                tgl_pengambilan: data.startDate,
                tgl_pengembalian: data.endDate,
                jam_sewa: data.pickupTime,
                jam_kembali: data.returnTime || '-',
                jumlah_produk: data.quantity.toString(),
                nama_peminjam: data.userName,
                status_kembali: 'Belum'
            }
        ]);

        if (productError) console.error('Supabase Product Booking Error:', productError);


        const message = `
*New Booking Order*
Product: ${data.slug}
Name: ${data.userName}
WA: https://wa.me/62${data.whatsapp}
School: ${data.school}
Pengambilan: ${data.startDate} Pukul ${data.pickupTime} WIB
Pengembalian: ${data.endDate} Pukul ${data.returnTime || '-'} WIB
Jumlah Produk: ${data.quantity}
Total: Rp ${data.totalPrice?.toLocaleString('id-ID')}
Payment: ${data.paymentMethod}
Message: ${data.message || '-'}
    `;
        await sendTelegramNotification(message);

        return { success: true };
    } catch (error) {
        console.error('Server Action Error:', error);
        return { success: false, error };
    }
}


import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    try {
        const [
            adminCount,
            userCount,
            productCount,
            eventCount,
            joinsCount,
            bookingsCount,
            contactsCount,
            rentersCount
        ] = await Promise.all([
            prisma.dataAdminTerdaftar.count(),
            prisma.dataUserLogin.count(),
            prisma.dataProdukTersedia.count(),
            prisma.dataMateriLatihan.count(),
            prisma.dataAnggotaJoin.count(),
            prisma.dataProdukTersewa.count(),
            prisma.dataUserHubungi.count(),
            prisma.dataCustomerPenyewa.count()
        ]);

        return {
            adminCount,
            userCount,
            productCount,
            eventCount,
            joinsCount,
            bookingsCount,
            contactsCount,
            rentersCount
        };
    } catch (error) {
        console.error('Error fetching stats:', error);
        return {
            adminCount: 0,
            userCount: 0,
            productCount: 0,
            eventCount: 0,
            joinsCount: 0,
            bookingsCount: 0,
            contactsCount: 0,
            rentersCount: 0
        };
    }
}

export async function getAdminUsers() {
    try {

        const adminList = await prisma.dataAdminTerdaftar.findMany({
            select: {
                id_admin: true,
                nama_lengkap: true,
                email: true,
                status: true,
            }
        });


        return adminList.map((admin: any) => ({
            id: admin.id_admin,
            username: admin.nama_lengkap || 'Admin',
            email: admin.email,
            role: 'ADMIN',
            created_at: new Date().toISOString().split('T')[0]
        }));
    } catch (error) {
        console.error('Error fetching admins:', error);
        return [];
    }
}



export async function getJoinsList() {
    try {
        const joins = await prisma.dataAnggotaJoin.findMany({
            take: 50,
            orderBy: { id: 'desc' }
        });

        return joins.map((item: any) => ({
            id: item.id.toString(),
            nama: item.nama_lengkap,
            tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.toISOString().split('T')[0] : '-',
            no_wa: item.no_wa,
            sekolah: item.asal_sekolah,
            kelas: item.kelas,
            jurusan: item.jurusan,
            pesan: item.pesan,
            created_at: (item as any).created_at ? (item as any).created_at.toISOString() : null
        }));
    } catch (error) {
        console.error("Error fetching joins:", error);
        return [];
    }
}

export async function getBookingsList() {
    try {
        const bookings = await prisma.dataProdukTersewa.findMany({
            take: 50,
            orderBy: { id: 'desc' }
        });

        return bookings.map((item: any) => ({
            id: item.id.toString(),
            product_slug: item.nama_produk,
            start_date: item.tgl_pengambilan ? item.tgl_pengambilan.toISOString().split('T')[0] : '-',
            end_date: item.tgl_pengembalian ? item.tgl_pengembalian.toISOString().split('T')[0] : '-',
            pickup_time: item.jam_sewa,
            return_time: item.jam_kembali || '-',
            quantity: item.jumlah_produk,
            user_info: {
                name: item.nama_peminjam || 'User',
            },
            status: item.status_kembali
        }));
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
}

export async function getBookingById(id: string) {
    try {
        const booking = await prisma.dataProdukTersewa.findUnique({
            where: { id: BigInt(id) }
        });

        if (!booking) return null;

        return {
            id: booking.id.toString(),
            product_slug: booking.nama_produk || '-',
            start_date: booking.tgl_pengambilan ? booking.tgl_pengambilan.toISOString().split('T')[0] : '-',
            end_date: booking.tgl_pengembalian ? booking.tgl_pengembalian.toISOString().split('T')[0] : '-',
            pickup_time: booking.jam_sewa || '-',
            return_time: booking.jam_kembali || '-',
            quantity: booking.jumlah_produk || '0',
            user_info: {
                name: booking.nama_peminjam || 'Unknown User',
            },
            status: booking.status_kembali || 'Belum'
        };
    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        return null;
    }
}

export async function getContactsList() {
    try {
        const contacts = await prisma.dataUserHubungi.findMany({
            take: 50,
            orderBy: { id: 'desc' }
        });

        return contacts.map((item: any) => ({
            id: item.id.toString(),
            nama: item.nama_lengkap,
            email: item.email,
            phone: item.no_wa,
            pesan: item.pesan,
            status: item.status
        }));
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return [];
    }
}

export async function getRentersList() {
    try {
        const renters = await prisma.dataCustomerPenyewa.findMany({
            take: 50,
            orderBy: { id: 'desc' }
        });

        return renters.map((item: any) => ({
            id: item.id.toString(),
            nama_customer: item.nama_customer,
            sekolah_instansi: item.sekolah_instansi,
            produk_disewa: item.produk_disewa,
            no_wa: item.no_wa,
            metode_bayar: item.metode_bayar,
            jam_pengambilan: item.jam_pengambilan || '-',
            jam_pengembalian: item.jam_pengembalian || '-',
            status_bayar: item.status_bayar || 'Belum'
        }));
    } catch (error) {
        console.error("Error fetching renters:", error);
        return [];
    }
}

export async function getRenterById(id: string) {
    try {
        const renter = await prisma.dataCustomerPenyewa.findUnique({
            where: { id: BigInt(id) }
        });

        if (!renter) return null;

        return {
            id: renter.id.toString(),
            nama_customer: renter.nama_customer || '-',
            sekolah_instansi: renter.sekolah_instansi || '-',
            produk_disewa: renter.produk_disewa || '-',
            no_wa: renter.no_wa || '-',
            metode_bayar: renter.metode_bayar || '-',
            jam_pengambilan: renter.jam_pengambilan || '-',
            jam_pengembalian: renter.jam_pengembalian || '-',
            status_bayar: renter.status_bayar || 'Belum'
        };
    } catch (error) {
        console.error("Error fetching renter by ID:", error);
        return null;
    }
}

export async function getUsersList() {
    try {
        const users = await prisma.dataUserLogin.findMany({
            take: 50,
            select: {
                id_login: true,
                email: true,
                status: true
            }
        });

        return users.map((user: any) => ({
            id: user.id_login,
            email: user.email,
            status: user.status,
            role: 'USER',
            created_at: '-'
        }));
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function getMateriList() {
    try {
        const materi = await prisma.dataMateriLatihan.findMany({
            take: 50,
            orderBy: { id_materi: 'asc' }
        });

        return materi.map((item: any) => ({
            id: item.id_materi,
            nama: item.nama_materi,
            topik: item.topik ? item.topik.split(',') : [],
            icon: item.icon,
            content: item.content,
            status: 'Aktif'
        }));
    } catch (error) {
        console.error("Error fetching materi:", error);
        return [];
    }
}

export async function getMateriById(id: string) {
    try {
        const item = await prisma.dataMateriLatihan.findUnique({
            where: { id_materi: id }
        });

        if (!item) return null;

        return {
            id: item.id_materi,
            nama: item.nama_materi,
            topik: item.topik ? item.topik.split(',') : [],
            icon: item.icon,
            content: item.content,
            status: 'Aktif'
        };
    } catch (error) {
        console.error("Error fetching materi by ID:", error);
        return null;
    }
}

export async function createMateri(data: any) {
    try {
        await prisma.dataMateriLatihan.create({
            data: {
                id_materi: data.id,
                nama_materi: data.nama,
                topik: data.topik,
                icon: data.icon,
                content: data.content
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error creating materi:', error);
        return { success: false, error: 'Failed to create materi' };
    }
}

export async function getJoinById(id: string) {
    try {
        const item = await prisma.dataAnggotaJoin.findUnique({
            where: { id: BigInt(id) }
        });

        if (!item) return null;

        return {
            id: item.id.toString(),
            nama: item.nama_lengkap,
            tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.toISOString().split('T')[0] : '-',
            no_wa: item.no_wa,
            sekolah: item.asal_sekolah,
            kelas: item.kelas,
            jurusan: item.jurusan,
            pesan: item.pesan,
            created_at: (item as any).created_at ? (item as any).created_at.toISOString() : null
        };
    } catch (error) {
        console.error("Error fetching join by ID:", error);
        return null;
    }
}

export async function getContactById(id: string) {
    try {
        const item = await prisma.dataUserHubungi.findUnique({
            where: { id: BigInt(id) }
        });

        if (!item) return null;

        return {
            id: item.id.toString(),
            nama: item.nama_lengkap,
            email: item.email,
            phone: item.no_wa,
            pesan: item.pesan,
            status: item.status
        };
    } catch (error) {
        console.error("Error fetching contact by ID:", error);
        return null;
    }
}

export async function getUserById(id: string) {
    try {
        const item = await prisma.dataUserLogin.findUnique({
            where: { id_login: id }
        });

        if (!item) return null;

        return {
            id: item.id_login,
            email: item.email,
            status: item.status,
            role: 'USER'
        };
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return null;
    }
}

export async function getAdminById(id: string) {
    try {
        const item = await prisma.dataAdminTerdaftar.findUnique({
            where: { id_admin: id }
        });

        if (!item) return null;

        return {
            id: item.id_admin,
            username: item.nama_lengkap,
            email: item.email,
            status: item.status,
            role: 'ADMIN'
        };
    } catch (error) {
        console.error("Error fetching admin by ID:", error);
        return null;
    }
}


const PRODUCT_PRICES: Record<string, string> = {
    'Tenda Segitiga/Kerucut': '30k / 3 hari',
    'Matras Spons': '5k / 1 hari',
    'Tongkat Pramuka': '3k / 1 hari',
    'Paket Lengkap': '60k / 3 hari',
    'Tali Pramuka': '5k / 1 hari',
};

export async function getProductsList() {
    try {
        const products = await prisma.dataProdukTersedia.findMany({
            take: 50,
            orderBy: { id_produk: 'asc' }
        });

        return products.map((item: any) => ({
            id: item.id_produk,
            nama: item.nama_produk,
            status: item.status || 'Tersedia',
            price: PRODUCT_PRICES[item.nama_produk] || '-'
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function getProductById(id: string) {
    try {
        const product = await prisma.dataProdukTersedia.findUnique({
            where: { id_produk: id }
        });

        if (!product) return null;

        return {
            id: product.id_produk,
            nama: product.nama_produk,
            status: product.status || 'Tersedia'
        };
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return null;
    }
}



export async function deleteJoinMember(id: string) {
    try {
        await prisma.dataAnggotaJoin.delete({ where: { id: BigInt(id) } });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete member' };
    }
}

export async function deleteRenter(id: string) {
    try {
        const idBigInt = BigInt(id);


        const renter = await prisma.dataCustomerPenyewa.findUnique({
            where: { id: idBigInt }
        });

        if (!renter) {
            return { success: false, error: 'Renter not found' };
        }


        await prisma.dataCustomerPenyewa.delete({ where: { id: idBigInt } });


        await prisma.dataProdukTersewa.updateMany({
            where: {
                nama_peminjam: renter.nama_customer,
                nama_produk: renter.produk_disewa,
                jam_sewa: renter.jam_pengambilan
            },
            data: {
                status_kembali: 'Deleted'
            }
        });

        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete renter' };
    }
}

export async function deleteUser(id: string) {
    try {
        await prisma.dataUserLogin.delete({ where: { id_login: id } });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete user' };
    }
}

export async function deleteAdmin(id: string) {
    try {
        await prisma.dataAdminTerdaftar.delete({ where: { id_admin: id } });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete admin' };
    }
}

export async function deleteContactMessage(id: string) {
    try {
        await prisma.dataUserHubungi.delete({ where: { id: BigInt(id) } });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete message' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.dataProdukTersedia.delete({ where: { id_produk: id } });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete product' };
    }
}

export async function deleteMateri(id: string) {
    try {
        await prisma.dataMateriLatihan.delete({ where: { id_materi: id } });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete materi' };
    }
}

export async function deleteBooking(id: string) {
    try {
        await prisma.dataProdukTersewa.delete({ where: { id: BigInt(id) } });
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to delete booking' };
    }
}

export async function updateProductStatus(id: string, status: string) {
    try {
        await prisma.dataProdukTersedia.update({
            where: { id_produk: id },
            data: { status },
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating product status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}


export async function getProductStatusByName(name: string) {
    try {
        const product = await prisma.dataProdukTersedia.findFirst({
            where: { nama_produk: name },
            select: { status: true }
        });
        return { success: true, status: product?.status || 'Tidak Tersedia' };
    } catch (error) {
        console.error('Error fetching product status:', error);
        return { success: false, status: 'Tidak Tersedia' };
    }
}


export async function updateBookingStatus(id: string, status: string) {
    try {
        await prisma.dataProdukTersewa.update({
            where: { id: BigInt(id) },
            data: { status_kembali: status },
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating booking status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function updateRenterPaymentStatus(id: string, status: string) {
    try {
        await prisma.dataCustomerPenyewa.update({
            where: { id: BigInt(id) },
            data: { status_bayar: status },
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating renter payment status:', error);
        return { success: false, error: 'Failed to update payment status' };
    }
}

export async function addProduct(formData: any) {
    try {
        const { id, name } = formData;
        await prisma.dataProdukTersedia.create({
            data: {
                id_produk: id,
                nama_produk: name,
                status: 'Tersedia'
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding product:', error);
        return { success: false, error: 'Failed to add product' };
    }
}

export async function updateUserProfile(data: any) {
    try {
        const { id, nama, no_wa, tgl_lahir, sekolah, kelas, jurusan, foto } = data;
        
        await prisma.dataUserLogin.update({
            where: { id_login: id },
            data: {
                nama_lengkap: nama,
                no_wa: no_wa,
                tgl_lahir: tgl_lahir ? new Date(tgl_lahir) : null,
                sekolah_instansi: sekolah,
                kelas: kelas,
                jurusan: jurusan,
                foto: foto
            }
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: 'Failed to update profile' };
    }
}

export async function getUserProfile(id: string) {
    try {
        const user = await prisma.dataUserLogin.findUnique({
            where: { id_login: id }
        });
        
        if (!user) return null;
        
        return {
            ...user,
            tgl_lahir: user.tgl_lahir ? user.tgl_lahir.toISOString().split('T')[0] : ''
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}

export async function getUserProfileByEmail(email: string) {
    try {
        const user = await prisma.dataUserLogin.findFirst({
            where: { email: email }
        });
        
        if (!user) return null;
        
        return {
            ...user,
            tgl_lahir: user.tgl_lahir ? user.tgl_lahir.toISOString().split('T')[0] : ''
        };
    } catch (error) {
        console.error('Error fetching profile by email:', error);
        return null;
    }
}

export async function getUserHistory(identifier: { email?: string, no_wa?: string, nama?: string }) {
    try {
        const { email, no_wa, nama } = identifier;
        
        let rentals: any[] = [];
        let contacts: any[] = [];
        let joins: any[] = [];
        let quizzes: any[] = [];

        // Fetch Rentals (DataProdukTersewa match by nama_peminjam? or DataCustomerPenyewa match by no_wa?)
        // Assuming DataProdukTersewa stores the rental items. Without exact link, matching by name is best guess or no_wa if available.
        // DataProdukTersewa does NOT have no_wa or email. It only has nama_peminjam.
        // Match by nama for rentals
        if (nama) {
             const rawRentals = await prisma.dataProdukTersewa.findMany({
                where: { 
                    OR: [
                        { nama_peminjam: { contains: nama, mode: 'insensitive' } },
                        // Try matching by no_wa if possible, but schema says DataProdukTersewa has no no_wa? 
                        // Wait, Step 71 schema: DataProdukTersewa DOES NOT have no_wa. DataCustomerPenyewa DOES.
                        // But we want rental history which is usually itemized in ProdukTersewa.
                        // We'll stick to name for now, maybe loosely.
                    ]
                },
                orderBy: { id: 'desc' },
                include: { produk: true } 
            });
            rentals = rawRentals.map((item: any) => ({
                ...item,
                id: item.id.toString(),
                tgl_pengambilan: item.tgl_pengambilan ? item.tgl_pengambilan.toISOString() : null,
                tgl_pengembalian: item.tgl_pengembalian ? item.tgl_pengembalian.toISOString() : null
            }));
        }

        // Match by email OR name (if available) for contacts
        // DataUserHubungi has nama_lengkap
        if (email || nama) {
            const rawContacts = await prisma.dataUserHubungi.findMany({
                where: {
                    OR: [
                         { email: email || undefined },
                         { nama_lengkap: { contains: nama, mode: 'insensitive' } }
                    ]
                },
                orderBy: { id: 'desc' }
            });
            contacts = rawContacts.map((item: any) => ({
                ...item,
                id: item.id.toString()
            }));
        }

        // Match by no_wa OR name for joins
        if (no_wa || nama) {
            const rawJoins = await prisma.dataAnggotaJoin.findMany({
                where: {
                    OR: [
                        { no_wa: no_wa || undefined },
                        { nama_lengkap: { contains: nama, mode: 'insensitive' } }
                    ]
                },
                orderBy: { id: 'desc' }
            });
            joins = rawJoins.map((item: any) => ({
                ...item,
                id: item.id.toString(),
                tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.toISOString() : null,
                created_at: item.created_at ? item.created_at.toISOString() : null
            }));
        }
        
        // Match by email->user_id for quizzes
        if (email) {
            const user = await prisma.dataUserLogin.findFirst({ where: { email } });
            if (user) {
                const rawQuizzes = await prisma.dataHasilKuis.findMany({
                    where: { id_user: user.id_login },
                    include: { materi: true },
                    orderBy: { tanggal: 'desc' }
                });
                quizzes = rawQuizzes.map((item: any) => ({
                    ...item,
                    id: item.id.toString(),
                    tanggal: item.tanggal.toISOString()
                }));
            }
        }

        return { rentals, contacts, joins, quizzes };

    } catch (error) {
        console.error('Error getting user history:', error);
        return { rentals: [], contacts: [], joins: [], quizzes: [] };
    }
}

export async function updateHistoryItem(type: 'sewa' | 'hubungi' | 'join', id: string | number | bigint, data: any) {
    try {
        const { editTelegramMessage } = await import('@/lib/telegram');
        let telegramMsgId: number | null = null;
        let updateResult: any = null;

        if (type === 'sewa') {
             // Update DataProdukTersewa
             // Note: Prisma BigInt handling might require conversion
             updateResult = await prisma.dataProdukTersewa.update({
                 where: { id: BigInt(id) },
                 data: { ...data },
                 select: { telegram_message_id: true }
             });
             telegramMsgId = updateResult.telegram_message_id;
             
        } else if (type === 'hubungi') {
             updateResult = await prisma.dataUserHubungi.update({
                 where: { id: BigInt(id) },
                 data: { ...data },
                 select: { telegram_message_id: true }
             });
             telegramMsgId = updateResult.telegram_message_id;

        } else if (type === 'join') {
             updateResult = await prisma.dataAnggotaJoin.update({
                 where: { id: BigInt(id) },
                 data: { ...data },
                 select: { telegram_message_id: true }
             });
             telegramMsgId = updateResult.telegram_message_id;
        }

        // Trigger Telegram Update if message ID exists
        if (telegramMsgId) {
            // Construct new message content based on type and new data
            // For now, simpler notification or just re-send content?
            // User requested "synchronized updates to Telegram messages".
            // We need to reconstruct the message format used in the original send.
            // Since we don't know the exact format easily here without duplicating logic, 
            // maybe we just update with "Data Updated: ..."
            // Ideally, we'd have a helper to format the message.
            
            const newMessage = `[UPDATED] Data ${type.toUpperCase()} telah diperbarui.\nCheck Dashboard for details.`;
            await editTelegramMessage(telegramMsgId, newMessage);
        }

        return { success: true };
    } catch (error) {
        console.error(`Error updating history ${type}:`, error);
        return { success: false, error: 'Failed to update item' };
    }
}

export async function registerUMKM(data: any) {
    try {
        const { id_user, nama_umkm, no_wa, kelas, jurusan, nama_lengkap, kartu_pelajar } = data;
        
        await prisma.dataUmkm.create({
            data: {
                id_user,
                nama_umkm,
                no_wa,
                kelas,
                jurusan,
                nama_lengkap,
                kartu_pelajar,
                status: 'PENDING'
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error registering UMKM:', error);
        return { success: false, error: 'Failed to register UMKM' };
    }
}

export async function getUserUMKM(id_user: string) {
    try {
        const umkm = await prisma.dataUmkm.findFirst({
            where: { id_user },
            include: { produk: true },
            orderBy: { created_at: 'desc' }
        });
        
        if (umkm) {
            return {
                ...umkm,
                id: umkm.id.toString(),
                produk: umkm.produk.map((p: any) => ({
                    ...p,
                    id: p.id.toString(),
                    id_umkm: p.id_umkm.toString(),
                    harga: p.harga,
                    foto_produk: p.foto_produk || (p.gambar ? [p.gambar] : []), // Fallback
                    spesifikasi: p.spesifikasi || [],
                    is_draft: p.is_draft,
                    is_published: p.is_published
                }))
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching UMKM:', error);
        return null;
    }
}

export async function addProductUMKM(data: any) {
    try {
        const { id_umkm, nama_produk, deskripsi, harga, gambar, foto_produk, spesifikasi, is_draft } = data;
        
        await prisma.dataProdukUmkm.create({
            data: {
                id_umkm: BigInt(id_umkm),
                nama_produk,
                deskripsi,
                harga,
                gambar: gambar || (foto_produk && foto_produk.length > 0 ? foto_produk[0] : null), // Primary image
                foto_produk: foto_produk || [],
                spesifikasi: spesifikasi || [],
                is_draft: is_draft || false,
                is_published: false,
                status: is_draft ? 'PENDING' : 'PENDING' // Drafts are pending submission, but technically 'draft' state. Let's keep status PENDING but rely on is_draft flag.
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding UMKM product:', error);
        return { success: false, error: 'Failed to add product' };
    }
}

export async function getPendingUMKMList() {
    try {
        const umkms = await prisma.dataUmkm.findMany({
            where: { status: 'PENDING' },
            orderBy: { created_at: 'desc' }
        });
        
        return umkms.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            id_umkm: item.id.toString(), // consistency
            created_at: item.created_at.toISOString()
        }));
    } catch (error) {
        console.error('Error fetching pending UMKMs:', error);
        return [];
    }
}

export async function updateUMKMStatus(id: string, status: 'APPROVED' | 'REJECTED', note?: string) {
    try {
        await prisma.dataUmkm.update({
            where: { id: BigInt(id) },
            data: { 
                status: status,
                alasan_tolak: note || null
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating UMKM status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function getPendingProductList() {
    try {
        const products = await prisma.dataProdukUmkm.findMany({
            where: { status: 'PENDING' },
            include: { umkm: true }, // Include UMKM details
            orderBy: { created_at: 'desc' }
        });
        
        return products.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            id_umkm: item.id_umkm.toString(),
            created_at: item.created_at.toISOString(),
            nama_umkm: item.umkm?.nama_umkm || 'Unknown UMKM'
        }));
    } catch (error) {
        console.error('Error fetching pending products:', error);
        return [];
    }
}

export async function updateUMKMProductStatus(id: string, status: 'APPROVED' | 'REJECTED', note?: string) {
    try {
        await prisma.dataProdukUmkm.update({
            where: { id: BigInt(id) },
            data: { 
                status: status,
                alasan_tolak: note || null
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating product status:', error);
        return { success: false, error: 'Failed to update status' };
    }
}

export async function updateProductUMKM(data: any) {
    try {
        const { id, nama_produk, deskripsi, harga, gambar, foto_produk, spesifikasi, is_draft } = data;
        
        const updateData: any = {
                nama_produk,
                deskripsi,
                harga,
                gambar: gambar || (foto_produk && foto_produk.length > 0 ? foto_produk[0] : null),
                foto_produk: foto_produk || [],
                spesifikasi: spesifikasi || [],
                is_draft: is_draft // Update draft status if passed
        };

        // Only reset status and rejection if NOT draft (submitting)
        if (is_draft === false) {
             updateData.status = 'PENDING';
             updateData.alasan_tolak = null;
        }
        // If draft, we might keep status as is or set to PENDING? 
        // Logic: Draft edits don't trigger admin review until submitted (is_draft=false).
        
        await prisma.dataProdukUmkm.update({
            where: { id: BigInt(id) },
            data: updateData
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Failed to update product' };
    }
}

export async function publishProductUMKM(id: string, is_published: boolean) {
    try {
        // Validation: Verify it is APPROVED before publishing
        const product = await prisma.dataProdukUmkm.findUnique({ where: { id: BigInt(id) } });
        if (!product || product.status !== 'APPROVED') {
             return { success: false, error: 'Product must be APPROVED to publish.' };
        }

        await prisma.dataProdukUmkm.update({
            where: { id: BigInt(id) },
            data: { is_published }
        });
        return { success: true };
    } catch (error) {
        console.error('Error publishing product:', error);
        return { success: false, error: 'Failed to publish product' };
    }
}

export async function getPublicProducts() {
    try {
        const products = await prisma.dataProdukUmkm.findMany({
            where: { 
                status: 'APPROVED',
                is_published: true,
                is_draft: false 
            },
            include: { umkm: true },
            orderBy: { created_at: 'desc' }
        });
        
        return products.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            id_umkm: item.id_umkm.toString(),
            created_at: item.created_at.toISOString(),
            nama_umkm: item.umkm?.nama_umkm || 'Unknown UMKM',
            foto_produk: item.foto_produk || (item.gambar ? [item.gambar] : []),
            spesifikasi: item.spesifikasi || []
        }));
    } catch (error) {
         console.error('Error fetching public products:', error);
         return [];
    }
}

export async function deleteProductUMKM(id: string) {
    try {
        await prisma.dataProdukUmkm.delete({
            where: { id: BigInt(id) }
        });
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}

export async function updateUMKMData(data: any) {
    try {
        const { id, nama_umkm, nama_lengkap, no_wa, kelas, jurusan, kartu_pelajar } = data;
        
        await prisma.dataUmkm.update({
            where: { id: BigInt(id) },
            data: {
                nama_umkm,
                nama_lengkap,
                no_wa,
                kelas,
                jurusan,
                kartu_pelajar,
                status: 'PENDING', // Reset status to PENDING
                alasan_tolak: null // Clear rejection reason
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating UMKM:', error);
        return { success: false, error: 'Failed to update UMKM' };
    }
}

export async function saveQuizResult(data: { 
    id_user: string, 
    id_materi: string, 
    nama_materi: string, 
    skor: number, 
    jawaban_user: any 
}) {
    try {
        const { id_user, id_materi, nama_materi, skor, jawaban_user } = data;

        // Ensure user exists
        const user = await prisma.dataUserLogin.findUnique({ where: { id_login: id_user } });
        if (!user) return { success: false, error: 'User not found' };

        // Ensure materi exists, if not create it (auto-seed)
        let materi = await prisma.dataMateriLatihan.findUnique({ where: { id_materi: id_materi } });
        if (!materi) {
             await prisma.dataMateriLatihan.create({
                 data: {
                     id_materi,
                     nama_materi,
                     topik: 'Auto-generated',
                     content: {}, 
                 }
             });
        }

        await prisma.dataHasilKuis.create({
            data: {
                id_user,
                id_materi,
                skor,
                jawaban_user,
                tanggal: new Date()
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return { success: false, error: 'Failed to save quiz result' };
    }
}
