// app/daftar/page.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function DaftarPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const logoColors = {
    title: "text-[#56ABD7]",
    subtitle: "text-[#7A7A7A]"
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Gagal mendaftar');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Wrapper utama: Memastikan halaman menempati seluruh viewport tinggi dan pusatkan konten
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 md:p-8 font-dm-sans">
      {/* Container Card Utama */}
      <div
        className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-700 ease-out animate-in fade-in-0 slide-in-from-top-10"
        style={{ animationDuration: '0.8s' }} // Animasi masuk/fade-in
      >
        <div className="flex flex-col lg:flex-row">

          {/* Bagian Kiri: Form Daftar */}
          <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">

            {/* === LOGO === */}
            <Link href="/" className="flex flex-col items-center mx-auto gap-5 mb-6 group">
              <Image
                src="/Logo/LogoAmbalan.svg"
                alt="Logo Ambalan"
                width={40}
                height={40}
                className="w-10 h-10 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="flex flex-col leading-tight text-center">
                <span
                  className={`text-xl font-bold tracking-wide transition-all duration-300 ${logoColors.title}`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  AMBALAN
                </span>
                <span
                  className={`text-[10px] tracking-[0.15em] transition-colors duration-300 ${logoColors.subtitle}`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  -SMKN 2 SURABAYA-
                </span>
              </div>
            </Link>

            <h2 className="text-2xl font-semibold text-[#3D3D3D] text-center mb-1">
              Daftar Sekarang!
            </h2>
            <p className="text-sm text-[#7A7A7A] text-center mb-8">
              Silahkan Daftar dengan email, password dan konfirmasi Password!
            </p>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}

              {/* Email Input */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#56ABD7] focus:border-[#56ABD7] transition duration-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#56ABD7] focus:border-[#56ABD7] transition duration-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#56ABD7] focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Konfirmasi Password Input */}
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Konfirmasi Password"
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#56ABD7] focus:border-[#56ABD7] transition duration-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#56ABD7] focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Opsi Daftar Dengan */}
              <div className="text-center text-[#7A7A7A] text-sm mt-6 pt-2">
                Atau Daftar Cepat Dengan
              </div>
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/' })}
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition duration-200"
                >
                  <Image src="/Icon/google.svg" alt="Google" width={24} height={24} />
                </button>
                <div className="text-center text-[#7A7A7A] text-sm mt-2 pt-2">
                  atau
                </div>
                <button
                  type="button"
                  onClick={() => signIn('facebook', { callbackUrl: '/' })}
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition duration-200"
                >
                  <Image src="/Icon/facebook.svg" alt="Facebook" width={24} height={24} />
                </button>
              </div>

              {/* Sudah Punya Akun */}
              <div className="text-center text-[#7A7A7A] text-sm mt-4">
                Sudah punya akun? <Link href="/login" className="text-[#56ABD7] hover:text-[#3D3D3D] font-medium transition-colors">Masuk</Link>
              </div>

              {/* Tombol Daftar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#6B4D27] text-white font-semibold rounded-lg shadow-lg hover:bg-[#7A5F3D] transition duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Mendaftar...' : 'Daftar'}
              </button>

            </form>
          </div>

          {/* Bagian Kanan: Ilustrasi (Hanya Tampil di Desktop) */}
          <div className="hidden lg:block lg:w-1/2 p-6 bg-[#DBC29E] relative">
            {/* Background Shape */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute w-4/5 h-4/5 bg-[#C7A682]/60 rounded-[40%] top-[-10%] left-[-20%] transform rotate-[-30deg]"></div>
              <div className="absolute w-3/5 h-3/5 bg-[#C7A682]/40 rounded-full bottom-[-15%] right-[-10%]"></div>
            </div>

            {/* Ilustrasi */}
            <div className="relative z-10 flex items-center justify-center h-full">
              {/* Gunakan tag Image dengan source yang sesuai dengan ilustrasi Anda */}
              <Image
                src="/Icon/MASKOT_GAJAH.svg" // Ganti dengan path gambar gajah Anda
                alt="MASKOT Gajah Pramuka"
                width={400}
                height={500}
                className="max-h-full w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}