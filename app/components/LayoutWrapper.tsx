

'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Navbar from "./navbar";
import Footer from "./footer";
import { SessionProvider } from "next-auth/react";
import LoadingScreen from './LoadingScreen';
import { AnimatePresence } from 'framer-motion';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Determine if we should show the nav/footer
  const noNavRoutes = ['/login', '/register', '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb', '/dashboard', '/umkm-register'];
  const showNavAndFooter = !noNavRoutes.some((route) => pathname.startsWith(route));

  // Handle loading state completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <SessionProvider>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading-screen" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        {showNavAndFooter && <Navbar />}
        {children}
        {showNavAndFooter && <Footer />}
      </div>
    </SessionProvider>
  );
}