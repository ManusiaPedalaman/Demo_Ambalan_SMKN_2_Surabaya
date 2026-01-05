'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { DM_Sans } from 'next/font/google';


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


const faqData = [
  {
    id: 1,
    question: 'Apa itu PRAMUKA?',
    answer: "Pramuka adalah singkatan dari Praja Muda Karana, yang berarti 'rakyat muda yang suka berkarya'. Pramuka adalah nama untuk anggota Gerakan Pramuka, yaitu sebuah organisasi pendidikan nonformal yang menyelenggarakan kegiatan kepanduan di Indonesia. Tujuan utamanya adalah membentuk karakter, akhlak, dan budi pekerti luhur pada anak-anak dan pemuda agar mereka menjadi pribadi yang beriman, patriotik, disiplin, serta cakap sebagai kader bangsa untuk membangun Indonesia.",
  },
  {
    id: 2,
    question: 'Apa itu PRAMUKA PENEGAK?',
    answer: 'Pramuka Penegak adalah anggota muda Gerakan Pramuka yang berusia 16 sampai dengan 20 tahun. Secara umum usia tersebut disebut masa sosial atau disebut juga masa remaja awal yaitu masa pencarian jati diri.',
  },
  {
    id: 3,
    question: 'Berapa jumlah dasa darma?',
    answer: 'Sesuai dengan namanya "Dasa" yang berarti sepuluh, Dasa Darma Pramuka berjumlah 10 butir ketentuan moral.',
  },
  {
    id: 4,
    question: 'Apa itu Ambalan?',
    answer: 'Ambalan adalah satuan gerak untuk golongan Pramuka Penegak, yang menghimpun anggotanya dari beberapa Sangga.',
  },
  {
    id: 5,
    question: 'Berapa maksud dari sangga?',
    answer: 'Sangga adalah satuan terkecil dalam Pramuka Penegak yang terdiri dari 4 hingga 8 orang. Nama sangga biasanya diambil dari kiasan perjuangan bangsa Indonesia.',
  },
  {
    id: 6,
    question: 'Apa serunya ikut Ambalan?',
    answer: 'Mengikuti Ambalan melatih kemandirian, kepemimpinan, memperluas jaringan pertemanan, serta banyak kegiatan outdoor yang menantang dan menyenangkan.',
  },
  {
    id: 7,
    question: 'Bagaimana cara menjadi anggota?',
    answer: 'Untuk menjadi anggota, ada 2 cara yang bisa kalian pakai yang pertama siswa harus mendaftarkan diri pada saat masa DEMO Ekskul, atau bisa langsung klik tombol JOIN yang ada dibawah dan isi formulir pendaftaran, nanti akan diproses oleh dewan ambalan di sekolah. Oh iya kalian bisa join kapan saja lohh... mulai dari kelas 10,11 atau 12 juga bisa. (PENDAFTARAN TUTUP pas KIAMAT), Mangkanya yuk buruan JOIN dan rasakan keseruannya.',
  },
  {
    id: 8,
    question: 'Bagaimana berdirinya Ambalan SMKN 2 Surabaya?',
    answer: 'Sejarah berdirinya ambalan ini bermula dari inisiatif para pendahulu yang ingin mewadahi kegiatan kepanduan yang terstruktur dan berkarakter di lingkungan SMKN 2 Surabaya.',
  },
  {
    id: 9,
    question: 'Siapa pencetus nama "Gajah Mada Tribuana Tungga Dewi"?',
    answer: 'Nama tersebut diambil dari tokoh pahlawan besar Majapahit sebagai simbol kekuatan, kebijaksanaan, dan kejayaan nusantara yang diharapkan terwujud dalam diri anggota.',
  },
  {
    id: 10,
    question: 'Mengapa didirikannya Pramuka di sekolah-sekolah?',
    answer: 'Pramuka didirikan di sekolah sebagai ekstrakurikuler wajib untuk membentuk karakter disiplin, cinta tanah air, dan keterampilan hidup (life skill) siswa di luar jam pelajaran formal.',
  },
];

export default function FAQ() {
  // State untuk melacak item mana yang terbuka (null artinya tertutup semua)
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className={`w-full bg-white py-20 px-6 md:px-12 lg:px-24 overflow-hidden ${dmSans.className}`}>
      <div className="max-w-5xl mx-auto">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-4 tracking-tight">
            FAQ
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Temukan jawaban dari pertanyaan umum mengenai Pramuka di sini.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div key={item.id} className="border-b border-gray-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
                >
                  <span className="text-lg md:text-xl font-bold text-black pr-8">
                    {item.question}
                  </span>

                  <span className="flex-shrink-0 transition-transform duration-300">
                    {isOpen ? (
                      <Minus className="w-6 h-6 text-black" />
                    ) : (
                      <Plus className="w-6 h-6 text-black group-hover:text-gray-600" />
                    )}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-600 text-base leading-relaxed pb-8 font-normal text-justify">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}