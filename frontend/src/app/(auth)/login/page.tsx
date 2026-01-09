"use client"

import { CustomLoader } from "@/components/custom-loader";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/contexts/AuthContext";
import { headers } from "next/headers";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {

    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <CustomLoader />
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <LoginForm />
            </div>
        </div>
    )
}
