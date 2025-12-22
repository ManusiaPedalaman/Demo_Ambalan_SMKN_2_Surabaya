

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import Navbar from "./navbar";
import Footer from "./footer";
import { SessionProvider } from "next-auth/react";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();


  const noNavRoutes = ['/login', '/register', '/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb'];


  const showNavAndFooter = !noNavRoutes.some((route) => pathname.startsWith(route));

  return (
    <SessionProvider>

      {showNavAndFooter && <Navbar />}


      {children}


      {showNavAndFooter && <Footer />}
    </SessionProvider>
  );
}