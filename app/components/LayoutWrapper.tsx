// app/components/LayoutWrapper.tsx

'use client'; // This must be a Client Component

import { usePathname } from 'next/navigation';
import React from 'react';
import Navbar from "./navbar"; // Make sure the path is correct
import Footer from "./footer"; // Make sure the path is correct
import { SessionProvider } from "next-auth/react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Get the current path
  const pathname = usePathname();

  // 2. Define routes where Navbar/Footer should NOT appear
  const noNavRoutes = ['/login', '/register', '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb'];

  // 3. Check if the current path starts with any of the restricted routes
  const showNavAndFooter = !noNavRoutes.some((route) => pathname.startsWith(route));

  return (
    <SessionProvider>
      {/* Conditionally render Navbar */}
      {showNavAndFooter && <Navbar />}

      {/* Always render the page content */}
      {children}

      {/* Conditionally render Footer */}
      {showNavAndFooter && <Footer />}
    </SessionProvider>
  );
}