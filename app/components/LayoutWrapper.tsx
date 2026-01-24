

'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Navbar from "./navbar";
import Footer from "./footer";
import { SessionProvider } from "next-auth/react";
import LoadingScreen from './LoadingScreen';
import { AnimatePresence, motion } from 'framer-motion';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  // Check session storage on mount to show loading screen only once
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('hasVisited');
    if (hasLoaded) {
      setIsLoading(false);
    } else {
      // Allow loading screen to show, it will call onComplete when done
      setIsLoading(true);
    }
  }, []);

  // Determine if we should show the nav/footer
  const noNavRoutes = ['/login', '/register', '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb', '/dashboard', '/umkm-register'];
  const showNavAndFooter = !noNavRoutes.some((route) => pathname.startsWith(route));

  // Handle loading state completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem('hasVisited', 'true');
  };

  return (
    <SessionProvider>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading-screen" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: "100%" }}
        animate={isLoading ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-0"
        style={{ position: isLoading ? 'fixed' : 'relative', width: '100%', height: '100%' }} // Prevent scroll while loading
      >
        {showNavAndFooter && <Navbar />}
        {children}
        {showNavAndFooter && <Footer />}
      </motion.div>
    </SessionProvider>
  );
}