
export const PRODUCT_DETAILS_MAP: Record<string, {
    slug: string;
    images: string[];
    price: string;
    duration: string;
}> = {
    'Tenda Prisma': {
        slug: 'tenda-segitiga',
        images: ['/Image/tenda1.webp'],
        price: '30k',
        duration: '3 hari'
    },
    'Tenda Segitiga/Kerucut': { // Alias if name varies
        slug: 'tenda-segitiga',
        images: ['/Image/tenda1.webp'],
        price: '30k',
        duration: '3 hari'
    },
    'Matras Spons': {
        slug: 'matras-spons',
        images: ['/Image/matras.webp'],
        price: '5k',
        duration: '1 hari'
    },
    'Tongkat Pramuka': {
        slug: 'tongkat-pramuka',
        images: ['/Image/tongkat.webp'],
        price: '3k',
        duration: '1 hari'
    },
    'Paket Lengkap': {
        slug: 'paket-lengkap',
        images: ['/Image/paket_lengkap.webp'],
        price: '60k',
        duration: '3 hari'
    },
    'Tali Pramuka': {
        slug: 'tali-pramuka',
        images: ['/Image/tali.webp'],
        price: '5k',
        duration: '1 hari'
    }
};
