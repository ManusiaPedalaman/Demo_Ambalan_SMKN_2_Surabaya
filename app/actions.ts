'use server';

import { supabase } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';

export async function submitJoinForm(formData: any) {
    try {
        // 1. Save to Supabase
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
            // We continue to send Telegram even if DB fails, or vice versa? 
            // Let's continue.
        }

        // 2. Send Telegram
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
        // 1. Insert into data_customer_penyewa (Data Penyewa)
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
            // We continue to try inserting product data or throw? 
            // Let's log and continue to ensure at least partial data or Telegram is sent.
        }

        // 2. Insert into data_produk_tersewa (Data Barang yang Disewa)
        const { error: productError } = await supabase.from('data_produk_tersewa').insert([
            {
                id_produk: data.slug,              // Using slug as ID/Name reference
                nama_produk: data.slug,            // or pass productName if avail, currently slug
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

        // 3. Send Telegram Notification (Gabungan Data)
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

// --- DASHBOARD ACTIONS ---

// --- DASHBOARD ACTIONS ---

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
    try {
        const adminCount = await prisma.dataAdminTerdaftar.count();
        const userCount = await prisma.dataUserLogin.count();
        const productCount = await prisma.dataProdukTersedia.count();
        const eventCount = await prisma.dataMateriLatihan.count();

        // Additional counts for dashboard
        const joinsCount = await prisma.dataAnggotaJoin.count();
        const bookingsCount = await prisma.dataProdukTersewa.count();
        const contactsCount = await prisma.dataUserHubungi.count();
        const rentersCount = await prisma.dataCustomerPenyewa.count();

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
        // Return detailed list for the table
        // Note: DataAdminTerdaftar does not have 'created_at' or 'role' in schema provided.
        // We map available fields.
        const adminList = await prisma.dataAdminTerdaftar.findMany({
            select: {
                id_admin: true,
                nama_lengkap: true,
                email: true,
                status: true,
            }
        });

        // Adapt to the expected frontend format if possible, or frontend needs adjustment
        return adminList.map(admin => ({
            id: admin.id_admin,
            username: admin.nama_lengkap || 'Admin', // Fallback
            email: admin.email,
            role: 'ADMIN', // Hardcoded as it comes from Admin table
            created_at: new Date().toISOString().split('T')[0] // Dummy date as field missing in schema
        }));
    } catch (error) {
        console.error('Error fetching admins:', error);
        return [];
    }
}

// --- NEW DATA FETCHING ACTIONS FOR DASHBOARD LISTS ---

export async function getJoinsList() {
    try {
        const joins = await prisma.dataAnggotaJoin.findMany({
            take: 50,
            orderBy: { id: 'desc' }
        });

        return joins.map(item => ({
            id: item.id.toString(), // Necessary for delete action
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

        return bookings.map(item => ({
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
            status: item.status_kembali // Mapped from DB
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

        return contacts.map(item => ({
            id: item.id.toString(),
            nama: item.nama_lengkap,
            email: item.email,
            phone: item.no_wa,
            pesan: item.pesan,
            status: item.status // Added status field
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

        return renters.map(item => ({
            id: item.id.toString(), // Necessary for delete action
            nama_customer: item.nama_customer,
            sekolah_instansi: item.sekolah_instansi,
            produk_disewa: item.produk_disewa,
            no_wa: item.no_wa,
            metode_bayar: item.metode_bayar,
            jam_pengambilan: item.jam_pengambilan || '-',
            jam_pengembalian: item.jam_pengembalian || '-',
            status_bayar: item.status_bayar || 'Belum' // Added status_bayar
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

        return users.map(user => ({
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

        return materi.map(item => ({
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
            content: item.content, // Returns the JSON structure directly
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

// Helper for static price mapping
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

        return products.map(item => ({
            id: item.id_produk,
            nama: item.nama_produk,
            status: item.status || 'Tersedia',
            price: PRODUCT_PRICES[item.nama_produk] || '-' // Map price or default
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

// --- DELETE ACTIONS ---

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

        // 1. Get renter info before deleting
        const renter = await prisma.dataCustomerPenyewa.findUnique({
            where: { id: idBigInt }
        });

        if (!renter) {
            return { success: false, error: 'Renter not found' };
        }

        // 2. Delete from DataCustomerPenyewa
        await prisma.dataCustomerPenyewa.delete({ where: { id: idBigInt } });

        // 3. Soft Delete corresponding from DataProdukTersewa (keep for charts, hide in table)
        // We match by name, product, and pickup time to be specific
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

export async function deleteMateri(id: string) { // Not requested but consistent
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
