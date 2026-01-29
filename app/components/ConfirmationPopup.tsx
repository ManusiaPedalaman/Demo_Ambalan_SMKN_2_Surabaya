'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmationPopupProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string; // e.g. 'bg-red-600' or 'bg-green-600'
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    icon?: 'warning' | 'check' | 'alert';
}

export default function ConfirmationPopup({
    isOpen,
    title,
    message,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    confirmColor = 'bg-blue-600',
    onConfirm,
    onCancel,
    isLoading = false,
    icon = 'warning'
}: ConfirmationPopupProps) {
    
    const getIconContent = () => {
        switch (icon) {
            case 'check':
                return { bg: 'bg-green-100', text: 'text-green-600', icon: <CheckCircle size={32} /> };
            case 'alert':
                return { bg: 'bg-red-100', text: 'text-red-600', icon: <AlertTriangle size={32} /> };
            case 'warning':
            default:
                return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: <AlertTriangle size={32} /> };
        }
    };

    const iconStyle = getIconContent();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={!isLoading ? onCancel : undefined}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${iconStyle.bg} ${iconStyle.text}`}>
                            {iconStyle.icon}
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                        <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                            {message}
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                disabled={isLoading}
                                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 py-2.5 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${confirmColor} hover:opacity-90`}
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
