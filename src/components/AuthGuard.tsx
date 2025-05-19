
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectPath?: string;
  adminOnly?: boolean;
}

const AuthGuard = ({
  children,
  requireAuth = true,
  redirectPath = '/login',
  adminOnly = false,
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(adminOnly);
  
  useEffect(() => {
    const checkAccessRequirements = async () => {
      if (!user) {
        setCheckingAccess(false);
        return;
      }
      
      // Check admin status if required
      if (adminOnly) {
        // Temporary solution since we're using a hardcoded admin list
        const ADMIN_EMAILS = ['adrian.m.adepoju@gmail.com']; // Make sure this matches the one in Navbar.tsx
        const isUserAdmin = user && ADMIN_EMAILS.includes(user.email);
        setIsAdmin(isUserAdmin);
      }
      
      setCheckingAccess(false);
    };
    
    if (user && adminOnly) {
      checkAccessRequirements();
    } else {
      setCheckingAccess(false);
    }
  }, [user, adminOnly]);
  
  // Show loading state when authentication or access status is being checked
  if (isLoading || checkingAccess) {
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

  // User is not admin but the page requires admin access
  if (user && adminOnly && isAdmin === false) {
    return <Navigate to="/" replace />;
  }

  // Default case: render children
  return <>{children}</>;
};

export default AuthGuard;
