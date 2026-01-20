'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;
        
        // If user is Admin, redirect to Admin Dashboard
        if ((session?.user as any)?.role === 'ADMIN') {
            router.push('/badys538qeprbdv89uebdao8e-39g-t86-u043b-voudvb');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return null; // Or a loading spinner
    }

    // Optionally hinder rendering if admin, though useEffect will redirect
    if ((session?.user as any)?.role === 'ADMIN') {
        return null; 
    }

    return <>{children}</>;
}
