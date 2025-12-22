'use client';

import React from 'react';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';


const playfair = DM_Sans({
  subsets: ['latin'],

  variable: '--font-playfair',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


const contactData = [
  {
    id: 1,
    label: "DM Instagram",
    value: "@arsmekda.scout",
    link: "https://instagram.com/arsmekda.scout",
    description: [
      "PRAMUKA SMK NEGERI 2 SURABAYA",
      "Gajah Mada – Tungga Dewi",
      "Gugus Depan 16.041 – 16.042"
    ]
  },
  {
    id: 2,
    label: "DM Tiktok",
    value: "@arsmekda",
    link: "https://tiktok.com/@arsmekda",
    description: [
      "Pramuka SMK Negeri 2 Surabaya"
    ]
  },
  {
    id: 3,
    label: "Nomor Whatsapp",
    value: "(+62) 87855875733",
    link: "https://wa.me/6287855875733",
    description: [
      "Kakak Admin",
      "Ambalan SMKN 2 Surabaya"
    ]
  }
];

export default function Medsos() {


  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    },
  };

  return (
    <section className={`w-full bg-[#FFFFFF] py-20 lg:py-32 overflow-hidden ${dmSans.className}`}>


      <motion.div
        className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-[315px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">


          <div className="w-full lg:w-[35%]">
            <motion.h2
              variants={itemVariants}
              className={`${playfair.className} text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight`}
            >
              Atau Bisa Hubungi <br />
              Kami Lewat...
            </motion.h2>
          </div>


          <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8">
            {contactData.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex flex-col"
              >

                <h3 className="text-lg md:text-xl font-bold text-[#1A1A1A] mb-3">
                  {item.label}
                </h3>


                <Link
                  href={item.link}
                  target="_blank"
                  className="text-[#A58B6F] hover:text-[#8a735b] text-xl md:text-2xl font-medium mb-4 transition-colors duration-300 inline-block"
                >
                  {item.value}
                </Link>


                <div className="text-gray-500 text-sm leading-relaxed space-y-1">
                  {item.description.map((desc, idx) => (
                    <p key={idx}>{desc}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.div>
    </section>
  );
}