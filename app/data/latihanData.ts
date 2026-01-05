
import {
    Anchor, Binary, Compass, Ruler, HeartPulse, Flame, Users,
} from 'lucide-react';

export const pillarsData = [
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
