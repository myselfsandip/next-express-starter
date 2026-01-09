'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from '@/app/get-query-client'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Toaster position="top-right" richColors />
            </ThemeProvider>
        </QueryClientProvider>
    )
}
