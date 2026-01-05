# Panduan Presentasi Project Website Ambalan SMKN 2 Surabaya

Dokumen ini berisi **Outline Slide** (apa yang ditulis di PPT) dan **Teks Presentasi** (apa yang Anda ucapkan) untuk 15 Slide.

---

## Slide 1: Judul & Pembukaan
**Visual di Slide:**
*   **Judul:** Sistem Informasi & Digitalisasi Ambalan SMKN 2 Surabaya
*   **Logo:** Logo Ambalan & Logo SMKN 2 (Kanan/Kiri)
*   **Penyusun:** Nama Anda / Tim Anda
*   **Foto Background:** Foto kegiatan pramuka yang estetik (gelap/blur).

**Teks Presentasi:**
"Assalamualaikum Wr. Wb. Selamat pagi/siang. Pada kesempatan kali ini, saya akan mempresentasikan hasil proyek Tugas Akhir saya, yaitu Sistem Informasi dan Digitalisasi Ambalan SMKN 2 Surabaya. Website ini dibangun untuk memodernisasi pengelolaan kegiatan dan administrasi kepramukaan di sekolah kita."

---

## Slide 2: Latar Belakang Masalah
**Visual di Slide:**
*   Icon/Gambar: Tumpukan kertas (administrasi manual), Orang bingung (informasi sulit dicari).
*   Poin:
    1.  Pengelolaan inventaris barang masih manual (buku tulis).
    2.  Materi latihan sulit diakses di luar sekolah.
    3.  Pendaftaran anggota baru masih konvensional.

**Teks Presentasi:**
"Latar belakang pembuatan sistem ini adalah adanya kendala operasional yang selama ini terjadi. Pertama, pendataan barang inventaris masih manual di buku, sehingga rawan hilang. Kedua, materi latihan seringkali sulit diakses siswa jika tidak hadir saat latihan. Ketiga, proses administrasi pendaftaran anggota baru yang kurang efisien."

---

## Slide 3: Tujuan & Solusi
**Visual di Slide:**
*   Gambar: Mockup Website Ambalan di Laptop & HP.
*   Poin Solusi:
    1.  **Digitalisasi Inventaris** (Peminjaman online).
    2.  **E-Learning Pramuka** (Materi & Quiz online).
    3.  **Sistem Terintegrasi** (Web based, bisa diakses kapan saja).

**Teks Presentasi:**
"Tujuannya adalah menciptakan 'One Stop Solution' bagi Ambalan. Sistem ini mendigitalisasi pencatatan barang agar transparan, menyediakan platform belajar mandiri bagi siswa, dan mempermudah masyarakat luar untuk menjangkau informasi tentang Ambalan kita melalui website yang modern."

---

## Slide 4: Teknologi yang Digunakan (Tech Stack)
**Visual di Slide:**
*   Logo-logo Teknologi (Berjajar rapi):
    *   **Next.js 15** (Framework Utama)
    *   **TypeScript** (Bahasa Pemrograman)
    *   **Tailwind CSS** (Desain / Styling)
    *   **PostgreSQL / Supabase** (Database)
    *   **Prisma ORM** (Manajemen Data)
    *   **Vercel** (Cloud Hosting)

**Teks Presentasi:**
"Sistem ini dibangun menggunakan teknologi industri terkini. Basisnya adalah Next.js versi 15 yang sangat cepat dan ramah SEO. Untuk desain, saya menggunakan Tailwind CSS agar responsif di HP maupun Laptop. Databasenya menggunakan PostgreSQL yang dikelola Supabase, menjamin keamanan dan kecepatan akses data."

---

## Slide 5: Analisis Sistem (Use Case Diagram)
**Visual di Slide:**
*   (Masukkan Gambar Use Case Diagram dari `USECASE_CODE.mmd` yang sudah dibuat).
*   Highlight: 2 Aktor Utama (User & Admin).

**Teks Presentasi:**
"Dalam sistem ini, terdapat dua aktor utama. Pertama adalah **User/Anggota**, yang bisa mengakses materi, melihat produk, dan melakukan pendaftaran. Kedua adalah **Administrator**, yang memiliki hak akses penuh untuk mengelola data inventaris, memverifikasi peminjaman, dan mengupdate konten website melalui Dashboard khusus."

---

## Slide 6: Arsitektur Database (ERD)
**Visual di Slide:**
*   (Masukkan Gambar ERD Simple atau Potongan ERD yang penting).
*   Fokus pada: Tabel User, Tabel Produk, Tabel Peminjaman.

**Teks Presentasi:**
"Untuk struktur datanya, sistem ini memiliki beberapa tabel utama yang saling berelasi. Tabel 'Data Produk' menyimpan stok barang, yang terhubung dengan 'Data Peminjaman' untuk mencatat transaksi. Ada juga tabel 'User' dan 'Admin' yang menyimpan data autentikasi dengan keamanan enkripsi password."

---

## Slide 7: Fitur Utama 1 - Halaman Publik & Responsif
**Visual di Slide:**
*   Screenshot Halaman Beranda (Hero Section).
*   Screenshot tampilan di HP (Mobile View) bersandingan dengan Laptop.
*   Poin: "Desain Modern & Mobile Friendly".

**Teks Presentasi:**
"Masuk ke fitur aplikasi. Halaman depan didesain modern 'eye-catching' untuk menarik minat siswa baru. Fitur krusialnya adalah 'Responsivitas'. Website ini otomatis menyesuaikan tampilan dengan rapi, baik saat dibuka di Laptop, Tablet, maupun Smartphone, sehingga aksesibilitasnya sangat tinggi."

