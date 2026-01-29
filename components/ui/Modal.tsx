'use client';

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type ModalType = 'success' | 'error' | 'warning' | 'info';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: ModalType;
  title: string;
  message?: string;
  children?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    isLoading?: boolean;
    variant?: 'primary' | 'danger' | 'success'; 
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

export default function Modal({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  children,
  primaryAction,
  secondaryAction
}: ModalProps) {
  
  // Icon configuration based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={40} className="text-green-600" />;
      case 'error':
        return <AlertTriangle size={40} className="text-red-600" />; // Or AlertCircle
      case 'warning':
        return <AlertTriangle size={40} className="text-yellow-600" />;
      default:
        return <Info size={40} className="text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-100';
      case 'error': return 'bg-red-100';
      case 'warning': return 'bg-yellow-100';
      default: return 'bg-blue-100';
    }
  };

  const getPrimaryButtonClass = () => {
     if (primaryAction?.variant === 'danger' || type === 'error') return 'bg-red-600 hover:bg-red-700 text-white';
     if (primaryAction?.variant === 'success' || type === 'success') return 'bg-green-600 hover:bg-green-700 text-white';
     return 'bg-[#9C7C5B] hover:bg-[#8A6A4B] text-white'; // Default Gold/Brown
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-sans"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            {!primaryAction?.isLoading && (
               <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10">
                  <X size={24} />
               </button>
            )}

            <div className="p-8 flex flex-col items-center text-center">
              {/* Icon Bubble */}
              <div className={`w-20 h-20 ${getBgColor()} rounded-full flex items-center justify-center mb-6`}>
                {getIcon()}
              </div>

              {/* Title & Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {title}
              </h3>
              
              {message && (
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  {message}
                </p>
              )}

              {/* Custom Content */}
              {children}

              {/* Actions */}
              {(primaryAction || secondaryAction) && (
                <div className="flex flex-col gap-3 w-full mt-2">
                  {primaryAction && (
                    <button
                      onClick={primaryAction.onClick}
                      disabled={primaryAction.isLoading}
                      className={`w-full py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2
                        ${getPrimaryButtonClass()} 
                        ${primaryAction.isLoading ? 'opacity-70 cursor-wait' : ''}
                      `}
                    >
                      {primaryAction.isLoading ? 'Memproses...' : primaryAction.label}
                    </button>
                  )}
                  
                  {secondaryAction && (
                    <button
                      onClick={secondaryAction.onClick}
                      disabled={primaryAction?.isLoading}
                      className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
                    >
                      {secondaryAction.label}
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
