import React from 'react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#F5F6FA]">
            <Sidebar />
            <main className="flex-1 w-full min-w-0 lg:ml-64 bg-[#F8FAFC]">
                {children}
            </main>
        </div>
    );
}
