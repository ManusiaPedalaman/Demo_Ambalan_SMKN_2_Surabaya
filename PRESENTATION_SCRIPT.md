# Naskah Presentasi Sidang Tugas Akhir - Sistem Informasi Ambalan

**Durasi Target:** 20 Menit
**Tone:** Formal, Sopan, Percaya Diri, & Menarik.

---

## **I. PEMBUKAAN (Menit 0:00 - 2:00)**

### **Slide 1: Judul Project**

- **Visual:** Judul Besar "Sistem Informasi & Digitalisasi Ambalan SMKN 2 Surabaya", Logo Sekolah & Ambalan, Nama Penyusun.
- **Script:**
  "Assalamualaikum Warahmatullahi Wabarakatuh. Selamat pagi/siang dan salam sejahtera bagi kita semua.
  Yang saya hormati, Bapak/Ibu Penguji serta teman-teman yang berbahagia.

  Perkenankan saya, **[Sebutkan Nama Anda]**, berdiri di sini untuk mempresentasikan hasil Tugas Akhir saya yang berjudul **'Sistem Informasi dan Digitalisasi Ambalan SMKN 2 Surabaya'**.

  Project ini lahir dari sebuah keresahan akan sistem administrasi konvensional di lingkungan Pramuka kita, dan harapan besar untuk membawa Ambalan SMKN 2 Surabaya melangkah menuju era digital yang lebih terintegrasi."

### **Slide 2: Latar Belakang Masalah**

- **Visual:** Ilustrasi tumpukan berkas manual, siswa bingung mencari info, jadwal latihan yang tidak terdistribusi.
- **Script:**
  "Hadirin sekalian, mari kita lihat kondisi yang melatarbelakangi pengembangan sistem ini.
  Selama ini, operasional Ambalan kita berjalan dengan metode yang sangat konvensional:
  1.  **Administrasi Manual:** Pencatatan anggota dan inventaris masih menggunakan buku tulis fisik, yang rentan rusak atau hilang.
  2.  **Keterbatasan Akses Materi:** Materi kepramukaan hanya bisa didapat saat latihan tatap muka. Jika siswa berhalangan hadir, mereka tertinggal pelajaran.
  3.  **Potensi Ekonomi yang Belum Tergarap:** Unit usaha (UMKM) siswa tidak memiliki wadah promosi yang layak, sehingga jangkauan pasarnya sangat terbatas.

  Tiga masalah inilah yang menjadi **'Pain Points'** atau titik nyeri utama yang ingin saya selesaikan."

---

## **II. SOLUSI & TUJUAN (Menit 2:00 - 4:00)**

### **Slide 3: Solusi yang Ditawarkan**

- **Visual:** Mockup Website (Tampilan Laptop & HP) dengan headline "One Stop Solution".
- **Script:**
  "Sebagai solusi, saya membangun sebuah **'Web-Based Information System'**.
  Ini bukan sekadar website profil, melainkan sebuah ekosistem digital. Bayangkan sebuah platform di mana:
  - Siswa bisa belajar materi pramuka dari rumah.
  - Pengurus bisa mendata stok tenda dan tongkat secara real-time.
  - Dan siswa yang memiliki usaha (UMKM) bisa memasarkan produknya ke seluruh warga sekolah.

  Inilah yang saya sebut sebagai **Digitalisasi Menyeluruh**."

---

## **III. ARSITEKTUR SISTEM (Menit 4:00 - 9:00)**

### **Slide 4: Tech Stack (Teknologi)**

- **Visual:** Logo Next.js 15, TypeScript, Tailwind CSS, Supabase/PostgreSQL.
- **Script:**
  "Untuk membangun sistem yang handal, saya menggunakan teknologi industri terkini:
  - **Frontend:** Dibangun dengan **Next.js versi 15** dan **TypeScript**. Ini menjamin performa website yang sangat cepat dan minim bug.
  - **Styling:** Menggunakan **Tailwind CSS** untuk memastikan tampilan tetap cantik dan responsif di HP maupun Laptop.
  - **Backend & Database:** Didukung oleh **Supabase (PostgreSQL)**, yang menjamin keamanan data siswa dan kecepatan akses server."

