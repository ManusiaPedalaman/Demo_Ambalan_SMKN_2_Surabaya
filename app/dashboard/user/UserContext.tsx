'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { getUserDashboardData } from '@/app/actions';

interface UserDashboardContextType {
    profile: any;
    history: any; // stats removed as it is not returned by action
    loading: boolean;
    refreshData: () => Promise<void>;
}

const UserDashboardContext = createContext<UserDashboardContextType>({
    profile: null,
    history: { rentals: [], contacts: [], joins: [], quizzes: [] },
    loading: true,
    refreshData: async () => {},
});

export const useUserDashboard = () => useContext(UserDashboardContext);

export function UserDashboardProvider({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [data, setData] = useState<any>({
        profile: null,
        history: { rentals: [], contacts: [], joins: [], quizzes: [] }
    });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (session?.user?.email) {
            const dashboardData = await getUserDashboardData(session.user.email);
            // Action returns { profile, history } directly, or fallback object. No 'success' property.
            if (dashboardData && dashboardData.profile) {
                setData({
                    profile: dashboardData.profile,
                    history: dashboardData.history
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
