
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pillarsData = [
    {
        id: 'tali-temali',
        title: "Tali Temali",
        icon: 'Anchor',
        subCategories: [
            {
                id: 'simpul-mati',
                title: "Simpul Mati",
                explanationFrames: [
                    { title: "Definisi", content: "Simpul mati adalah simpul yang digunakan untuk menyambung dua utas tali yang sama besar dan tidak licin." },
                    { title: "Fungsi Utama", content: "Biasanya digunakan untuk mengakhiri suatu ikatan agar tidak mudah lepas namun tetap mudah dibuka kembali." },
                    { title: "Kesalahan Umum", content: "Sering tertukar dengan simpul nenek (granny knot) yang mudah lepas dan sulit dibuka jika basah." }
                ],
                videoId: "Z1N6rI4gvX0",
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
                ]
            },
            {
                id: 'simpul-jangkar',
                title: "Simpul Jangkar",
                explanationFrames: [
                    { title: "Pengenalan", content: "Simpul Jangkar (Cow Hitch) adalah salah satu simpul paling dasar dalam pembuatan pionering." },
                    { title: "Kegunaan", content: "Digunakan untuk mengikat jangkar darurat atau untuk mengikat tali pada ember timba." }
                ],
                videoId: "bQ9qWpL_cOo",
                quiz: [
                    { question: "Nama lain dari Simpul Jangkar adalah?", options: ["Clove Hitch", "Cow Hitch", "Reef Knot", "Sheet Bend"], correct: 1 },
                    { question: "Simpul jangkar biasa digunakan untuk?", options: ["Membuat tandu", "Mengikat ember timba", "Menyambung tali", "Hiasan"], correct: 1 }
                ]
            }
        ]
    },
    {
        id: 'sandi',
        title: "Sandi & Morse",
        icon: 'Binary',
        subCategories: [
            {
                id: 'sandi-morse',
                title: "Sandi Morse",
                explanationFrames: [
                    { title: "Sejarah", content: "Ditemukan oleh Samuel F.B. Morse." },
                    { title: "Konsep", content: "Titik dan Strip." }
                ],
                videoId: "m_YFq-tX1ks",
                quiz: [
                    { question: "Apa kode morse untuk huruf 'E'?", options: [".", "-", "..", "--"], correct: 0 },
                    { question: "Siapa penemu Sandi Morse?", options: ["Baden Powell", "Samuel Morse", "Thomas Edison", "Alexander Bell"], correct: 1 }
                ]
            }
        ]
    },
    { id: 'navigasi', title: "Navigasi", icon: 'Compass', subCategories: [{ id: 'kompas', title: 'Kompas', explanationFrames: [], videoId: '', quiz: [] }] },
    { id: 'menaksir', title: "Menaksir", icon: 'Ruler', subCategories: [{ id: 'tinggi', title: 'Menaksir Tinggi', explanationFrames: [], videoId: '', quiz: [] }] },
    { id: 'p3k', title: "P3K", icon: 'HeartPulse', subCategories: [{ id: 'luka', title: 'Penanganan Luka', explanationFrames: [], videoId: '', quiz: [] }] },
    { id: 'survival', title: "Survival", icon: 'Flame', subCategories: [{ id: 'bivak', title: 'Membuat Bivak', explanationFrames: [], videoId: '', quiz: [] }] },
    { id: 'pbb', title: "PBB", icon: 'Users', subCategories: [{ id: 'dasar', title: 'Gerakan Dasar', explanationFrames: [], videoId: '', quiz: [] }] },
];

async function main() {
    console.log('Seeding Data Materi...');
    for (const pillar of pillarsData) {
        const topikList = pillar.subCategories.map(s => s.title).join(', ');

        await prisma.dataMateriLatihan.upsert({
            where: { id_materi: pillar.id },
            update: {
                nama_materi: pillar.title,
                topik: topikList,
                icon: pillar.icon,
                // Convert the full structure to JSON
                content: pillar as any
            },
            create: {
                id_materi: pillar.id,
                nama_materi: pillar.title,
                topik: topikList,
                icon: pillar.icon,
                content: pillar as any
            }
        });
        console.log(`Upserted: ${pillar.title}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