### **Slide 5: DFD Level 0 (Diagram Konteks)**

- **Visual:** Gambar DFD Level 0 (Sistem di tengah, dikelilingi Aktor). _(Gunakan gambar dari `dfd_level_0.md`)_
- **Script:**
  "Secara garis besar, alur data sistem ini dapat dilihat pada **Diagram Konteks (DFD Level 0)** berikut.
  Sistem berada di pusat, melayani tiga entitas utama:
  1.  **User/Anggota:** Memberikan data profil dan jawaban kuis, menerima materi dan info produk.
  2.  **Admin:** Mengelola data master dan menerima laporan otomatis.
  3.  **Pengunjung (Guest):** Mengakses informasi publik dan formulir pendaftaran.
      Semua alur ini berjalan secara _real-time_ dan terpusat."

### **Slide 6: Use Case Diagram**

- **Visual:** Gambar Use Case Diagram (Aktor User, Admin, Guest). _(Gunakan gambar dari `usecase_diagram.md`)_
- **Script:**
  "Lebih mendalam lagi, apa saja yang bisa dilakukan di dalam sistem?
  Pada **Use Case Diagram** ini terlihat jelas pembagian peran:
  - **User/Siswa** memiliki akses fitur Edukasi (Kuis) dan Ekonomi (Buka Toko UMKM).
  - **Admin** bertindak sebagai _Gatekeeper_ atau verifikator. Adminlah yang menyetujui (Approve) produk UMKM sebelum tayang, menjaga agar konten tetap sesuai etika sekolah.
  - Perhatikan juga adanya relasi software seperti **'Include'** pada fitur Kuis, di mana pengerjaan kuis pasti menghasilkan skor penilaian."

### **Slide 7: Entity Relationship Diagram (ERD)**

- **Visual:** Gambar ERD (Chen Notation/Simbol Geometris). _(Gunakan gambar dari `database_design.md`)_
- **Script:**
  "Kekuatan utama sistem ini terletak pada desain databasenya.
  Bisa dilihat pada **ERD** berikut, saya merancang relasi yang komprehensif.
  - Tabel **User** adalah pusat data.
  - User memiliki relasi **One-to-Many** ke tabel **UMKM** (satu siswa bisa punya tokoh).
  - Tabel **Inventory** terhubung dengan **History Peminjaman** untuk pencatatan aset sekolah yang akurat.
    Struktur ini memastikan tidak ada redudansi data dan integritas informasi terjaga."

---

## **IV. DEMONSTRASI EKSKLUSIF (Menit 9:00 - 16:00)**

_(Bagian ini adalah inti presentasi. Jika memungkinkan, lakukan Live Demo. Jika tidak, gunakan screenshot/video)._

### **Slide 8 fitur 1: Halaman Publik & Profil**

- **Script:**
  "Mari kita telusuri fiturnya.
  Pertama, **Halaman Beranda**. Desainnya dibuat _Modern & Clean_. Informasi tentang Ambalan tersaji rapi.
  Saya menerapkan **'Consistent Premium Design'**, di mana tampilan website dikunci pada mode terang (Light Mode) dengan paduan warna emas dan krem. Ini memastikan estetika website tetap terjaga dan terlihat profesional di semua perangkat pengguna, tanpa terpengaruh setting dark mode browser yang seringkali merusak komposisi warna.
  Selain itu, sistem ini juga sudah **Mobile Responsive**. Bapak/Ibu bisa membukanya lewat HP, dan tampilannya akan menyesuaikan diri dengan sempurna."

### **Slide 9 Fitur 2: Sistem Edukasi (E-Learning)**

- **Script:**
  "Kedua, fitur **Edu-Pramuka**.
  Siswa bisa mengakses menu 'Latihan'. Di sini tersedia modul sandi, tali-temali, hingga sejarah.
  Tidak hanya membaca, siswa ditantang dengan **Kuis Interaktif**.
  _(Tunjukkan demo mengerjakan kuis)_
  Begitu selesai, skor langsung keluar. Ini memudahkan pembina untuk memantau pemahaman teori anggota tanpa harus mengoreksi kertas satu per satu."

