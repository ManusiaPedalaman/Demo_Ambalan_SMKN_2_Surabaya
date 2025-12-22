

import type { Metadata } from "next";
import { Poppins, Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";


const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});



export const metadata: Metadata = {
  title: "Ambalan SMKN 2 Surabaya | Pramuka Penegak",
  description: "Website resmi Ambalan Gajah Mada - Tribuana Tungga Dewi SMKN 2 Surabaya. Informasi kegiatan, sejarah, dan produk pramuka.",
  keywords: ["Pramuka", "SMKN 2 Surabaya", "Ambalan", "Penegak", "Gajah Mada", "Tribuana Tungga Dewi", "Ekstrakurikuler"],
  authors: [{ name: "Ambalan SMKN 2 Surabaya" }],
  openGraph: {
    title: "Ambalan SMKN 2 Surabaya",
    description: "Website resmi Ambalan SMKN 2 Surabaya. Temukan informasi lengkap seputar kegiatan pramuka kami.",
    siteName: "Ambalan SMKN 2 Surabaya",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambalan SMKN 2 Surabaya",
    description: "Website resmi Ambalan SMKN 2 Surabaya.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playfair.variable} ${dmSans.variable} antialiased ...`}
        suppressHydrationWarning={true}
      >

        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}