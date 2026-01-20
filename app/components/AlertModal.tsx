'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
}

export default function AlertModal({ isOpen, onClose, type, title, message }: AlertModalProps) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle2 size={40} className="text-green-500" />;
            case 'error': return <XCircle size={40} className="text-red-500" />;
            case 'warning': return <AlertTriangle size={40} className="text-yellow-500" />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return 'border-green-500';
            case 'error': return 'border-red-500';
            case 'warning': return 'border-yellow-500';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 font-dm-sans">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative overflow-hidden"
                    >
                        <div className={`h-2 w-full ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                        
                        <div className="p-6 flex flex-col items-center text-center">
                            <div className="mb-4">
                                {getIcon()}
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                            <p className="text-gray-500 text-sm mb-6">{message}</p>
                            
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
