
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function MasukPage() {
  const [showPassword, setShowPassword] = useState(false);

  const logoColors = {
    title: "text-[#56ABD7]",
    subtitle: "text-[#7A7A7A]"
  };

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  const handleFacebookLogin = async () => {
    await signIn('facebook', { callbackUrl: '/' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 md:p-8 font-dm-sans">
      <div
        className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-700 ease-out animate-in fade-in-0 slide-in-from-top-10"
        style={{ animationDuration: '0.8s' }}
      >
        <div className="flex flex-col lg:flex-row">

          <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center">


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
              Masuk Sekarang!
            </h2>
            <p className="text-sm text-[#7A7A7A] text-center mb-8">
              Silahkan Masuk dengan email dan password anda yang udah terdaftar!
            </p>

            <form className="space-y-5" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email');
              const password = formData.get('password');

              const result = await signIn('credentials', {
                email,
                password,
                redirect: true,
                callbackUrl: '/'
              });
            }}>

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


              <div className="text-center text-[#7A7A7A] text-sm mt-6">
                Atau Masuk Cepat Dengan
              </div>
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition duration-200"
                >
                  <Image src="/Icon/google.svg" alt="Google" width={24} height={24} />
                </button>
                <div className="text-center text-[#7A7A7A] text-sm mt-2 pt-2">
                  atau
                </div>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition duration-200"
                >
                  <Image src="/Icon/facebook.svg" alt="Facebook" width={24} height={24} />
                </button>
              </div>

              <div className="text-center text-[#7A7A7A] text-sm mt-4">
                Belum punya akun? <Link href="/register" className="text-[#56ABD7] hover:text-[#3D3D3D] font-medium transition-colors">Daftar</Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#6B4D27] text-white font-semibold rounded-lg shadow-lg hover:bg-[#7A5F3D] transition duration-300 transform hover:scale-[1.01]"
              >
                Masuk
              </button>

            </form>
          </div>

          <div className="hidden lg:block lg:w-1/2 p-6 bg-[#DBC29E] relative">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute w-4/5 h-4/5 bg-[#C7A682]/60 rounded-[40%] top-[-10%] left-[-20%] transform rotate-[-30deg]"></div>
              <div className="absolute w-3/5 h-3/5 bg-[#C7A682]/40 rounded-full bottom-[-15%] right-[-10%]"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center h-full">
              <Image
                src="/Icon/MASKOT_GAJAH.svg"
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