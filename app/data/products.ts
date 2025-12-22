export const products = [
    {
        slug: 'tenda-segitiga',
        name: 'Tenda Segitiga/Kerucut',
        dbName: 'Tenda Segitiga/Kerucut',
        price: 30000,
        originalPrice: 50000,
        duration: '3 hari',
        status: 'Tersedia',
        images: ['/Image/tenda1.webp', '/Image/tenda1.webp', '/Image/tenda1.webp'],
        specs: { berat: '1.5kg', muat: '6 - 8 Orang', dimensi: '200 X 260 X 160 cm', ketahananAir: '2000mm' },
        description: `Tenda segitiga, atau yang sering disebut tenda ridge, adalah jenis tenda yang memiliki bentuk menyerupai atap rumah dengan bagian atas berbentuk segitiga.`,
        features: [
            { title: 'Kapasitas', desc: 'Tersedia dalam berbagai ukuran, mulai dari tenda kecil untuk 1-2 orang.' },
            { title: 'Material', desc: 'D300 Canvas/Terpal.' }
        ]
    },
    {
        slug: 'matras-spons',
        name: 'Matras Spons',
        dbName: 'Matras Spons',
        price: 5000,
        originalPrice: 10000,
        duration: '1 hari',
        status: 'Tersedia',
        images: ['/Image/matras.webp', '/Image/matras.webp', '/Image/matras.webp'],
        specs: { berat: '0.4kg', muat: '1 Orang', dimensi: '180 x 60 cm', ketahananAir: 'Water Resistant' },
        description: `Matras spons ringan dan nyaman untuk alas tidur saat berkemah.`,
        features: [
            { title: 'Material', desc: 'Spons Eva berkualitas.' },
            { title: 'Fitur', desc: 'Mudah digulung dan ringan.' }
        ]
    },
    {
        slug: 'tongkat-pramuka',
        name: 'Tongkat Pramuka',
        dbName: 'Tongkat Pramuka',
        price: 3000,
        originalPrice: 5000,
        duration: '1 hari',
        status: 'Tersedia',
        images: ['/Image/tongkat.webp', '/Image/tongkat.webp', '/Image/tongkat.webp'],
        specs: { berat: '0.5kg', muat: '-', dimensi: '160 cm', ketahananAir: '-' },
        description: `Tongkat pramuka standar untuk kegiatan baris-berbaris dan pioneering.`,
        features: [
            { title: 'Material', desc: 'Kayu keras tahan lama.' },
            { title: 'Ukuran', desc: 'Standar 160cm.' }
        ]
    },
    {
        slug: 'paket-lengkap',
        name: 'Paket Lengkap Camping',
        dbName: 'Paket Lengkap', 
        price: 40000, 
        originalPrice: 75000,
        duration: '3 hari',
        status: 'Tersedia',
        images: ['/Image/paket_lengkap.webp', '/Image/paket_lengkap.webp', '/Image/paket_lengkap.webp'],
        specs: { berat: '5kg', muat: '4 Orang', dimensi: 'Varies', ketahananAir: 'High' },
        description: `Paket hemat untuk berkemah. Termasuk tenda, matras, dan alat masak sederhana.`,
        features: [
            { title: 'Isi Paket', desc: 'Tenda, Matras, Kompor, Nesting.' },
            { title: 'Kelebihan', desc: 'Lebih hemat dan praktis.' }
        ]
    },
    {
        slug: 'tali-pramuka',
        name: 'Tali Pramuka (Tambang)',
        dbName: 'Tali Pramuka', 
        price: 10000,
        originalPrice: 15000,
        duration: '3 hari',
        status: 'Tersedia',
        images: ['/Image/tali.webp', '/Image/tali.webp', '/Image/tali.webp'],
        specs: { berat: '0.3kg', muat: '-', dimensi: '10 meter', ketahananAir: '-' },
        description: `Tali tambang kuat untuk keperluan pioneering dan tali-temali.`,
        features: [
            { title: 'Material', desc: 'Serat nilon/katun kuat.' },
            { title: 'Panjang', desc: '10 meter.' }
        ]
    }
];
