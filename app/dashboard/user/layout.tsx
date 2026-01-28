import React from 'react';
import UserSidebar from '@/app/components/UserSidebar';
import AdminGuard from '@/app/components/AdminGuard';
import { UserDashboardProvider } from './UserContext';

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#F5F6FA]">
            <UserSidebar />
            <main className="flex-1 w-full min-w-0 lg:ml-64 bg-[#F8FAFC]">
                <AdminGuard>
                    <UserDashboardProvider>
                        {children}
                    </UserDashboardProvider>
                </AdminGuard>
            </main>
        </div>
    );
}
