/**
 * Application Providers
 * Wraps the app with all necessary context providers
 */

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { Toaster } from '@/shared/components/ui/toaster';
import { Toaster as Sonner } from '@/shared/components/ui/sonner';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import AuthDataSync from '@/features/auth/components/AuthDataSync';
import AuthModalOpener from '@/features/auth/components/AuthModalOpener';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

interface ProvidersProps {
    children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <BrowserRouter
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <AuthProvider>
                        <AuthDataSync />
                        <AuthModalOpener />
                        {children}
                        <Toaster />
                        <Sonner />
                    </AuthProvider>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};
