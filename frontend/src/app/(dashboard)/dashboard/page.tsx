"use client"
import { CustomLoader } from '@/components/custom-loader';
import { ChartAreaInteractive } from '@/components/dashboard/chart-area-interactive';
import { SectionCards } from '@/components/dashboard/section-cards';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
    FileUserIcon,
    FileEditIcon,
    CheckCircleIcon,
    TrendingUp,

} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function page() {

    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return <CustomLoader />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                    </div>
                    {/* <DataTable data={data} /> */}

                    Recent Invoices Table
                </div>
            </div>
        </div>
    );
}
