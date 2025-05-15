
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectPath?: string;
}

const AuthGuard = ({
  children,
  requireAuth = true,
  redirectPath = '/login',
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  
  // Show loading state when user is undefined (still initializing)
  if (user === undefined || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 w-full max-w-md mx-auto">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Logged in but needs to be logged out
  if (user && !requireAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  // Not logged in but needs to be logged in
  if (!user && requireAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  // Default case: render children
  return <>{children}</>;
};

export default AuthGuard;
