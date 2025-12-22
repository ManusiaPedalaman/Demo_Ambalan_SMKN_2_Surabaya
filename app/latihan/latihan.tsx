'use client';

import React, { useState, useEffect } from 'react';
import { DM_Sans } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Anchor, Binary, Compass, Ruler, HeartPulse, Flame, Users,
  PlayCircle, HelpCircle, BookOpen, ArrowLeft, CheckCircle2,
  ChevronRight, ChevronDown, Trophy, RefreshCcw, Star, Menu,
  Maximize2, X, Image as ImageIcon
} from 'lucide-react';


import Link from 'next/link';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


const pillarsData = [
  {
    id: 'tali-temali',
    title: "Tali Temali",
    icon: Anchor,
    subCategories: [
      {
        id: 'simpul-mati',
        title: "Simpul Mati",
        explanationFrames: [
          { title: "Definisi", content: "Simpul mati adalah simpul yang digunakan untuk menyambung dua utas tali yang sama besar dan tidak licin." },
          { title: "Fungsi Utama", content: "Biasanya digunakan untuk mengakhiri suatu ikatan agar tidak mudah lepas namun tetap mudah dibuka kembali." },
          { title: "Kesalahan Umum", content: "Sering tertukar dengan simpul nenek (granny knot) yang mudah lepas dan sulit dibuka jika basah." }
        ],
        videoId: "https://youtu.be/lJlLuX6VHdk?si=d6D_JWucs5Z8TfdM",
        imageTutorials: [
          { title: "Step Simpul Mati", url: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjduL_Cs-pLIcY3Bn3KuPe7ieFvGJ_7DRlGAM7GBpoUVgGQKxE65r1lzRRpbvQ6Xckn46SCsQ6puUJRGawaGZb57ognV5fqK_fFDNtgIxaJ1xSGjRIuAkkn6TbTDkdhibmvFCi0_Rig7gw/s1600/reef+knot.jpg" },
        ],
        quiz: [
          { question: "Apa fungsi utama dari simpul mati?", options: ["Menyambung tali beda ukuran", "Menyambung tali sama besar", "Mengikat leher hewan", "Membuat tangga tali"], correct: 1 },
          { question: "Simpul mati sering tertukar dengan simpul apa?", options: ["Simpul Anyam", "Simpul Pangkal", "Simpul Nenek", "Simpul Kembar"], correct: 2 },
          { question: "Apakah simpul mati mudah dilepas kembali?", options: ["Sangat Sulit", "Mudah", "Tidak Bisa Dilepas", "Harus dipotong"], correct: 1 },
          { question: "Simpul mati termasuk dalam kategori?", options: ["Ikatan", "Simpul Dasar", "Jerat", "Hiasan"], correct: 1 },
          { question: "Bentuk simpul mati yang benar menyerupai angka?", options: ["8", "0", "Datar sejajar", "Silang X"], correct: 2 },
          { question: "Jika tali basah, simpul mati akan?", options: ["Mencair", "Semakin longgar", "Tetap mudah dibuka (relatif)", "Menjadi simpul hidup"], correct: 2 },
          { question: "Simpul mati dalam bahasa Inggris disebut?", options: ["Reef Knot", "Sheet Bend", "Bowline", "Clove Hitch"], correct: 0 },
          { question: "Simpul ini TIDAK cocok digunakan untuk?", options: ["Tali sepatu", "Mengakhiri ikatan", "Menyambung tali beda ukuran", "Bungkusan kado"], correct: 2 },
          { question: "Berapa utas tali yang disambung simpul mati?", options: ["1", "2", "3", "4"], correct: 1 },
          { question: "Apa kelebihan simpul mati dibanding simpul anyam?", options: ["Lebih kuat untuk tali beda besar", "Lebih rapi dan datar", "Bisa bergerak", "Untuk tali licin"], correct: 1 },
          { question: "Simpul mati paling ideal digunakan pada jenis tali?", options: ["Tali licin (nilon)", "Tali kasar (manila/sabut)", "Kawat baja", "Benang pancing"], correct: 1 },
          { question: "Dalam P3K, simpul mati digunakan untuk?", options: ["Mengikat pembuluh darah", "Mengikat mitella/perban", "Membuat tandu darurat", "Mengikat kaki patah"], correct: 1 },
          { question: "Apa kelemahan utama simpul mati?", options: ["Sulit dibuat", "Mudah lepas pada tali beda ukuran/licin", "Terlalu besar", "Memerlukan banyak tali"], correct: 1 },
          { question: "Simpul mati terdiri dari pertemuan dua lengkungan yang?", options: ["Berlawanan arah", "Sejajar dan simetris", "Tumpang tindih acak", "Menyatu permanen"], correct: 1 },
          { question: "Jika salah membuat simpul mati, maka akan menjadi?", options: ["Simpul Hidup", "Simpul Pangkal", "Simpul Nenek (Granny Knot)", "Simpul Erat"], correct: 2 }
        ]
      },
      {
        id: 'simpul-jangkar',
        title: "Simpul Jangkar",
        explanationFrames: [
          { title: "Pengenalan", content: "Simpul Jangkar (Cow Hitch) adalah salah satu simpul paling dasar dalam pembuatan pionering." },
          { title: "Kegunaan", content: "Digunakan untuk mengikat jangkar darurat atau untuk mengikat tali pada ember timba." }
        ],
        videoId: "https://youtu.be/MK3XwU4ytF0?si=CYPVI5kajcx_7L4w",
        imageTutorials: [
          { title: "Step Simpul Jangkar", url: "https://infowanapal.files.wordpress.com/2012/02/pangkal1.gif" },
        ],
        quiz: [
          { question: "Nama lain dari Simpul Jangkar adalah?", options: ["Clove Hitch", "Reef Knot", "Cow Hitch", "Sheet Bend"], correct: 2 },
          { question: "Fungsi utama simpul jangkar adalah?", options: ["Menyambung tali", "Mengikat pada tongkat/cincin", "Memendekkan tali", "Mengikat leher"], correct: 1 },
          { question: "Simpul jangkar sering digunakan untuk membuat?", options: ["Tandu darurat", "Tiang bendera", "Jembatan", "Menara pandang"], correct: 0 },
          { question: "Kelebihan simpul jangkar adalah?", options: ["Sangat kuat permanen", "Mudah dilepas kembali", "Bisa untuk tali licin", "Sangat rumit"], correct: 1 },
          { question: "Simpul jangkar terdiri dari berapa lingkar?", options: ["1", "2", "3", "4"], correct: 1 },
          { question: "Simpul jangkar biasa dipasangkan dengan simpul?", options: ["Pangkal", "Mati", "Hidup", "Delapan"], correct: 0 },
          { question: "Dalam bahasa Inggris, simpul jangkar disebut?", options: ["Cow Hitch", "Clove Hitch", "Square Knot", "Bowline"], correct: 0 },
          { question: "Untuk mengikat timba air, simpul jangkar biasanya ditambah dengan?", options: ["Simpul mati di ujung", "Simpul setengah (Half Hitch)", "Simpul delapan", "Simpul pangkal"], correct: 0 },
          { question: "Simpul jangkar bisa dibuat dengan cara?", options: ["Hanya 1 cara", "2 cara (ujung tali & tengah tali)", "3 cara", "Tidak bisa dibuat di tengah"], correct: 1 },
          { question: "Apakah simpul jangkar cocok untuk menarik beban berat?", options: ["Ya, sangat kuat", "Tidak, bisa melorot", "Hanya jika tali basah", "Tergantung warna tali"], correct: 1 },
          { question: "Simpul jangkar pada tongkat bentuknya terlihat seperti?", options: ["Dua garis sejajar menjepit", "Silang (X)", "Angka 8", "Lingkaran penuh"], correct: 0 },
          { question: "Jika salah satu ujung beban dilepas, simpul jangkar akan?", options: ["Mengunci otomatis", "Mudah kendur/lepas", "Putus", "Menjadi simpul mati"], correct: 1 },
          { question: "Simpul ini juga sering digunakan untuk mengikat?", options: ["Leher binatang ternak", "Kawat berduri", "Kabel listrik", "Pipa bocor"], correct: 0 },
          { question: "Simpul jangkar termasuk golongan?", options: ["Hitch (Ikatan)", "Bend (Simpul)", "Lashing (Jerat)", "Stopper"], correct: 0 },
          { question: "Mana yang BUKAN kegunaan simpul jangkar?", options: ["Mengikat pada cincin", "Membuat usungan", "Menyambung dua tali beda besarnya", "Mengikat pada pohon"], correct: 2 }
        ]
      }
    ]
  },
  {
    id: 'sandi',
    title: "Sandi & Morse",
    icon: Binary,
    subCategories: [
      {
        id: 'sandi-morse',
        title: "Sandi Morse Huruf",
        explanationFrames: [
          { title: "Sejarah", content: "Ditemukan oleh Samuel F.B. Morse." },
          { title: "Konsep", content: "Titik dan Strip." }
        ],
        videoId: "https://youtu.be/7kNITQOhmzk?si=rE2hJeky20g_N3ps",
        imageTutorials: [
          { title: "Code Morse Huruf", url: "https://media.geeksforgeeks.org/wp-content/uploads/20231227185151/morse-code.jpg" },
        ],
        quiz: [
          { question: "Siapa penemu Sandi Morse?", options: ["Samuel F.B. Morse", "Thomas Edison", "Alexander Graham Bell", "Baden Powell"], correct: 0 },
          { question: "Sandi Morse terdiri dari kombinasi?", options: ["Angka dan Huruf", "Titik dan Strip", "Warna dan Suara", "Garis lurus dan lengkung"], correct: 1 },
          { question: "Huruf 'E' dalam morse dilambangkan dengan?", options: [".", "-", "..", "--"], correct: 0 },
          { question: "Apa kode morse untuk tanda bahaya internasional (SOS)?", options: ["... --- ...", "--- ... ---", "... ... ...", "--- --- ---"], correct: 0 },
          { question: "Alat yang TIDAK lazim digunakan untuk mengirim morse?", options: ["Peluit", "Senter", "Bendera Semaphore", "Asap"], correct: 2 },
          { question: "Berapa lama durasi 'strip' (-) dibandingkan 'titik' (.)?", options: ["Sama", "2 kali", "3 kali", "4 kali"], correct: 2 },
          { question: "Huruf 'A' dilambangkan dengan?", options: [".-", "-.", "--", ".."], correct: 0 },
          { question: "Jika titik (.) dibunyikan 1 detik, maka strip (-) dibunyikan?", options: ["1 detik", "2 detik", "3 detik", "5 detik"], correct: 2 },
          { question: "Huruf 'O' (Oscar) dilambangkan dengan?", options: ["...", "---", ".-.", "-.-"], correct: 1 },
          { question: "Pemisah antar huruf dalam satu kata biasanya diberi jeda sepanjang?", options: ["1 titik", "3 titik", "5 titik", "7 titik"], correct: 1 },
          { question: "Apa kode morse untuk angka 5?", options: [".....", "-----", ".....-", "-...."], correct: 0 },
          { question: "Sandi morse dapat dikirimkan melalui cahaya menggunakan?", options: ["Heliograph", "Telegraf", "Radio", "Telepon"], correct: 0 },
          { question: "Huruf 'K' (Komando) memiliki kode?", options: ["-.-", ".-.", "--.", ".--"], correct: 0 },
          { question: "Pemisah antar kata diberi jeda sepanjang?", options: ["3 titik", "5 titik", "7 titik", "10 titik"], correct: 2 },
          { question: "Tahun berapa sandi morse ditemukan (sekitar)?", options: ["1700-an", "1830-an", "1900-an", "1950-an"], correct: 1 }
        ]
      }
    ]
  },
  {
    id: 'navigasi', title: "Navigasi", icon: Compass, subCategories: [{
      id: 'kompas',
      title: 'Kompas',
      explanationFrames: [
        { title: "Definisi", content: "Alat navigasi untuk menentukan arah mata angin." },
        { title: "Kompas Bidik", content: "Jenis kompas yang memiliki visir untuk membidik sasaran." }
      ],
      videoId: 'https://youtu.be/aWUvjnvSlao?si=HpPmr3AzLVTu54sH',
      imageTutorials: [
        { title: "Bagian Bagian Kompas Bidik", url: "https://pramukaku.com/wp-content/uploads/2022/09/Bagian-bagian-kompas-bidik-terlengkap.jpg" },
      ],
      quiz: [
        { question: "Fungsi utama kompas adalah untuk?", options: ["Mengukur jarak", "Menentukan arah mata angin", "Mengukur suhu", "Melihat benda jauh"], correct: 1 },
        { question: "Jarum kompas selalu menunjuk ke arah?", options: ["Utara Magnetik", "Utara Sebenarnya", "Barat", "Timur"], correct: 0 },
        { question: "Sudut 90 derajat pada kompas menunjukkan arah?", options: ["Utara", "Selatan", "Timur", "Barat"], correct: 2 },
        { question: "Arah Selatan menunjukkan sudut berapa derajat?", options: ["0", "90", "180", "270"], correct: 2 },
        { question: "Bagian kompas yang berupa garis rambut untuk membidik disebut?", options: ["Dial", "Visir", "Kaca Pembesar", "Jarum"], correct: 1 },
        { question: "Arah 'Back Azimuth' dari 90 derajat adalah?", options: ["180", "270", "0", "360"], correct: 1 },
        { question: "Jika Azimuth 200 derajat, maka Back Azimuth-nya adalah?", options: ["20", "100", "200", "380"], correct: 0 },
        { question: "Permukaan kompas di mana tertera angka dan huruf mata angin disebut?", options: ["Visir", "Dial", "Tutup", "Lensa"], correct: 1 },
        { question: "Arah Barat Laut (North West) berada di derajat?", options: ["45", "135", "225", "315"], correct: 3 },
        { question: "Kompas yang biasa digunakan Pramuka untuk membidik adalah?", options: ["Kompas Silva", "Kompas Prisma/Bidik", "Kompas Gire", "Kompas Digital"], correct: 1 },
        { question: "Rumus Back Azimuth jika sudut < 180 derajat adalah?", options: ["Ditambah 180", "Dikurangi 180", "Dikali 2", "Dibagi 2"], correct: 0 },
        { question: "Logam atau benda magnetis di dekat kompas akan menyebabkan?", options: ["Kompas lebih akurat", "Deviasi/Penyimpangan jarum", "Kompas rusak permanen", "Tidak ada efek"], correct: 1 },
        { question: "Utara Peta (Grid North) berbeda dengan?", options: ["Utara Jawa", "Utara Magnetis", "Utara Kompas", "Semua salah"], correct: 1 },
        { question: "Mata angin antara Timur dan Selatan adalah?", options: ["Barat Daya", "Tenggara", "Timur Laut", "Barat Laut"], correct: 1 },
        { question: "Derajat 225 menunjukkan arah?", options: ["Barat Daya", "Tenggara", "Barat Laut", "Timur Laut"], correct: 0 }
      ]
    }]
  },
  {
    id: 'menaksir', title: "Menaksir", icon: Ruler, subCategories: [{
      id: 'tinggi',
      title: 'Menaksir Tinggi',
      explanationFrames: [
        { title: "Metode Bayangan", content: "Membandingkan bayangan benda dengan bayangan tongkat." },
        { title: "Metode Segitiga", content: "Menggunakan prinsip kesebangunan segitiga." }
      ],
      videoId: 'https://youtu.be/rUu7rlNxxbc?si=r-EHO6syyTgjyt1u',
      imageTutorials: [
        { title: "Rumus Menaksir Tinggi", url: "https://i.ytimg.com/vi/oHXou3lQzIA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDJOCap4ihxx8K6pyyH4Im03RRrdQ" },
      ],
      quiz: [
        { question: "Apa prinsip dasar menaksir tinggi dengan metode segitiga?", options: ["Kesebangunan", "Pythagoras", "Archimedes", "Newton"], correct: 0 },
        { question: "Alat sederhana untuk menaksir tinggi pohon adalah?", options: ["Meteran baju", "Tongkat dan bayangan", "Termometer", "Barometer"], correct: 1 },
        { question: "Jika tongkat 1m bayangannya 50cm, berapa tinggi pohon jika bayangannya 10m?", options: ["5m", "10m", "20m", "15m"], correct: 2 },
        { question: "Menaksir tinggi termasuk dalam teknik kepramukaan bidang?", options: ["Tali temali", "Mapping", "Estimasi/Perkiraan", "Sandi"], correct: 2 },
        { question: "Posisi penaksir saat menggunakan metode pembaringan adalah?", options: ["Berdiri tegak", "Berbaring/Tiaraf", "Duduk bersila", "Berlari"], correct: 1 },
        { question: "Satu langkah kaki rata-rata manusia dewasa (langkah biasa) kira-kira?", options: ["20-30 cm", "60-70 cm", "100-120 cm", "150 cm"], correct: 1 },
        { question: "Metode 'pencerminan' dalam menaksir bisa menggunakan?", options: ["Genangan air / Cermin", "Batu", "Kayu kering", "Daun"], correct: 0 },
        { question: "Apa kuncinya agar taksiran akurat?", options: ["Alat mahal", "Ketelitian dan latihan", "Kecepatan", "Cuaca panas"], correct: 1 },
        { question: "Menaksir lebar sungai dapat menggunakan metode?", options: ["Segitiga siku-siku", "Lempar batu", "Kait", "Kompas"], correct: 0 },
        { question: "Sudut istimewa yang sering dipakai menaksir adalah?", options: ["30 derajat", "45 derajat", "75 derajat", "100 derajat"], correct: 1 },
        { question: "Rumus menaksir tinggi dengan bayangan adalah?", options: ["Tinggi = Bayangan x 2", "Tinggi Pohon / Bayangan Pohon = Tinggi Tongkat / Bayangan Tongkat", "Tinggi = Lebar x Panjang", "Semua salah"], correct: 1 },
        { question: "Margin error (toleransi kesalahan) dalam menaksir umumnya adalah?", options: ["0% (Harus Tepat)", "5-10%", "50%", "80%"], correct: 1 },
        { question: "Jika tidak ada matahari (mendung), metode apa yang TIDAK bisa dipakai?", options: ["Metode Segitiga", "Metode Bayangan", "Metode Pembaringan", "Metode Perbandingan"], correct: 1 },
        { question: "Alat 'Clinometer' sederhana digunakan untuk mengukur?", options: ["Suhu", "Ketinggian/Sudut Elevasi", "Kedalaman air", "Kecepatan angin"], correct: 1 },
        { question: "Dalam menaksir lebar sungai, titik di seberang sungai disebut?", options: ["Titik A", "Titik Bantu", "Titik Acuan/Sasaran", "Titik Buta"], correct: 2 }
      ]
    }]
  },
  {
    id: 'p3k', title: "P3K", icon: HeartPulse, subCategories: [{
      id: 'luka',
      title: 'Penanganan Luka',
      explanationFrames: [
        { title: "Luka Iris", content: "Bersihkan luka menggunakan air mengalir, lalu tekan luka bukan dengan kapas tetapi menggunakan kasa ataupun kain yang bersih, lalu tinggal tutup menggunakan plester." },
        { title: "Pertolongan pertama", content: "Pertolongan pertama adalah langkah pertama dalam menangani luka." }
      ],
      videoId: 'https://youtu.be/Tx_2KB6q6MY?si=AFBrDfiX0wopa1gl',
      imageTutorials: [],
      quiz: [
        { question: "Tindakan pertama saat menangani luka lecet kotor adalah?", options: ["Diberi kecap", "Dicuci air mengalir bersih", "Ditutup plester langsung", "Dibiarkan kering"], correct: 1 },
        { question: "Kain segitiga dalam P3K disebut?", options: ["Kasa", "Mitella", "Perban gulung", "Plester"], correct: 1 },
        { question: "Fungsi utama antiseptik (obat merah/betadine) adalah?", options: ["Menghentikan darah", "Membunuh kuman", "Mendinginkan luka", "Membius luka"], correct: 1 },
        { question: "Jika terjadi pendarahan hebat (arteri), tindakan utamanya adalah?", options: ["Tekan langsung pada sumber luka", "Beri minum", "Kipas-kipas", "Olesi minyak"], correct: 0 },
        { question: "Posisi kaki ditinggikan (elevasi) berguna untuk pasien?", options: ["Patah tulang leher", "Shock/Pingsan", "Sakit gigi", "Sakit perut"], correct: 1 },
        { question: "Singkatan RICE dalam penanganan terkilir adalah?", options: ["Rest, Ice, Compression, Elevation", "Run, Ice, Cold, Eat", "Rest, Iron, Cut, Elevation", "Run, Ignore, Call, Exit"], correct: 0 },
        { question: "Luka bakar ringan sebaiknya disiram dengan?", options: ["Air mengalir 10-20 menit", "Air es batu", "Minyak goreng", "Pasta gigi"], correct: 0 },
        { question: "Balut tekan digunakan untuk?", options: ["Menghentikan pendarahan", "Menghangatkan tubuh", "Hiasan", "Menutup mata"], correct: 0 },
        { question: "Tanda-tanda patah tulang (fraktur) adalah, KECUALI?", options: ["Bengkak", "Nyeri hebat", "Berubah bentuk", "Gatal-gatal"], correct: 3 },
        { question: "CPR (RJP) dilakukan pada korban yang?", options: ["Patah kaki", "Pingsan bernapas", "Henti jantung & henti napas", "Mimisan"], correct: 2 },
        { question: "Fungsi bidai (spalk) adalah untuk?", options: ["Melancarkan darah", "Memimobilisasi (mengunci) tulang patah", "Mengompres", "Mengganjal kepala"], correct: 1 },
        { question: "Obat untuk menurunkan demam adalah?", options: ["Paracetamol", "Antiseptik", "Oralit", "Minyak kayu putih"], correct: 0 },
        { question: "Jika mimisan, posisi kepala sebaiknya?", options: ["Menengadah ke atas", "Menunduk sedikit ke depan", "Berbaring telentang", "Miring ke kiri"], correct: 1 },
        { question: "Oralit digunakan untuk pertolongan pertama penyakit?", options: ["Demam berdarah", "Diare/Dehidrasi", "Flu", "Batuk"], correct: 1 },
        { question: "DRSABC adalah alur pertolongan. Huruf D artinya?", options: ["Danger (Bahaya)", "Doctor", "Drugs", "Drink"], correct: 0 }
      ]
    }]
  },
  {
    id: 'survival', title: "Survival", icon: Flame, subCategories: [{
      id: 'bivak',
      title: 'Membuat Bivak',
      explanationFrames: [
        { title: "Bivak Darurat", content: "Menggunakan bahan mantel ponco, tali dan tongkat (Opsional)." },
        { title: "Lokasi", content: "Hindari aliran air kering dan di bawah pohon rapuh." }
      ],
      videoId: 'https://youtu.be/qXvOs07sAsk?si=qG7MMLS-mguqaoH5',
      imageTutorials: [
        { title: "Step Membuat Bivak Darurat", url: "/Image/Gemini_Generated_Image_63ti3j63ti3j63ti.png" },
      ],
      quiz: [
        { question: "Syarat utama lokasi bivak adalah, KECUALI?", options: ["Kering & rata", "Terlindung dari angin", "Di jalur binatang buas", "Dekat sumber air"], correct: 2 },
        { question: "Bivak adalah tempat berlindung yang sifatnya?", options: ["Permanen", "Sementara/Darurat", "Mewah", "Bertingkat"], correct: 1 },
        { question: "Mengapa tidak boleh mendirikan bivak di aliran sungai kering?", options: ["Tanahnya keras", "Banjir bandang tiba-tiba", "Banyak hantu", "Sulit tidur"], correct: 1 },
        { question: "Bahan alami terbaik untuk atap bivak adalah?", options: ["Daun lebar (pisang/palem)", "Ranting kering", "Batu", "Pasir"], correct: 0 },
        { question: "Parit di sekeliling bivak berfungsi untuk?", options: ["Hiasan", "Mengalirkan air hujan agar tidak masuk", "Jebakan hewan", "Tempat sampah"], correct: 1 },
        { question: "Tujuan utama membuat api unggun di depan bivak adalah, KECUALI?", options: ["Menghangatkan badan", "Mengusir hewan buas", "Memasak", "Membakar hutan"], correct: 3 },
        { question: "Ponco/Jas hujan dapat digunakan untuk membuat bivak jenis?", options: ["Igloo", "Bivak Ponco/Tarp Tent", "Gua", "Rumah Pohon"], correct: 1 },
        { question: "Arah pintu bivak sebaiknya?", options: ["Menghadap arah angin", "Membelakangi arah angin", "Menghadap langit", "Menghadap jurang"], correct: 1 },
        { question: "SURVIVAL berasal dari kata Survive yang artinya?", options: ["Mati", "Bertahan hidup", "Menyerah", "Berkelana"], correct: 1 },
        { question: "Di hutan, air bisa didapatkan dari, KECUALI?", options: ["Sungai", "Air hujan", "Air laut langsung", "Akar gantung (banir)"], correct: 2 },
        { question: "Tanda-tanda air yang layak minum secara darurat adalah?", options: ["Berwarna warni", "Tidak berbau, tidak berasa, jernih", "Manis", "Berbusa"], correct: 1 },
        { question: "Makanan darurat di hutan disebut?", options: ["Survival Food", "Fast Food", "Junk Food", "Seafood"], correct: 0 },
        { question: "Hewan yang sebaiknya dihindari untuk dimakan adalah?", options: ["Ikan", "Belalang", "Katak berwarna cerah", "Burung"], correct: 2 },
        { question: "STOP dalam survival adalah singkatan dari?", options: ["Seat, Think, Observe, Plan", "Stop, Talk, Open, Play", "See, Touch, Open, Push", "Sit, Take, On, Power"], correct: 0 },
        { question: "Fungsi bivak adalah melindungi dari?", options: ["Panas, Hujan, Angin", "Teman", "Makanan", "Cahaya matahari saja"], correct: 0 }
      ]
    }]
  },
  {
    id: 'pbb', title: "PBB", icon: Users, subCategories: [{
      id: 'dasar',
      title: 'Gerakan Dasar',
      explanationFrames: [
        { title: "Sikap Sempurna", content: "Berdiri tegak, pandangan lurus, tangan mengepal di samping jahitan celana." },
        { title: "Hormat", content: "Mengangkat tangan kanan membentuk sudut siku." }
      ],
      videoId: 'https://youtu.be/1Md_uIJE1WM?si=fhGh9U_HOK9NvQM8',
      imageTutorials: [],
      quiz: [
        { question: "Aba-aba dalam PBB terdiri dari 3 tahapan, yaitu?", options: ["Awal, Tengah, Akhir", "Peringatan, Petunjuk, Pelaksanaan", "Satu, Dua, Tiga", "Siap, Mulai, Selesai"], correct: 1 },
        { question: "Posisi tangan saat sikap sempurna adalah?", options: ["Di pinggang", "Mengepal lurus di samping jahitan celana", "Melipat di dada", "Dibelakang punggung"], correct: 1 },
        { question: "Saat aba-aba 'Istirahat di tempat', kaki yang bergerak adalah?", options: ["Kaki Kanan", "Kaki Kiri", "Kedua Kaki", "Melompat"], correct: 1 },
        { question: "Sudut kaki saat sikap sempurna adalah?", options: ["90 derajat", "45 derajat", "0 derajat (rapat)", "180 derajat"], correct: 1 },
        { question: "Aba-aba 'Maju... JALAN' digunakan untuk gerakan?", options: ["Di tempat", "Meninggalkan tempat", "Berhenti", "Hormat"], correct: 1 },
        { question: "Saat 'Lencang Kanan', kepala menoleh ke?", options: ["Kiri", "Kanan", "Bawah", "Lurus"], correct: 1 },
        { question: "Posisi jari tangan saat hormat adalah?", options: ["Mengepal", "Membuka lebar", "Rapat dan lurus", "Membentuk V"], correct: 2 },
        { question: "Apa arti aba-aba 'Balik Kanan'?", options: ["Putar 90 derajat", "Putar 180 derajat", "Putar 45 derajat", "Jalan mundur"], correct: 1 },
        { question: "PBB adalah singkatan dari?", options: ["Peraturan Baris Berbaris", "Pasukan Baris Berbaris", "Pelatiham Baris Berbaris", "Persatuan Baris Berbaris"], correct: 0 },
        { question: "Saat berjalan, langkah kaki pertama dimulai dengan kaki?", options: ["Kanan", "Kiri", "Bebas", "Melompat"], correct: 1 },
        { question: "Panjang langkah biasa dalam PBB kira-kira?", options: ["40cm", "65cm", "1 meter", "20cm"], correct: 1 },
        { question: "Berapa tempo langkah tegap per menit?", options: ["120 langkah", "96 langkah", "60 langkah", "180 langkah"], correct: 0 },
        { question: "Aba-aba pelaksanaan yang digunakan untuk gerakan serentak adalah?", options: ["MULAI", "JALAN", "GERAK", "SIAP"], correct: 2 },
        { question: "Bagaimana pandangan mata saat sikap sempurna?", options: ["Lurus ke depan", "Melirik ke komandan", "Melihat tanah", "Memejamkan mata"], correct: 0 },
        { question: "Apa tujuan utama PBB?", options: ["Hukuman", "Melatih disiplin dan kekompakan", "Olahraga", "Bersenang-senang"], correct: 1 }
      ]
    }]
  },
];

export default function Latihan() {

  const [activePillarId, setActivePillarId] = useState(pillarsData[0].id);
  const [activeSubCatId, setActiveSubCatId] = useState(pillarsData[0].subCategories[0].id);


  const [quizStep, setQuizStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scoreCount, setScoreCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);


  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const activePillar = pillarsData.find(p => p.id === activePillarId) || pillarsData[0];
  const activeSubCategory = activePillar.subCategories.find(s => s.id === activeSubCatId) || activePillar.subCategories[0];
  const currentQuizData = activeSubCategory.quiz;


  const resetQuiz = () => {
    setQuizStep(0);
    setSelectedOption(null);
    setScoreCount(0);
    setIsQuizFinished(false);
  };


  useEffect(() => {
    setActiveSubCatId(activePillar.subCategories[0].id);
    resetQuiz();
  }, [activePillarId]);


  useEffect(() => {
    resetQuiz();
  }, [activeSubCatId]);


  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };






  const handleNextQuestion = () => {
    if (selectedOption === currentQuizData[quizStep].correct) {
      setScoreCount(prev => prev + 1);
    }
    if (quizStep < currentQuizData.length - 1) {
      setQuizStep(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsQuizFinished(true);
    }
  };

  const finalScore = currentQuizData.length > 0
    ? Math.round((scoreCount / currentQuizData.length) * 100)
    : 0;

  return (
    <section className={`w-full min-h-screen bg-[#FAFAFA] pt-24 pb-20 ${dmSans.className}`}>
      <div className="w-full px-6 md:px-12 lg:px-[315px] mx-auto">



        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">


          <div className="lg:hidden w-full mb-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Pilih Materi</h3>
            </div>

            {pillarsData.map((pillar) => {
              const isActive = activePillarId === pillar.id;
              return (
                <div key={pillar.id} className="border-b border-gray-50 last:border-0">

                  <button
                    onClick={() => setActivePillarId(pillar.id)}
                    className={`w-full flex items-center justify-between p-4 transition-all duration-300 ${isActive ? 'bg-[#FDF8F3] text-[#C9A86A]' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <pillar.icon size={20} />
                      <span className="font-semibold">{pillar.title}</span>
                    </div>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                  </button>


                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-white"
                      >
                        <div className="p-2 space-y-1">
                          {pillar.subCategories.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setActiveSubCatId(sub.id);

                              }}
                              className={`w-full text-left px-4 py-3 rounded-lg text-sm ml-4 border-l-2 transition-all ${activeSubCatId === sub.id
                                ? 'border-[#C9A86A] text-[#C9A86A] bg-gray-50 font-medium'
                                : 'border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                              {sub.title}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>


          <div className="hidden lg:block w-1/4 sticky top-24 z-20">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">
                Kategori Latihan
              </h3>
              <nav className="space-y-1">
                {pillarsData.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePillarId(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activePillarId === item.id
                      ? 'bg-[#FDF8F3] text-[#C9A86A] shadow-sm ring-1 ring-[#C9A86A]/20'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <item.icon size={18} className={activePillarId === item.id ? 'text-[#C9A86A]' : 'text-gray-400'} />
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>


          <div className="w-full lg:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillarId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >

                <div className="mb-8 hidden lg:block">
                  <h1 className="text-4xl font-bold text-[#231F1E] mb-2">{activePillar.title}</h1>
                  <p className="text-gray-500 text-sm">Pilih materi spesifik di bawah ini.</p>
                </div>


                <div className="hidden lg:flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                  {activePillar.subCategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubCatId(sub.id)}
                      className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 border ${activeSubCatId === sub.id
                        ? 'bg-[#231F1E] text-white border-[#231F1E]'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-[#C9A86A] hover:text-[#C9A86A]'
                        }`}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>


                <div className="lg:hidden mb-6 border-b pb-4 border-gray-200">
                  <h2 className="text-2xl font-bold text-[#231F1E]">{activeSubCategory.title}</h2>
                  <p className="text-xs text-gray-400 mt-1">{activePillar.title}</p>
                </div>

                <motion.div
                  key={activeSubCatId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-10"
                >

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="text-[#C9A86A]" size={20} />
                      <h3 className="text-lg font-bold text-[#231F1E]">Penjelasan Materi</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeSubCategory.explanationFrames.map((frame, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                          <div className="w-8 h-1 bg-[#C9A86A] rounded-full mb-4"></div>
                          <h4 className="font-bold text-gray-900 mb-3 text-lg">{frame.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed text-justify">{frame.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>


                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <PlayCircle className="text-[#C9A86A]" size={20} />
                      <h3 className="text-lg font-bold text-[#231F1E]">Video Tutorial</h3>
                    </div>
                    <div className="w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-lg border-4 border-white relative">
                      {activeSubCategory.videoId ? (() => {

                        const getVideoId = (url: string) => {
                          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                          const match = url.match(regExp);
                          return (match && match[2].length === 11) ? match[2] : url;
                        };
                        const vidId = getVideoId(activeSubCategory.videoId);

                        return (
                          <iframe
                            width="100%" height="100%"
                            src={`https://www.youtube.com/embed/${vidId}`}
                            title={activeSubCategory.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        );
                      })() : (
                        <div className="flex items-center justify-center w-full h-full text-gray-500">Video belum tersedia</div>
                      )}
                    </div>
                  </div>


                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="text-[#C9A86A]" size={20} />
                      <h3 className="text-lg font-bold text-[#231F1E]">Gambar Tutorial</h3>
                    </div>

                    {activeSubCategory.imageTutorials && activeSubCategory.imageTutorials.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeSubCategory.imageTutorials.map((img: any, idx: number) => (
                          <div key={idx} className="group relative bg-white p-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative bg-gray-100">
                              <img
                                src={img.url}
                                alt={img.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />


                              <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => setSelectedImage(img.url)}
                                  className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-gray-900 rounded-lg shadow-lg transition-all transform hover:scale-110"
                                  title="Perbesar Layar"
                                >
                                  <Maximize2 size={20} />
                                </button>
                              </div>
                            </div>
                            <p className="mt-3 mb-1 text-center font-bold text-gray-700 text-sm">{img.title}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 text-sm">
                        Belum ada gambar tutorial tersedia.
                      </div>
                    )}
                  </div>


                  <div className="bg-[#FFFBF2] p-6 md:p-10 rounded-3xl border border-[#F5E6D3] min-h-[400px] relative overflow-hidden">
                    {currentQuizData.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">Belum ada kuis tersedia.</div>
                    ) : !isQuizFinished ? (
                      <motion.div
                        key={quizStep}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex justify-between items-center mb-8">
                          <div className="flex items-center gap-2">
                            <HelpCircle className="text-[#C9A86A]" size={24} />
                            <h3 className="text-xl font-bold text-[#231F1E]">Uji Pemahaman</h3>
                          </div>
                          <span className="bg-white px-4 py-1 rounded-full text-sm font-bold text-[#C9A86A] border border-[#C9A86A]">
                            {quizStep + 1} / {currentQuizData.length}
                          </span>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-lg md:text-xl font-bold text-[#231F1E] leading-relaxed">
                            {currentQuizData[quizStep].question}
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-8">
                          {currentQuizData[quizStep].options.map((opt, idx) => {
                            const isSelected = selectedOption === idx;
                            const label = String.fromCharCode(65 + idx);
                            return (
                              <button
                                key={idx}
                                onClick={() => handleOptionSelect(idx)}
                                className={`relative flex items-center p-4 rounded-xl border text-left transition-all duration-200 group
                                                    ${isSelected
                                    ? 'bg-[#231F1E] border-[#231F1E] text-white shadow-lg scale-[1.01]'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#C9A86A] hover:text-[#C9A86A]'
                                  }
                                                `}
                              >
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold mr-4 transition-colors
                                                    ${isSelected ? 'bg-[#C9A86A] text-[#231F1E]' : 'bg-gray-100 text-gray-500 group-hover:bg-[#C9A86A] group-hover:text-white'}
                                                `}>
                                  {label}
                                </span>
                                <span className="text-sm md:text-base font-medium flex-grow">{opt}</span>
                                {isSelected && <CheckCircle2 size={20} className="text-[#C9A86A]" />}
                              </button>
                            );
                          })}
                        </div>

                        {selectedOption !== null && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end"
                          >
                            <button
                              onClick={handleNextQuestion}
                              className="bg-[#C9A86A] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b8965e] transition-all shadow-lg flex items-center gap-2 transform hover:-translate-y-1"
                            >
                              {quizStep === currentQuizData.length - 1 ? "Kumpulkan" : "Lanjut"}
                              <ChevronRight size={20} />
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center text-center h-full py-10"
                      >
                        {finalScore === 100 ? (
                          <>
                            <motion.div
                              initial={{ rotate: -10, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                              className="relative mb-6"
                            >
                              <Trophy size={100} className="text-[#FFD700] fill-[#FFD700]" />
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-10 -left-10 w-[180px] h-[180px] bg-yellow-400/20 rounded-full blur-3xl -z-10"
                              />
                              <Star size={40} className="absolute -top-2 -right-8 text-[#C9A86A] fill-[#C9A86A] animate-bounce" />
                              <Star size={30} className="absolute top-10 -left-8 text-[#C9A86A] fill-[#C9A86A] animate-pulse" />
                            </motion.div>

                            <h2 className="text-4xl font-bold text-[#231F1E] mb-2">Luar Biasa!</h2>
                            <p className="text-gray-500 mb-6">Kamu menjawab semua pertanyaan dengan benar.</p>
                            <div className="text-6xl font-black text-[#C9A86A] mb-8">100</div>
                            <div className="px-6 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                              Sempurna
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mb-6 relative">
                              <div className="w-32 h-32 rounded-full border-8 border-[#C9A86A] flex items-center justify-center">
                                <span className="text-4xl font-bold text-[#231F1E]">{finalScore}</span>
                              </div>
                            </div>

                            <h2 className="text-2xl font-bold text-[#231F1E] mb-2">Quiz Selesai</h2>
                            <p className="text-gray-500 mb-8">Kamu menjawab {scoreCount} dari {currentQuizData.length} soal dengan benar.</p>

                            <button
                              onClick={resetQuiz}
                              className="flex items-center gap-2 bg-[#231F1E] text-white px-8 py-3 rounded-full font-bold hover:bg-[#3d3635] transition-all shadow-lg"
                            >
                              <RefreshCcw size={18} />
                              Mulai Ulang
                            </button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>

                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>


      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Fullscreen Preview"
              className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}