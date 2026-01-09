'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { DM_Sans } from 'next/font/google';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { Navigation, Send, Loader2, CheckCircle2, X, LogIn, UserPlus, AlertTriangle, MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { submitContactForm } from '../actions';


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
});


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 10 },
  },
};

const rightSideVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 70, damping: 15, delay: 0.5 },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};


interface InputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: string;
  isTextArea?: boolean;
  error?: string | boolean;
}

const CustomInput = ({ name, value, onChange, placeholder, type = "text", isTextArea = false, error }: InputProps) => {
  return (
    <motion.div variants={itemVariants} className="relative mb-5">
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className={`w-full bg-white rounded-lg py-4 px-5 text-gray-800 placeholder-gray-400 resize-none 
          border transition-all
          ${error
              ? 'border-red-500 ring-red-200 focus:ring-red-500 ring-1'
              : 'border-transparent hover:border-[#9C7C5B] hover:ring-1 hover:ring-[#9C7C5B] focus:outline-none focus:ring-2 focus:ring-[#9C7C5B]'
            }`}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white rounded-lg py-4 px-5 text-gray-800 placeholder-gray-400 
          border transition-all
          ${error
              ? 'border-red-500 ring-red-200 focus:ring-red-500 ring-1'
              : 'border-transparent hover:border-[#9C7C5B] hover:ring-1 hover:ring-[#9C7C5B] focus:outline-none focus:ring-2 focus:ring-[#9C7C5B]'
            }`}
        />
      )}
      {error && <p className="text-red-500 text-xs mt-1">silahkan masukan contoh {placeholder.replace("Tulis ", "").replace(" Anda di sini...", "")} anda</p>}
    </motion.div>
  );
};


interface PhoneInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | boolean;
}

const PhoneInput = ({ name, value, onChange, error }: PhoneInputProps) => {

  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);


  useEffect(() => {
    if (value) setIsActive(true);
  }, [value]);


  const handleBlur = () => {
    if (!value) {
      setIsActive(false);
    }
  };

  return (
    <motion.div variants={itemVariants} className="relative mb-5 h-[58px]">
      {!isActive && !value ? (
        <div
          onClick={() => setIsActive(true)}
          className="w-full h-full bg-white rounded-lg px-5 flex items-center text-gray-400 cursor-text
          border border-transparent hover:border-[#9C7C5B] hover:ring-1 hover:ring-[#9C7C5B] transition-all"
        >
          Nomor Telepon / WhatsApp
        </div>
      ) : (
        <div className={`w-full h-full bg-white rounded-lg flex items-center overflow-hidden border transition-all ${error ? 'border-red-500 ring-red-200 ring-1' : 'border-transparent ring-2 ring-[#9C7C5B]'
          }`}>

          <div className="bg-gray-100 px-4 h-full flex items-center justify-center border-r border-gray-200 text-gray-600 font-medium select-none min-w-[60px]">
            +62
          </div>


          <input
            ref={inputRef}
            name={name}
            type="tel"
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            placeholder="8xx-xxxx-xxxx"
            className="w-full h-full bg-white px-4 text-gray-800 placeholder-gray-300 focus:outline-none"
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">silahkan masukan contoh No WhatsApp anda</p>}
    </motion.div>
  );
};


export default function Hub() {
  const { data: session } = useSession();
  const router = useRouter();


  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'confirmation' | 'login_required'>('confirmation');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');


  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    phone: '',
    pesan: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let validatedValue = value;


    if (name === 'nama') {
      validatedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }


    if (name === 'phone') {
      validatedValue = value.replace(/[^0-9]/g, '');
    }



    setFormData(prev => ({ ...prev, [name]: validatedValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  /* Logic button Hubungi invalid */
  const isValid = Boolean(
    formData.nama &&
    formData.email &&
    formData.phone &&
    formData.pesan
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      setModalType('login_required');
      setShowModal(true);
      return;
    }

    const newErrors: { [key: string]: boolean } = {};
    if (!formData.nama) newErrors.nama = true;
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.pesan) newErrors.pesan = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }


    setModalType('confirmation');
    setStatus('idle');
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    setStatus('loading');


    await submitContactForm(formData);


    setStatus('success');
    // Reset Form
    setFormData({ nama: '', email: '', phone: '', pesan: '' });
  };

  return (
    <section id="contact-form" className={`w-full min-h-screen bg-white overflow-hidden ${dmSans.className}`}>


      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
            >

              {status !== 'loading' && (
                <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
                  <X size={24} />
                </button>
              )}

              <div className="p-8 flex flex-col items-center text-center">


                {modalType === 'login_required' ? (
                  <div className="flex flex-col items-center py-2">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <LogIn size={40} className="text-[#9C7C5B]" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Login Diperlukan</h3>
                    <p className="text-gray-500 text-sm mb-8">
                      Anda harus masuk atau mendaftar terlebih dahulu untuk mengirim pesan kepada kami.
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                      <button
                        onClick={() => router.push('/login')}
                        className="w-full py-3 bg-[#9C7C5B] hover:bg-[#8A6A4B] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <LogIn size={18} /> Masuk
                      </button>
                      <button
                        onClick={() => router.push('/register')}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <UserPlus size={18} /> Daftar
                      </button>
                    </div>
                  </div>
                ) : (

                  <>

                    {status === 'success' ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center py-6"
                      >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 size={40} className="text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Terima Kasih!</h3>
                        <p className="text-gray-500 text-sm mb-6">
                          Pesan Anda telah berhasil diproses oleh sistem.
                        </p>
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                        >
                          Tutup
                        </button>
                      </motion.div>
                    ) : (

                      <>
                        <div className="flex flex-col items-center mb-6 w-full">
                          <div className="flex items-center gap-2 text-red-600 mb-2">
                            <AlertTriangle size={24} fill="none" className="stroke-current" />
                            <h3 className="font-bold text-lg tracking-wide">DISCLAIMER!!!</h3>
                          </div>
                          <p className="text-red-500 text-xs md:text-sm leading-relaxed px-2">
                            "Pastikan data yang Anda masukkan adalah data yang valid dan benar.
                            Kesalahan penulisan data dapat menghambat proses komunikasi."
                          </p>
                        </div>

                        <div className="w-full h-px bg-gray-200 mb-6"></div>

                        <div className="flex flex-col items-center mb-8 w-full">
                          <div className="flex items-center gap-2 text-green-600 mb-3">
                            <MessageCircle size={24} className="stroke-current" />
                            <h3 className="font-bold text-lg tracking-wide">PEMBERITAHUAN</h3>
                          </div>
                          <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-2">
                            Data Anda akan diproses secara otomatis oleh <b>(Sistem Mada)</b> dan dikirimkan langsung ke WhatsApp Admin.
                          </p>
                          <p className="text-green-700 font-medium text-xs md:text-sm">
                            "Mohon tunggu hingga proses pengiriman data selesai."
                          </p>
                        </div>

                        <button
                          onClick={handleFinalSubmit}
                          disabled={status === 'loading'}
                          className={`w-full py-3.5 rounded-xl shadow-lg transition-all duration-300 transform font-bold text-white flex items-center justify-center gap-2
                                ${status === 'loading'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#008000] hover:bg-[#006400] active:scale-95'
                            }`}
                        >
                          {status === 'loading' ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              Mengirim Data ke Sistem...
                            </>
                          ) : (
                            "Selesai"
                          )}
                        </button>
                      </>
                    )}
                  </>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row w-full min-h-screen">


        <div className="w-full lg:w-[60%] bg-[#322F2D] p-6 md:p-16 lg:py-[100px] lg:pl-[310px] lg:pr-[100px] flex flex-col justify-center relative z-10">

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="w-full"
          >

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
              Butuh Informasi? <br />
              <span className="text-[#C9A86A]">Hubungi Kami</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-300 mb-8 text-sm md:text-base">
              Isi formulir di bawah ini untuk pertanyaan atau kerja sama.
            </motion.p>


            <form onSubmit={handleSubmit}>


              <CustomInput
                name="nama"
                value={formData.nama}
                onChange={handleInputChange}
                placeholder="Nama Lengkap"
                error={errors.nama}
              />


              <CustomInput
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Alamat Email"
                error={errors.email}
              />


              <PhoneInput
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange(e)}
                error={errors.phone}
              />


              <CustomInput
                name="pesan"
                isTextArea={true}
                value={formData.pesan}
                onChange={handleInputChange}
                placeholder="Tulis pesan Anda di sini..."
                error={errors.pesan}
              />


              <motion.button
                variants={itemVariants}
                disabled={!isValid || status === 'loading' || status === 'success'}
                whileHover={isValid ? { scale: 1.02, backgroundColor: "#8A6A4B" } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
                onClick={handleSubmit}
                className={`w-full py-4 rounded-lg shadow-lg transition-all duration-300 font-bold text-white tracking-wide text-lg flex items-center justify-center gap-2
                  ${isValid && status !== 'success'
                    ? 'bg-[#9C7C5B] hover:bg-[#8A6A4B] cursor-pointer'
                    : status === 'success'
                      ? 'bg-green-600 cursor-default'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                  }
                `}
              >
                <>
                  Kirim Pesan <Send size={18} className="ml-1" />
                </>
              </motion.button>
            </form>

          </motion.div>
        </div>


        <motion.div
          className="w-full lg:w-[40%] relative min-h-[500px] lg:min-h-screen bg-gray-100 overflow-hidden flex items-center justify-center border-l-4 border-[#9C7C5B]"
          variants={rightSideVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >

          <div className="absolute inset-0 z-0">
            <Image
              src="/Image/baris.webp"
              alt="Peta Lokasi"
              fill
              className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              onError={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
          </div>


          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10 w-[85%] max-w-[380px] bg-white rounded-xl shadow-2xl overflow-hidden"
          >

            <div className="relative w-full h-40 bg-gray-200 overflow-hidden group cursor-pointer">
              <Image
                src="/Image/MAP.webp"
                alt="Mini Map View"
                fill
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
            </div>


            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">SMKN 2 Surabaya</h3>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded mt-1 inline-block uppercase tracking-wider">
                    Camp Ambalan
                    <br />
                    Buka : 07.00 - 17.00
                  </span>
                </div>
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Image src="/Logo/LogoAmbalan.svg" width={20} height={20} alt="Logo" className="opacity-80" />
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed mb-6 mt-3 border-l-2 border-[#C9A86A] pl-3">
                Jl. Tentara Genie Pelajar No.26, Petemon, Kec. Sawahan, Surabaya, Jawa Timur
              </p>


              <a
                href="https://www.google.com/maps/place/SMK+Negeri+2+Surabaya/@-7.2585122,112.7229803,1198m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2dd7f9503d619c43:0x411d4cbbe989434!8m2!3d-7.2585122!4d112.7255606!16s%2Fg%2F122rvvd1?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1F5E3C] hover:bg-[#184a2f] text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm"
              >
                <Navigation size={16} fill="currentColor" />
                Buka Peta
              </a>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}