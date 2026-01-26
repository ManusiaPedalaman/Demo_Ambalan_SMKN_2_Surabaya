'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export default function SuccessPopup({ 
    isOpen, 
    onClose,
    title = "Berhasil Disimpan",
    message = "Perubahan data Anda telah berhasil disimpan ke sistem."
}: SuccessPopupProps) {
    
    // Auto close after 3 seconds
    React.useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl relative z-10 max-w-sm w-full text-center flex flex-col items-center"
                    >
                        <div className="w-20 h-20 bg-[#997B55] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#997B55]/30">
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <Check size={40} className="text-white" strokeWidth={3} />
                            </motion.div>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-poppins">
                            {title}
                        </h3>
                        
                        <p className="text-gray-500 dark:text-gray-400 mb-8 font-dm-sans">
                            {message}
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all"
                        >
                            Tutup
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
