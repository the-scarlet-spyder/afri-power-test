
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from "@/components/ui/skeleton";
import { checkIsAdmin } from '@/lib/access-code-service';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectPath?: string;
  adminRedirectPath?: string;
}

const AuthGuard = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectPath = '/login',
  adminRedirectPath = '/',
}: AuthGuardProps) => {
  const { user, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(requireAdmin);
  
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (!requireAdmin || !user?.id) {
        setIsCheckingAdmin(false);
        return;
      }
      
      try {
        const adminStatus = await checkIsAdmin(user.id);
        setIsAdmin(adminStatus);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };
    
    if (user && requireAdmin) {
      verifyAdminStatus();
    } else {
      setIsCheckingAdmin(false);
    }
  }, [user, requireAdmin]);
  
  // Show loading state when checking authentication or admin status
  if (authLoading || isCheckingAdmin) {
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
    console.log("User is logged in but page requires no auth, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Not logged in but needs to be logged in
  if (!user && requireAuth) {
    console.log("User is not logged in but page requires auth, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }
  
  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    console.log("User is not an admin but page requires admin, redirecting to:", adminRedirectPath);
    return <Navigate to={adminRedirectPath} replace />;
  }

  // Default case: render children
  return <>{children}</>;
};

export default AuthGuard;
