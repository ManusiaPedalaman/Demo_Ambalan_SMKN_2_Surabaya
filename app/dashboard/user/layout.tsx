import React from 'react';
import UserSidebar from '@/app/components/UserSidebar';
import AdminGuard from '@/app/components/AdminGuard';

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-[#F5F6FA]">
                <UserSidebar />
                <main className="flex-1 w-full min-w-0 lg:ml-64 bg-[#F8FAFC]">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}