### **Slide 10 Fitur 3: Ekosistem UMKM Siswa**

- **Script:**
  "Ketiga, dan ini yang paling unik, **Marketplace UMKM**.
  Siswa SMKN 2 yang memiliki usaha bisa mendaftarkan tokonya di sini.
  Mereka bisa upload foto produk makanan atau kerajinan.
  **Fitur Cerdas:** Sistem kontak WhatsApp bekerja secara **Dinamis**. Ketika pembeli menekan tombol 'Checkout', sistem otomatis mengambil nomor WhatsApp terbaru dari profil siswa penjual. Jadi, jika penjual mengganti nomor HP di profilnya, tombol pemesanan akan langsung terupdate tanpa perlu mengedit produk satu per satu.

  Tentu, produk tidak langsung muncul begitu saja. **Admin harus memverifikasi dulu**. Ini fitur keamanan untuk mencegah konten yang tidak pantas."

### **Slide 11 Fitur 4: Inventory & Peminjaman (Rental)**

- **Script:**
  "Keempat, **Digitalisasi Aset**.
  Dulu kita mencatat peminjaman tenda di buku tulis. Sekarang, semua tercatat di sistem.
  Siapa meminjam, kapan harus kembali, dan status dendanya terekam jelas. Admin Logistik bisa memantau aset mana yang sedang keluar dan mana yang tersedia di gudang."

### **Slide 12 Fitur 5: Dashboard Admin**

- **Script:**
  "Terakhir, **Dashboard Admin**.
  Ini adalah ruang kendali bagi Pembina atau Dewan Ambalan.
  Dari sini, kita bisa melihat Grafik Statistik: Berapa siswa yang login hari ini? Berapa produk yang terjual?
  Semua data disajikan dalam bentuk Grafik Visual yang mudah dibaca, bukan lagi tabel angka yang membosankan."

---

## **V. KENDALA & PENGEMBANGAN (Menit 16:00 - 18:00)**

### **Slide 13: Tantangan Pengembangan**

- **Script:**
  "Tentu, perjalanan membangun sistem ini tidak mulus.
  Tantangan terbesar yang saya hadapi adalah **Kompleksitas Relasi Database**. Menghubungkan data Akademik (Kuis) dengan data Ekonomi (UMKM) dalam satu user ID membutuhkan logika pemrograman yang matang.
  Namun, dengan penerapan skema database **PostgreSQL** yang tepat, tantangan tersebut berhasil teratasi."

### **Slide 14: Rencana Pengembangan (Future Work)**

- **Script:**
  "Sistem ini belum mencapai titik akhir. Ke depannya, saya berencana mengembangkan:
  1.  **Mobile App Native** (Android/iOS) agar notifikasi lebih real-time.
  2.  **Integrasi Payment Gateway** agar pembayaran UMKM bisa dilakukan secara cashless (QRIS)."

---

## **VI. PENUTUP (Menit 18:00 - 20:00)**

### **Slide 15: Kesimpulan**

- **Visual:** Poin ringkasan manfaat (Efisien, Transparan, Modern).
- **Script:**
  "Hadirin sekalian, sebagai penutup.
  Sistem Informasi Ambalan ini bukan sekadar tugas akhir bagi saya. Ini adalah kontribusi nyata untuk sekolah tercinta.
  Dengan sistem ini, kita mengubah:
  - Dari administrasi manual menjadi **Digital**.
  - Dari informasi tertutup menjadi **Transparan**.
  - Dan dari organisasi konvensional menjadi **Ambalan Modern Berbasis Teknologi**.

  Saya siap mempertanggungjawabkan karya ini dan sangat terbuka terhadap masukan dari Bapak/Ibu Penguji."

### **Slide 16: Salam Penutup**

- **Visual:** "Terima Kasih", Kontak, Quote.
- **Script:**
  "Terima kasih atas waktu dan perhatian yang diberikan.
  Mohon maaf apabila ada tutur kata yang kurang berkenan.
  Saya akhiri presentasi ini.
  **Wassalamualaikum Warahmatullahi Wabarakatuh.**
  **(Jeda sejenak)**
  Saya kembalikan waktu kepada Moderator/Dewan Penguji."

---
