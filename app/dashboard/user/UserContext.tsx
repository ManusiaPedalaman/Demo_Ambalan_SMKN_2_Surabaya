'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserDashboardData } from '@/app/actions';

interface UserDashboardContextType {
    profile: any;
    history: any;
    umkm: any; // Added umkm
    loading: boolean;
    refreshData: () => Promise<void>;
}

const UserDashboardContext = createContext<UserDashboardContextType>({
    profile: null,
    history: { rentals: [], contacts: [], joins: [], quizzes: [] },
    umkm: null, // Initial umkm
    loading: true,
    refreshData: async () => {},
});

export const useUserDashboard = () => useContext(UserDashboardContext);

export function UserDashboardProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [data, setData] = useState<any>({
        profile: null,
        history: { rentals: [], contacts: [], joins: [], quizzes: [] },
        umkm: null // Initial state
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (session?.user?.email) {
            const dashboardData = await getUserDashboardData(session.user.email);
            // Action returns { profile, history, umkm }
            if (dashboardData) {
                setData({
                    profile: dashboardData.profile,
                    history: dashboardData.history,
                    umkm: dashboardData.umkm
                });
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'loading') return;
        fetchData();
    }, [session, status]);

    return (
        <UserDashboardContext.Provider value={{ ...data, loading, refreshData: fetchData }}>
            {children}
        </UserDashboardContext.Provider>
    );
}
