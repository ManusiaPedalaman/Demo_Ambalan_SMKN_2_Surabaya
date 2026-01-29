'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronDown, Check, LogIn, UserPlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { submitJoinForm } from '../actions';
import Modal from '@/components/ui/Modal';
import { DM_Sans } from 'next/font/google';

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

// modalVariants removed as it is now inside Modal component

interface InputFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder: string;
  icon?: React.ReactNode;
  isDateInput?: boolean;
  isNameInput?: boolean;
  error?: string | boolean;
}

const InputField = ({ name, value, onChange, type = "text", placeholder, icon, isDateInput = false, isNameInput = false, error }: InputFieldProps) => {
  const [inputType, setInputType] = useState(isDateInput ? 'text' : type);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerPicker = () => {
    if (isDateInput && inputRef.current) {
      setInputType('date');
      inputRef.current.focus();
      setTimeout(() => {
        try {
          if (typeof (inputRef.current as any).showPicker === 'function') {
            (inputRef.current as any).showPicker();
          }
        } catch (err) { console.error(err); }
      }, 0);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (isDateInput && !e.target.value) {
      setInputType('text');
    }
  };

  return (
    <motion.div variants={itemVariants} className="relative mb-5">
      {isDateInput && (
        <style jsx>{`
          input[type="date"]::-webkit-calendar-picker-indicator,
          input[type="date"]::-webkit-inner-spin-button { display: none !important; -webkit-appearance: none; }
          input[type="date"] { -moz-appearance: textfield; }
        `}</style>
      )}
      <div className="relative w-full">
        <input
          ref={inputRef}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (isNameInput) {
              e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
            }
            onChange(e);
          }}
          onFocus={triggerPicker}
          onBlur={handleBlur}
          className={`w-full bg-white rounded-lg py-4 px-5 text-gray-800 placeholder-gray-400 
            border transition-all
            ${error
              ? 'border-red-500 ring-red-200 focus:ring-red-500 ring-1'
              : 'border-transparent hover:border-[#9C7C5B] hover:ring-1 hover:ring-[#9C7C5B] focus:outline-none focus:ring-2 focus:ring-[#9C7C5B]'
            } 
            ${inputType === 'date' ? 'cursor-pointer min-h-[58px] accent-[#9C7C5B]' : ''}
          `}
          style={inputType === 'date' ? { accentColor: '#9C7C5B' } : {}}
        />
        {icon && (
          <div onClick={triggerPicker} className={`absolute inset-y-0 right-4 flex items-center text-gray-400 z-20 ${isDateInput ? 'cursor-pointer hover:text-[#9C7C5B]' : 'pointer-events-none'}`}>
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">silahkan masukan contoh {placeholder.replace("Masukkan ", "").replace("...", "")} anda</p>}
    </motion.div>
  );
};

interface PhoneInputProps {
  name: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  error?: string | boolean;
}

const PhoneInput = ({ name, value, onChange, placeholder, error }: PhoneInputProps) => {

  const [isActive, setIsActive] = useState(false);
  const realInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) setIsActive(true);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/[^0-9]/g, '');

    if (inputValue.startsWith('0')) inputValue = inputValue.substring(1);
    onChange(inputValue);
  };


  const handleActivate = () => {
    setIsActive(true);

    setTimeout(() => {
      realInputRef.current?.focus();
    }, 50);
  };


  const handleBlur = () => {
    if (!value) {
      setIsActive(false);
    }
  };

  return (
    <motion.div variants={itemVariants} className="relative mb-5">
      {!isActive ? (

        <div
          onClick={handleActivate}
          className="w-full bg-white rounded-lg py-4 px-5 text-gray-400 cursor-text 
            border border-transparent hover:border-[#9C7C5B] hover:ring-1 hover:ring-[#9C7C5B] transition-all"
        >
          {placeholder}
        </div>
      ) : (

        <div className={`w-full bg-white rounded-lg flex items-center overflow-hidden border transition-all ${error ? 'border-red-500 ring-red-200 ring-1' : 'border-transparent ring-2 ring-[#9C7C5B]'
          }`}>
          <div className="bg-gray-100 px-4 py-4 border-r border-gray-200 text-gray-600 font-medium select-none h-full flex items-center">
            +62
          </div>
          <input
            ref={realInputRef}
            name={name}
            type="tel"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="8xx-xxxx-xxxx"
            className="w-full bg-white py-4 px-4 text-gray-800 placeholder-gray-400 focus:outline-none h-full"
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">silahkan masukan contoh No WhatsApp anda</p>}
    </motion.div>
  );
};


interface CustomSelectProps {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string | boolean;
}

const CustomSelect = ({ placeholder, options, value, onChange, error }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <motion.div variants={itemVariants} className="relative mb-5" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white rounded-lg py-4 px-5 flex items-center justify-between cursor-pointer transition-all border 
                ${error
            ? 'border-red-500 ring-red-200 ring-1'
            : `hover:border-[#9C7C5B] hover:ring-1 hover:ring-[#9C7C5B] ${isOpen ? 'ring-2 ring-[#9C7C5B] border-transparent' : 'border-transparent'}`
          }
                `}
      >
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl max-h-60 overflow-y-auto overflow-x-hidden border border-gray-100"
          >
            {options.map((option, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(option)}
                className="px-5 py-3 cursor-pointer text-gray-700 transition-colors duration-200 hover:bg-[#9C7C5B] hover:text-white flex justify-between items-center group"
              >
                <span>{option}</span>
                {value === option && <Check size={16} className="text-[#9C7C5B] group-hover:text-white" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {error && <p className="text-red-500 text-xs mt-1">Silahkan pilih {placeholder.replace("Pilih ", "")}</p>}
    </motion.div>
  );
};


const JoinUs = () => {
  const { data: session } = useSession();
  const router = useRouter();


  /* Auto-fill from session */
  useEffect(() => {
    async function fetchProfile() {
      if (session?.user?.email) {
        // Dynamic import to avoid server-side issues if needed, or stick to import
        // Assuming fetchProfile action is imported
        try {
          // Import here or at top. Since this is client component, we rely on server action
          // Note user might not have added import at top yet.
          const { getMyFullProfile } = await import('@/app/actions');
          const profile = await getMyFullProfile(session.user.email);
          
          if (profile) {
            setFormData(prev => ({
              ...prev,
              nama: profile.nama_lengkap || prev.nama,
              tanggalLahir: profile.tgl_lahir || prev.tanggalLahir,
              whatsapp: profile.no_wa || prev.whatsapp,
              sekolah: profile.sekolah_instansi || prev.sekolah,
              kelas: profile.kelas || prev.kelas,
              jurusan: profile.jurusan || prev.jurusan
            }));
          }
        } catch (err) {
            console.error("Auto-fill error:", err);
        }
      }
    }
    fetchProfile();
  }, [session]);

  const [formData, setFormData] = useState({
    nama: '',
    tanggalLahir: '',
    whatsapp: '',
    sekolah: '',
    kelas: '',
    jurusan: '',
    pesan: ''
  });


  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'confirmation' | 'login_required' | 'success' | 'error'>('confirmation');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');


  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleCustomChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  /* Logic Utk button Join invalid */
  const isValid = Boolean(
    formData.nama &&
    formData.whatsapp &&
    formData.sekolah &&
    formData.kelas &&
    formData.jurusan &&
    formData.tanggalLahir &&
    formData.pesan
  );

  const handleJoinClick = () => {
    if (!session) {
      setModalType('login_required');
      setShowModal(true);
      return;
    }

    const newErrors: { [key: string]: boolean } = {};
    if (!formData.nama) newErrors.nama = true;
    if (!formData.whatsapp) newErrors.whatsapp = true;
    if (!formData.sekolah) newErrors.sekolah = true;
    if (!formData.kelas) newErrors.kelas = true;
    if (!formData.jurusan) newErrors.jurusan = true;
    if (!formData.tanggalLahir) newErrors.tanggalLahir = true;
    if (!formData.pesan) newErrors.pesan = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setStatus('idle');
    setModalType('confirmation');
    setShowModal(true);
  };


  const handleSystemSubmit = async () => {
    setStatus('loading');
    const result = await submitJoinForm(formData);

    if (result.success) {
      setStatus('success');
      setModalType('success'); // Switch to success modal
      setFormData({
        nama: '',
        tanggalLahir: '',
        whatsapp: '',
        sekolah: '',
        kelas: '',
        jurusan: '',
        pesan: ''
      });
    } else {
      console.error(result.error);
      setStatus('idle');
      setErrorMessage(result.error || 'Gagal mengirim data. Silakan coba lagi.');
      setModalType('error');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row w-full overflow-hidden ${dmSans.className}`}>


{/* MODAL IMPLEMENTATION */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={
            modalType === 'login_required' ? 'Login Diperlukan' : 
            modalType === 'success' ? 'Terima Kasih!' : 
            modalType === 'error' ? 'Gagal Mengirim' :
            'Konfirmasi Pendaftaran'
        }
        type={
            modalType === 'login_required' ? 'warning' :
            modalType === 'success' ? 'success' :
            modalType === 'error' ? 'error' :
            'warning'
        }
        message={
            modalType === 'login_required' ? 'Anda harus masuk atau mendaftar terlebih dahulu untuk bergabung dengan Ambalan.' :
            modalType === 'success' ? 'Data Anda telah berhasil dikirim oleh sistem ke Admin Ambalan. Mohon tunggu konfirmasi selanjutnya.' :
            modalType === 'error' ? errorMessage :
            undefined
        }
        primaryAction={
            modalType === 'confirmation' ? {
                label: 'Selesai',
                onClick: handleSystemSubmit,
                isLoading: status === 'loading',
                variant: 'success'
            } : modalType === 'success' || modalType === 'error' ? {
                label: 'Tutup',
                onClick: () => setShowModal(false),
                variant: modalType === 'error' ? 'danger' : 'success'
            } : undefined
        }
      >
        {modalType === 'login_required' && (
            <div className="flex flex-col gap-3 w-full mt-4">
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
        )}

        {modalType === 'confirmation' && (
            <div className="w-full text-left mt-2">
                <div className="flex flex-col items-center mb-6 w-full text-center">
                    <p className="text-red-500 font-bold text-sm mb-1">DISCLAIMER!!!</p>
                    <p className="text-red-500 text-xs leading-relaxed">
                    "Pastikan data yang Anda masukkan adalah data yang valid dan benar.
                    Kesalahan penulisan data dapat menghambat proses administrasi keanggotaan."
                    </p>
                </div>

                <div className="w-full h-px bg-gray-200 mb-6"></div>

                <div className="flex flex-col items-center mb-4 w-full text-center">
                    <p className="text-green-600 font-bold text-sm mb-1">PEMBERITAHUAN</p>
                    <p className="text-gray-600 text-xs leading-relaxed mb-2">
                    Data Anda akan diproses secara otomatis oleh <b>(Sistem Mada)</b> dan dikirimkan langsung ke Server Admin.
                    </p>
                    <p className="text-green-700 font-medium text-xs">
                    "Mohon tunggu hingga proses pengiriman data selesai."
                    </p>
                </div>
            </div>
        )}
      </Modal>


      <div className="w-full lg:w-[70%] bg-[#322F2D] p-6 md:p-16 lg:py-[100px] lg:px-[315px] lg:pr-[150px] flex flex-col justify-center relative z-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">

          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight">
            Pendaftaran<br /> Anggota Ambalan
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-300 mb-8 text-sm md:text-base">
            Daftarkan diri Anda melalui formulir berikut.
          </motion.p>


          <form onSubmit={(e) => e.preventDefault()}>


            <InputField
              name="nama"
              value={formData.nama}
              onChange={handleInputChange}
              placeholder="Masukkan Nama Lengkap..."
              isNameInput={true}
              error={errors.nama}
            />


            <InputField
              name="tanggalLahir"
              value={formData.tanggalLahir}
              onChange={handleInputChange}
              type="date"
              placeholder="Tanggal Lahir"
              isDateInput={true}
              error={errors.tanggalLahir}
            />


            <PhoneInput
              name="whatsapp"
              value={formData.whatsapp}
              onChange={(val) => handleCustomChange('whatsapp', val)}
              placeholder="Masukkan nomor tlpn / WhatsApp"
              error={errors.whatsapp}
            />


            <InputField
              name="sekolah"
              value={formData.sekolah}
              onChange={handleInputChange}
              placeholder="Asal Sekolah"
              error={errors.sekolah}
            />


            <CustomSelect
              placeholder="Pilih Kelas"
              options={["X (Sepuluh)", "XI (Sebelas)", "XII (Dua Belas)"]}
              value={formData.kelas}
              onChange={(val) => handleCustomChange('kelas', val)}
              error={errors.kelas}
            />

            <CustomSelect
              placeholder="Pilih Jurusan"
              options={[
                "RPL (Rekayasa Perangkat Lunak)", "Animasi", "DPIB (Desain Pemodelan & Info Bangunan)",
                "TKJ (Teknik Komputer & Jaringan)", "TSM (Teknik Sepeda Motor)", "TKR (Teknik Kendaraan Ringan)",
                "TPM (Teknik Pemesinan)", "TITL (Teknik Instalasi Tenaga Listrik)", "TEI (Teknik Elektronika Industri)",
                "TAV (Teknik Audio Video)", "TKP (Teknik Konstruksi & Perumahan)"
              ]}
              value={formData.jurusan}
              onChange={(val) => handleCustomChange('jurusan', val)}
              error={errors.jurusan}
            />


            <motion.div variants={itemVariants} className="mb-8">
              <textarea
                name="pesan"
                value={formData.pesan}
                onChange={handleInputChange}
                placeholder="Message (Alasan Kenapa Masuk Ambalan???)"
                rows={4}
                className={`w-full bg-white rounded-lg py-4 px-5 text-gray-800 placeholder-gray-400 resize-none 
                border transition-all
                ${errors.pesan
                    ? 'border-red-500 ring-red-200 focus:ring-red-500 ring-1'
                    : 'border-transparent hover:border-[#9C7C5B] hover:ring-1 hover:ring-[#9C7C5B] focus:outline-none focus:ring-2 focus:ring-[#9C7C5B]'
                  }`}
              ></textarea>
              {errors.pesan && <p className="text-red-500 text-xs mt-1">silahkan masukan alasan anda</p>}
            </motion.div>


            <motion.button
              variants={itemVariants}
              whileHover={isValid ? { scale: 1.02, backgroundColor: "#8A6A4B" } : {}}
              whileTap={isValid ? { scale: 0.98 } : {}}
              onClick={handleJoinClick}
              disabled={!isValid}
              className={`w-full font-bold py-4 rounded-lg transition-colors duration-300 shadow-lg tracking-wide text-lg
                ${isValid
                  ? 'bg-[#9C7C5B] text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                }`}
            >
              Join
            </motion.button>
          </form>
        </motion.div>
      </div>


      <motion.div variants={rightSideVariants} initial="hidden" animate="visible" className="w-full lg:w-[55%] bg-[#C4A484] relative flex items-center justify-center min-h-[500px] lg:min-h-screen overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#9C7C5B] rounded-br-[100px] transform -translate-x-20 -translate-y-20 z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#8A5A2B] rounded-tl-[150px] transform translate-x-20 translate-y-30 z-0 pointer-events-none opacity-80"></div>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: "spring", stiffness: 60 }} className="relative z-10 w-[80%] h-auto pointer-events-none">
          <Image src="/Icon/MASKOT_GAJAH.svg" alt="Maskot Gajah Ambalan" width={800} height={800} className="object-contain drop-shadow-2xl" priority />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JoinUs;