---

## Slide 8: Fitur Utama 2 - E-Learning (Latihan)
**Visual di Slide:**
*   Screenshot Halaman Latihan (Daftar Materi).
*   Screenshot Modal Gambar Fullscreen / Video Youtube.
*   Screenshot Quiz Interaktif.

**Teks Presentasi:**
"Fitur unggulan kedua adalah E-Learning. Di menu 'Latihan', anggota bisa belajar materi kepramukaan seperti sandi, tali-temali, dan survival. Materi disajikan dalam bentuk Teks, Gambar Tutorial, dan Video terintegrasi. Tersedia juga fitur 'Uji Pemahaman' berupa Quiz interaktif untuk mengukur kemampuan anggota."

---

## Slide 9: Fitur Utama 3 - Katalog Produk & Sewa
**Visual di Slide:**
*   Screenshot Halaman "Produk Kami".
*   Screenshot Detail Produk.
*   Tombol "Sewa Sekarang" yang mengarah ke WhatsApp.

**Teks Presentasi:**
"Untuk mendukung kas Ambalan, tersedia fitur Katalog Produk. Pengunjung bisa melihat daftar barang yang disewakan lengkap dengan status ketersediaannya. Jika berminat, sistem menyediakan tombol 'Sewa via WhatsApp' yang otomatis membuat pesan pemesanan, menghubungkan penyewa langsung dengan admin logistik."

---

## Slide 10: Keamanan & Autentikasi (Social Login)
**Visual di Slide:**
*   Screenshot Halaman Login.
*   Zoom pada tombol "Sign in with Google" dan "Facebook".
*   Icon Gembok/Security.

**Teks Presentasi:**
"Keamanan dan kemudahan akses menjadi prioritas. Sistem Login sudah mendukung **Social Login** menggunakan akun Google dan Facebook. Jadi user tidak perlu repot menghafal password baru. Di sisi backend, sistem menggunakan 'Session' yang aman dan Password Admin dienkripsi menggunakan standar Bcrypt agar tidak mudah diretas."

---

## Slide 11: Dashboard Admin - Overview
**Visual di Slide:**
*   Screenshot Halaman Dashboard Utama Admin.
*   Grafik Statistik "Produk Tersewa" (Chart yang sudah diperbaiki).
*   Summary Cards (Total User, Total Produk).

**Teks Presentasi:**
"Ini adalah 'Dapur' dari sistem ini, yaitu Dashboard Admin. Di sini, pengurus bisa melihat ringkasan data secara Real-Time. Terdapat Grafik Peminjaman yang interaktif untuk memantau performa penyewaan barang setiap bulannya, serta kartu ringkasan untuk melihat jumlah anggota dan inventaris dengan cepat."

---

## Slide 12: Dashboard Admin - Manajemen Data
**Visual di Slide:**
*   Screenshot Tabel Daftar Produk (dengan tombol Edit/Delete).
*   Screenshot Tabel Peminjaman (Produk Tersewa).
*   Poin: CRUD (Create, Read, Update, Delete) System.

**Teks Presentasi:**
"Fungsi utama Admin adalah manajemen data. Admin bisa Menambah, Mengedit, dan Menghapus data produk dengan mudah. Fitur krusial lainnya adalah 'Manajemen Peminjaman', di mana Admin bisa mengubah status barang dari 'Disewa' menjadi 'Dikembalikan', yang otomatis akan mengupdate stok barang di katalog public."

---

## Slide 13: Tantangan & Penyelesaian
**Visual di Slide:**
*   Icon Bug/Tantangan -> Panah -> Icon Centang/Solusi.
*   Contoh kasus: "Login Error" -> "Fix Redirect URI", "Tampilan Tablet Berantakan" -> "Responsive Breakpoints".

**Teks Presentasi:**
"Selama pengembangan, tentu ada tantangan. Salah satunya adalah konfigurasi Social Login yang ketat dari Google, serta penyesuaian tampilan di perangkat Tablet yang sempat berantakan. Namun, semua itu berhasil diatasi dengan penerapan 'Responsive Breakpoints' yang tepat dan konfigurasi OAuth yang sesuai standar keamanan platform."

---

## Slide 14: Kesimpulan
**Visual di Slide:**
*   Poin Kesimpulan:
    1.  Sistem Berjalan 100% (Deployed).
    2.  Solusi Efektif untuk Administrasi.
    3.  Siap Diimplementasikan.

**Teks Presentasi:**
"Kesimpulannya, Website Ambalan ini telah berhasil dibangun dan di-deploy secara online. Sistem ini mampu mejawab permasalahan administrasi manual, menyediakan sarana belajar digital, dan membuka peluang pemasukan kas melalui penyewaan online. Sistem ini siap untuk diimplementasikan sepenuhnya di SMKN 2 Surabaya."
 
---

## Slide 15: Penutup & QnA
**Visual di Slide:**
*   Tulisan Besar: "Terima Kasih".
*   Kontak Anda (Email/LinkedIn).
*   Quote Pramuka (Opsional): *"Satyaku Kudharmakan, Dharmaku Kubaktikan"*.

**Teks Presentasi:**
"Demikian presentasi dari saya. Saya percaya digitalisasi ini adalah langkah awal untuk kemajuan Ambalan kita. Terima kasih atas perhatian Bapak/Ibu dan teman-teman sekalian. Saya buka sesi tanya jawab jika ada yang ingin didiskusikan. Wasalamualaikum Wr. Wb. Salam Pramuka!"
