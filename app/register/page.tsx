
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Shield, Eye, EyeOff, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DaftarPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Registration Flow States
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);

  // Password Strength State
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasLetter: false,
    hasSymbol: false,
  });

  const logoColors = {
    title: "text-[#56ABD7]",
    subtitle: "text-[#7A7A7A]"
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Password Validation Logic
  useEffect(() => {
    setPasswordStrength({
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isPasswordValid) return;
    if (password !== confirmPassword) {
      setError('Password konfirmasi tidak cocok');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'send' }),
      });

      if (response.ok) {
        setStep('otp');
        setTimer(600); // 10 minutes
      } else {
        const data = await response.json();
        setError(data.message || 'Gagal mengirim OTP');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    setError('');
    const otpString = otp.join('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, otp: otpString }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const data = await response.json();
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mendaftar.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedData.forEach((value, index) => {
        if (index < 6) newOtp[index] = value;
      });
      setOtp(newOtp);

      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pastedData.length, 5);
      document.getElementById(`otp-${focusIndex}`)?.focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 md:p-8 font-dm-sans">

      <div
        className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-700 ease-out animate-in fade-in-0 slide-in-from-top-10"
        style={{ animationDuration: '0.8s' }}
      >
        <div className="flex flex-col lg:flex-row">

          <div className="w-full lg:w-1/2 p-6 md:p-12 flex flex-col justify-center relative">

            {/* Header */}
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
              {step === 'email' && 'Daftar Sekarang!'}
              {step === 'otp' && 'Verifikasi Email'}
            </h2>
            <p className="text-sm text-[#7A7A7A] text-center mb-8">
              {step === 'email' && 'Masukkan email Anda untuk memulai pendaftaran.'}
              {step === 'otp' && `Masukkan 6 digit kode yang dikirim ke ${email}`}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-600 rounded-lg text-sm text-center flex items-center justify-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#56ABD7] focus:border-[#56ABD7] transition duration-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#56ABD7] focus:outline-none"
                  >
                    {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-green-600 font-medium' : ''}`}>
                    {passwordStrength.length ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                    Min 8 Karakter
                  </div>
                  <div className={`flex items-center gap-1 ${passwordStrength.hasLetter ? 'text-green-600 font-medium' : ''}`}>
                    {passwordStrength.hasLetter ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                    Huruf (A-z)
                  </div>
                  <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-600 font-medium' : ''}`}>
                    {passwordStrength.hasNumber ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                    Angka (0-9)
                  </div>
                  <div className={`flex items-center gap-1 ${passwordStrength.hasSymbol ? 'text-green-600 font-medium' : ''}`}>
                    {passwordStrength.hasSymbol ? <CheckCircle2 size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
                    Simbol (!@#$)
                  </div>
                </div>

                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#56ABD7] focus:border-[#56ABD7] transition duration-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#56ABD7] focus:outline-none"
                  >
                    {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email || !isPasswordValid || password !== confirmPassword}
                  className="w-full py-3 bg-[#6B4D27] text-white font-semibold rounded-lg shadow-lg hover:bg-[#7A5F3D] transition duration-300 transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Mengirim...' : 'Daftar'}
                </button>

                <div className="text-center text-[#7A7A7A] text-sm mt-6 pt-2">
                  Atau Daftar Cepat Dengan
                </div>
                <div className="flex justify-center mb-6">
                  <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="flex items-center justify-center gap-3 w-full max-w-[280px] py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-[#56ABD7] hover:shadow-md transition-all duration-300 group"
                  >
                    <Image src="/Icon/google.svg" alt="Google" width={24} height={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[#3D3D3D] font-medium text-sm">Google</span>
                  </button>
                </div>

                <div className="text-center text-[#7A7A7A] text-sm mt-4">
                  Sudah punya akun? <Link href="/login" className="text-[#56ABD7] hover:text-[#3D3D3D] font-medium transition-colors">Masuk</Link>
                </div>
              </form>
            )}

            {/* Step 2: OTP Input (Modal-like behavior inline) */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={handlePaste}
                      className="w-full h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-[#56ABD7] focus:ring-1 focus:ring-[#56ABD7] outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Berlaku selama: <span className="font-bold text-gray-700">{formatTime(timer)}</span></span>
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={timer > 540} // Enable resend after 1 min
                    className="text-[#56ABD7] hover:underline disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    Kirim Ulang
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 font-semibold rounded-lg hover:bg-gray-200 transition duration-300"
                  >
                    Ganti Email
                  </button>
                  <button
                    type="button"
                    onClick={handleRegister}
                    disabled={isLoading || otp.some(d => !d)}
                    className="flex-1 py-3 bg-[#6B4D27] text-white font-semibold rounded-lg shadow-lg hover:bg-[#7A5F3D] transition duration-300 disabled:opacity-50"
                  >
                    {isLoading ? 'Verifikasi...' : 'Verifikasi & Daftar'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 Removed */}

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
