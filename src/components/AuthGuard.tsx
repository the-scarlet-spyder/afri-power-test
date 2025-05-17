
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Skeleton } from "@/components/ui/skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireCode?: boolean;
  redirectPath?: string;
  adminOnly?: boolean;
}

const AuthGuard = ({
  children,
  requireAuth = true,
  requireCode = false,
  redirectPath = '/login',
  adminOnly = false,
}: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const [hasAccessCode, setHasAccessCode] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(requireCode || adminOnly);
  
  useEffect(() => {
    const checkAccessRequirements = async () => {
      if (!user) {
        setCheckingAccess(false);
        return;
      }
      
      // Check access code if required
      if (requireCode) {
        try {
          const { data, error } = await supabase.rpc('has_valid_access_code', {
            _user_id: user.id
          });
          
          if (error) {
            console.error('Error checking access code:', error);
            setHasAccessCode(false);
          } else {
            setHasAccessCode(data);
          }
        } catch (err) {
          console.error('Error checking access code:', err);
          setHasAccessCode(false);
        }
      }
      
      // Check admin status if required
      if (adminOnly) {
        // Temporary solution since we're using a hardcoded admin list
        const ADMIN_EMAILS = ['adrian.m.adepoju@gmail.com']; // Make sure this matches the one in Navbar.tsx
        const isUserAdmin = user && ADMIN_EMAILS.includes(user.email);
        setIsAdmin(isUserAdmin);
        
        // Future implementation that would use RPC:
        /*
        try {
          const { data, error } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
          } else {
            setIsAdmin(data);
          }
        } catch (err) {
          console.error('Error checking admin status:', err);
          setIsAdmin(false);
        }
        */
      }
      
      setCheckingAccess(false);
    };
    
    if (user && (requireCode || adminOnly)) {
      checkAccessRequirements();
    } else {
      setCheckingAccess(false);
    }
  }, [user, requireCode, adminOnly]);
  
  console.log("AuthGuard state:", { 
    user, 
    isLoading, 
    requireAuth, 
    requireCode, 
    hasAccessCode, 
    adminOnly, 
    isAdmin,
    checkingAccess,
    redirectPath
  });
  
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
    console.log("User is logged in but page requires no auth, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Not logged in but needs to be logged in
  if (!user && requireAuth) {
    console.log("User is not logged in but page requires auth, redirecting to:", redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // User doesn't have access code but it's required
  if (user && requireCode && hasAccessCode === false) {
    console.log("User doesn't have access code, redirecting to access code page");
    return <Navigate to="/access-code" replace />;
  }

  // User is not admin but the page requires admin access
  if (user && adminOnly && isAdmin === false) {
    console.log("User is not admin but page requires admin access, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // Default case: render children
  return <>{children}</>;
};

export default AuthGuard;
